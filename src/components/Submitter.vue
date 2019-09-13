<template>
  <div>
    <q-modal
      v-model="submitModalOpen"
      :content-css="{'padding': '10px','width': '500px','height': '300px', 'min-width': '500px','min-height': '300px', 'display': 'inline-block'}"
    >
      <q-modal-layout content-class="no-scroll">
        <q-layout-header>
          <q-toolbar color="primary">
            <q-btn flat round dense aria-label="submit icon">
              <v-icon name="paper-plane" scale="1.4" />
            </q-btn>
            <q-toolbar-title>Submit to EPA</q-toolbar-title>

            <q-btn flat round dense @click="closeSubmitModal" aria-label="close dialog">
              <v-icon name="times" scale="1.4" />
            </q-btn>
          </q-toolbar>
        </q-layout-header>

        <q-page-container>
          <q-page>
            Clicking Submit will send your metadata record to EPA's metadata team for review.
            You will receive confirmation via email if it is accepted into EPA's metadata inventory.
            <br />
            <br />Please contact edg@epa.gov if you wish to make changes to your record at any point in the future.
          </q-page>
        </q-page-container>

        <q-layout-footer style="background-color:white">
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
        </q-layout-footer>
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
      let sponsor =
        "sponsor=" + encodeURIComponent(this.doc.dataset[0].epa_contact);
      let publisher =
        "publisher=" + encodeURIComponent(this.doc.dataset[0].contactPoint.fn);

      let submitUrl = `https://edg.epa.gov/nongeoeditor/submithandler/sendMetadata.py?${token}&${sponsor}&${publisher}`;

      // Make a copy of the document and limit to the first dataset for submission
      let outDoc = config.clone(this.doc);
      outDoc.dataset.length = 1;
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