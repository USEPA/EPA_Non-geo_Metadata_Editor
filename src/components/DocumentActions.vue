<template>
  <div>
    <q-modal v-model="saveModalOpen">
      <q-modal-layout>
        <div>
          <q-toolbar color="primary">
            <q-toolbar-title>{{filenameFull}}</q-toolbar-title>

            <q-btn flat round dense @click="closeSaveModal" aria-label="close dialog">
              <v-icon name="times" scale="1.4" />
            </q-btn>
          </q-toolbar>
        </div>

        <div>
          <pre style="margin-top:0px;margin-bottom:0px"><code v-html="formatHighlight(doc)" /></pre>
        </div>

        <div style="background-color:white">
          <q-item>
            <q-item-main label="Filename (leave empty to use document identifier):">
              <TextInput v-model="filename" :defaultText="filenameFull" />
            </q-item-main>
            <q-item-side right>
              <q-btn color="primary" @click="saveDoc" aria-label="download metadata record">
                <v-icon name="cloud-download-alt" scale="1.4" />
              </q-btn>
            </q-item-side>
          </q-item>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-modal v-model="loadModalOpen" :content-css="{'height':'auto', 'min-width': '25vw'}">
      <q-modal-layout>
        <div>
          <q-toolbar color="primary">
            <q-toolbar-title>Load Metadata Record</q-toolbar-title>

            <q-btn flat round dense @click="closeLoadModal" aria-label="close dialog">
              <v-icon name="times" scale="1.4" />
            </q-btn>
          </q-toolbar>
        </div>

        <div v-if="selectedRecord">
          <pre v-if="loadError"> {{loadErrorMessage}} </pre>
          <pre v-else style="margin-top:0px;margin-bottom:0px"><code v-html="formatHighlight(docToLoad.dataset[selectedRecord])" /></pre>
        </div>
        <div v-else style="margin:1em">
          <q-select
            stack-label="Pick repository"
            v-model="selectedRepo"
            :options="availableRepos"
            :filter="availableRepos.length>10"
          />
          <div v-if="selectedRepo=='local'">
            <br />
            <br />
            <input
              type="file"
              accept="application/json"
              @input="openFile"
              @click="loadError=false; $event.target.value=null"
            />
          </div>
          <div v-if="docToLoad && docToLoad.hasOwnProperty('dataset')">
            <br />
            <br />
            <q-select
              stack-label="Pick metadata record"
              v-model="selectedRecord"
              :options="availableRecords"
              :filter="availableRecords.length>10"
            />
          </div>
        </div>

        <div style="background-color:white">
          <q-item>
            <q-item-main label style="width:60%"></q-item-main>
            <q-item-side left>
              <q-btn
                v-if="selectedRecord!=null"
                color="primary"
                @click="loadDoc"
                :disable="loadError"
                aria-label="edit metadata record"
              >
                <v-icon name="edit" scale="1.4" />
              </q-btn>
            </q-item-side>
          </q-item>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
import TextInput from "../components/TextInput.vue";
import saveAs from "file-saver";
import config from "../config";
import formatHighlight from "json-format-highlight";

