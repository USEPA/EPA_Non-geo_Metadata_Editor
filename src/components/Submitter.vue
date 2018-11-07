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
            color="primary"
            @click="openSubmitModal"
            icon="fas fa-paper-plane"
        />
    </q-page-sticky>

  </div>
</template>

<script>
import config from "../config";

export default {
  name: "Submitter",

  props: {
    doc: Object
  },

  methods: {
    openSubmitModal: function() {
      this.submitModalOpen = true;
    },

    closeSubmitModal: function() {
      this.submitModalOpen = false;
    },

    checkForErrors: function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    },

    notifySuccess: config.notifySuccess,

    notifyError: config.notifyError,

    submitToEpa: function() {
      //let submitUrl = "https://www.google.com/search?q=test";
      let token = "token=" + encodeURIComponent("recaptchaToken");
      let sponsor = "sponsor=" + encodeURIComponent("greene.ana@epa.gov");
      let metadata =
        "metadata=" + encodeURIComponent(JSON.stringify(this.doc, null, 4));
      let publisher = "publisher=Jane"; // + encodeURIComponent(this.doc.dataset[0].contactPoint.fn);

      let submitUrl = `https://edg.epa.gov/nongeoeditor/submithandler/sendMetadata.py?${token}&${sponsor}&${metadata}&${publisher}`;
      console.log(submitUrl);
      //return;

      fetch(submitUrl)
        .then(this.checkForErrors)
        .then(response => response.json())
        .then(result => {
          if (result.status == "success")
            this.notifySuccess("Metadata submitted to EPA successfully.");
          else throw Error("EPA service returned failure.");
        })
        .catch(error => this.notifyError(error));
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