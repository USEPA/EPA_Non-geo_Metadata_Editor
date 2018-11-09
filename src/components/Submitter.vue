<template>
  <div>
    <q-modal v-model="submitModalOpen">
        <q-modal-layout>
            <q-layout-header>

                <q-toolbar color="primary">
                    <q-btn flat round dense icon="fas fa-paper-plane" />
                    <q-toolbar-title>
                        Submit to EPA
                    </q-toolbar-title>

                    <q-btn flat round dense icon="close" @click="closeSubmitModal"/>
                </q-toolbar>

            </q-layout-header>

            <q-page-container>
                <q-page>
                    <pre>
 Clicking Submit will send your metadata record to EPA's metadata team for review. 
 You will receive confirmation via email if it is accepted into EPA's metadata inventory. 
 Please contact edg@epa.gov if you wish to make changes to your record at any point in the future.

 [Please ignore lack of styling for now.]
                    </pre>
                </q-page>
            </q-page-container>

            <q-layout-footer style="background-color:white">
                <q-item>
                    <q-item-main>
                    </q-item-main>
                    <q-item-side right>
                        <q-btn label="Submit" color="primary" @click="submitToEpa"/>
                        &nbsp;
                        <q-btn label="Cancel" color="primary" @click="closeSubmitModal"/>
                    </q-item-side>
                </q-item>
            </q-layout-footer>
        </q-modal-layout>
    </q-modal>

    <q-page-sticky position="bottom-right" :offset="[80, 24]">
        <q-btn
            round
            :color="docError?'negative':'positive'"
            @click="attemptSubmit"
            icon="fas fa-paper-plane"
        >
            <q-tooltip anchor="center left" self="center right">Submit</q-tooltip>
        </q-btn>
    </q-page-sticky>

  </div>
</template>

<script>
import config from "../config";

export default {
  name: "Submitter",

  props: {
    doc: Object,
    docError: ""
  },

  methods: {
    openSubmitModal: function() {
      this.submitModalOpen = true;
    },

    closeSubmitModal: function() {
      this.submitModalOpen = false;
    },

    attemptSubmit: function() {
      if (!this.docError) this.openSubmitModal();
      else this.notifyError(this.docError);
    },

    checkForErrors: function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    },

    notifySuccess: config.notifySuccess,

    notifyError: function(error) {
      let notify = config.notifyError.bind(this);
      notify(error);
    },

    submitToEpa: function() {
      let token = "token=" + encodeURIComponent("recaptchaToken");
      let sponsor = "sponsor=" + encodeURIComponent("greene.ana@epa.gov");
      let publisher =
        "publisher=" + encodeURIComponent(this.doc.dataset[0].contactPoint.fn);

      let submitUrl = `https://edg.epa.gov/nongeoeditor/submithandler/sendMetadata.py?${token}&${sponsor}&${publisher}`;

      let metadata = JSON.stringify(this.doc, null, 4);

      fetch(submitUrl, { method: "POST", body: metadata })
        .then(this.checkForErrors)
        .then(response => response.json())
        .then(result => {
          if (result.status == "success")
            this.notifySuccess("Metadata submitted to EPA successfully.");
          else throw Error("EPA service returned " + result.status);
        })
        .catch(error =>
          this.notifyError({
            name: "Error while submitting metadata to EPA",
            message: error.message
          })
        );
    },

    tooltipMessage: function() {
      let msg = "Submit";
      if (this.docError) msg += "<br/>";
      msg += this.docError.name + ": " + this.docError.message;
      return msg;
    }
  },

  data() {
    return {
      submitModalOpen: false
    };
  }
};
</script>

<style scoped>
</style>