export default {
  name: "DocumentActions",
  props: {
    action: "",
    doc: {},
    isEpaUser: false
  },
  components: {
    TextInput
  },
  methods: {
    openLoadModal: function () {
      fetch(
        "https://edg.epa.gov/data/public/epa-open-data-dcat-files.json"
      )
        .then(response => response.json())
        .then(data => {
          this.edgRoot = data.root
          this.availableRepos = data.files.map(repo => { return { "value": repo.file, "label": repo.title, "epaOnly": repo.epaOnly || true } }).filter(repo => !repo.epaOnly || this.isEpaUser)
        }).then(
          () => {
            if (!this.availableRepos || !this.availableRepos.length)
              this.availableRepos = []
            this.availableRepos.unshift({ "value": "local", "label": "[From a local file...]" })
            this.loadModalOpen = true;

          }
        )
    },

    closeLoadModal: function () {
      this.loadModalOpen = false;
      this.selectedRecord = null
    },

    openFile: function (e) {
      var reader = new FileReader();

      reader.onloaderror = function (err) {
        config.noop(err);
        // TODO: implement handling of errors while browser attempts to read the file
      };

      reader.onloadend = (function (that) {
        return function (ev) {
          that.parseFile(ev.target.result);
        };
      })(this);

      var file = e.target.files[0];
      reader.readAsText(file);
    },

    parseFile: function (s) {
      var parsedObj;
      try {
        parsedObj = JSON.parse(s);
        this.loadError = false;
        this.loadErrorMessage = "";
      } catch (ex) {
        parsedObj = {};
        this.loadError = true;
        this.loadErrorMessage =
          "Encountered '" + ex.name + "' while reading file.";
      }
      this.docToLoad = parsedObj;
    },

    loadDoc: function (e) {
      config.noop(e);
      this.$emit("loadMd", { "repo": this.selectedRepo, "dataset": [config.clone(this.docToLoad.dataset[this.selectedRecord])] });
      this.closeLoadModal()
    },

    resetDoc: function (e) {
      config.noop(e);
      this.$emit("loadMd", { "repo": "local", "dataset": [] });
      this.closeLoadModal()
    },

    openSaveModal: function () {
      this.filenameInternal = this.doc.userGivenFilename;
      delete this.doc.userGivenFilename;
      this.saveModalOpen = true;
    },

    closeSaveModal: function () {
      this.doc.userGivenFilename = this.filenameInternal;
      this.saveModalOpen = false;
    },

    fastSaveDoc: function () {
      if (!this.filenameInternal) this.openSaveModal();
      else {
        this.saveDoc();
      }
    },

    saveDoc: function () {
      var outDoc = JSON.stringify(this.doc, null, 4);

      this.SaveAsFile(
        outDoc,
        this.filenameFull,
        "application/json;charset=" + window.document.charset
      );

      this.$q.notify(
        "Metadata document '" + this.filenameFull + "' downloaded"
      );
    },

    SaveAsFile: function (t, f, m) {
      try {
        var b = new Blob([t], { type: m });
        saveAs(b, f, false);
      } catch (e) {
        // Fall back to forcing a download by opening a new window
        window.open("data:" + m + "," + encodeURIComponent(t), "_blank", "");
      }
    },

    perform: function (action) {
      if (action == "load") {
        this.openLoadModal();
      } else if (action == "view") {
        this.fastSaveDoc();
      } else if (action == "save") {
        this.openSaveModal();
      } else if (action == "clear") {
        this.resetDoc();
      }
      this.action_ = "";
      this.$emit("modalClosed");
    },

    formatHighlight: formatHighlight
  },

  computed: {

    filename: {
      get: function () {
        return this.filenameInternal;
      },
      set: function (newValue) {
        this.filenameInternal = newValue;
      }
    },

    filenameFull: {
      get: function () {
        return (
          this.filenameInternal || this.doc.dataset[0].identifier + ".json"
        );
      }
    }
  },

  watch: {

    action: {
      handler: function (newAction) {
        this.action_ = newAction;
        this.perform(this.action_);
      },
      immediate: true
    },

    selectedRepo: {
      handler: function () {
        if (this.edgRoot && this.selectedRepo && this.selectedRepo != 'local') {
          fetch(
            this.edgRoot + "/" + this.selectedRepo
          )
            .then(response => response.json())
            .then(data => {
              this.docToLoad = data
            });
        }
      },
      immediate: true
    },

    docToLoad: {
      handler: function (newDoc) {
        if (newDoc && newDoc.dataset)
          this.availableRecords = newDoc.dataset.map((record, index) => { return { "value": index, "label": record.title || 'Record #' + (index + 1) } })
      },
      immediate: true
    },

  },

  data () {
    return {
      action_: "",
      menuOpen: true,
      saveModalOpen: false,
      loadModalOpen: false,
      edgRoot: null,
      availableRepos: [],
      selectedRepo: null,
      availableRecords: [],
      selectedRecord: null,
      filenameInternal: "",
      docToLoad: Object,
      loadError: false,
      loadErrorMessage: ""
    };
  }
};
</script>

<style scoped>
</style>