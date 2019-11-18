<template>
  <div>
    <q-modal
      v-model="submitModalOpen"
      :content-css="{'padding': '10px','width': '500px','height': '300px', 'min-width': '500px','min-height': '300px', 'display': 'inline-block'}"
    >
      <q-modal-layout content-class="no-scroll">
        <div>
          <q-toolbar color="primary">
            <q-btn flat round dense aria-label="submit icon">
              <v-icon name="paper-plane" scale="1.4" />
            </q-btn>
            <q-toolbar-title>Submit to EPA</q-toolbar-title>

            <q-btn flat round dense @click="closeSubmitModal" aria-label="close dialog">
              <v-icon name="times" scale="1.4" />
            </q-btn>
          </q-toolbar>
        </div>

        <q-page>
          Clicking Submit will send your metadata record to EPA's metadata team for review.
          You will receive confirmation via email if it is accepted into EPA's metadata inventory.
          <br />
          <br />Please contact edg@epa.gov if you wish to make changes to your record at any point in the future.
        </q-page>

        <div style="background-color:white">
          <q-item>
            <q-item-main></q-item-main>
            <q-item-side left>
              <vue-recaptcha
                sitekey="6LdCVXsUAAAAABiV3upBSR5y_bzMQolNatwNLrQG"
                ref="recaptcha"
                badge="inline"
                @verify="onCaptchaVerified"
                @expired="onCaptchaExpired"
                size="invisible"
              ></vue-recaptcha>
            </q-item-side>
            <q-item-side right>
              <q-btn
                label="Submit"
                color="primary"
                @click="submit"
                aria-label="submit metadata record to EPA"
              />
            </q-item-side>
            <q-item-side right>
              <q-btn
                label="Cancel"
                color="primary"
                @click="closeSubmitModal"
                aria-label="close dialog"
              />
            </q-item-side>
          </q-item>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-page-sticky position="bottom-right" :offset="[24, 24]">
      <q-btn
        round
        :color="docError?'negative':'positive'"
        @click="attemptSubmit"
        aria-label="Submit button"
      >
        <v-icon name="paper-plane" :scale="1.4" />
        <q-tooltip
          anchor="center left"
          self="center right"
        >{{docError ? 'Document not valid yet. Please click for more info.' : 'Document valid. Please click to submit to EPA.'}}</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
import config from "../config";
import "whatwg-fetch";

if (document.querySelector("body").setActive != undefined) {
  document.querySelector("body").setActive();
}

export default {
  name: "Submitter",

  components: { VueRecaptcha },

  props: {
    user: null,
    doc: Object,
    docError: ""
  },

  methods: {
    openSubmitModal: function () {
      this.submitModalOpen = true;
    },

    closeSubmitModal: function () {
      this.submitModalOpen = false;
    },

    attemptSubmit: function () {
      if (!this.docError) this.openSubmitModal();
      else this.notifyError(this.docError);
    },

    checkForErrors: function (response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    },

    notifySuccess: config.notifySuccess,

    notifyError: function (error) {
      let notify = config.notifyError.bind(this);
      notify(error);
    },

    submitToEpa: function (recaptchaToken) {
      let token = "token=" + encodeURIComponent(recaptchaToken);
      let submitUrl = `https://edg.epa.gov/nongeoeditor/submithandler/sendMetadata.py?${token}&`;
      if (this.user) {
        let epaUserName = "epaUserName=" + encodeURIComponent(this.user.fullName)
        let repoURL = "repoURL=" + encodeURIComponent(this.doc.repo)

        submitUrl += `${epaUserName}&${repoURL}`;
      } else {
        let sponsorEmail =
          "sponsorEmail=" + encodeURIComponent(this.doc.dataset[0].epa_contact);
        let agreementType =
          "agreementType=" + encodeURIComponent(this.doc.dataset[0].epa_agreement_type);
        let agreementNumber =
          "agreementNumber=" + encodeURIComponent(this.doc.dataset[0].epa_agreement_no);

        submitUrl += `${sponsorEmail}&${agreementType}&${agreementNumber}`;
      }


      // Make a copy of the document and limit to the first dataset for submission
      let outDoc = config.clone(this.doc);
      outDoc.dataset.length = 1;

      // Exclude the following from the submitted document
      delete outDoc.repo
      delete outDoc.dataset[0].epa_agreement_type
      delete outDoc.dataset[0].epa_agreement_no

      let metadata = JSON.stringify(outDoc, null, 4);

      fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: "metadata=" + encodeURIComponent(metadata)
      })
        .then(this.checkForErrors)
        .then(response => response.json())
        .then(result => {
          if (result.status == "success") {
            this.closeSubmitModal();
            this.notifySuccess("Metadata submitted to EPA successfully.");
          } else throw Error("EPA service returned " + result.status);
        })
        .catch(error =>
          this.notifyError({
            name: "Error while submitting metadata to EPA",
            message: error.message
          })
        );
    },

    tooltipMessage: function () {
      let msg = "Submit";
      if (this.docError) msg += "<br/>";
      msg += this.docError.name + ": " + this.docError.message;
      return msg;
    },

    submit: function () {
      this.$refs.recaptcha.execute();
    },

    onCaptchaVerified: function (recaptchaToken) {
      const self = this;
      self.status = "submitting";
      self.$refs.recaptcha.reset();
      self.submitToEpa(recaptchaToken);
    },

    onCaptchaExpired: function () {
      this.$refs.recaptcha.reset();
    }
  },

  data () {
    return {
      submitModalOpen: false
    };
  }
};
</script>

<style scoped>
</style>