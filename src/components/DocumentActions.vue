<template>
  <div>
    <q-modal v-model="saveModalOpen">
      <q-modal-layout>
        <q-layout-header>
          <q-toolbar color="primary">
            <q-toolbar-title>{{filenameFull}}</q-toolbar-title>

            <q-btn flat round dense @click="closeSaveModal">
              <v-icon name="times" scale="1.4"/>
            </q-btn>
          </q-toolbar>
        </q-layout-header>

        <q-page-container>
          <q-page>
            <pre style="margin-top:0px;margin-bottom:0px"><code v-html="formatHighlight(doc)"/></pre>
          </q-page>
        </q-page-container>

        <q-layout-footer style="background-color:white">
          <q-item>
            <q-item-main label="Filename (leave empty to use document identifier):">
              <TextInput v-model="filename" :defaultText="filenameFull"/>
            </q-item-main>
            <q-item-side right>
              <q-btn color="primary" @click="saveDoc">
                <v-icon name="cloud-download-alt" scale="1.4"/>
              </q-btn>
            </q-item-side>
          </q-item>
        </q-layout-footer>
      </q-modal-layout>
    </q-modal>

    <q-modal v-model="loadModalOpen" :content-css="{'height':'auto', 'min-width': '25vw'}">
      <q-modal-layout>
        <q-layout-header>
          <q-toolbar color="primary">
            <q-toolbar-title>Load Metadata File</q-toolbar-title>

            <q-btn flat round dense @click="closeLoadModal">
              <v-icon name="times" scale="1.4"/>
            </q-btn>
          </q-toolbar>
        </q-layout-header>

        <q-page-container>
          <q-page v-if="docSize">
            <pre v-if="loadError"> {{loadErrorMessage}} </pre>
            <pre v-else style="margin-top:0px;margin-bottom:0px"><code v-html="formatHighlight(docToLoad)"/></pre>
          </q-page>
        </q-page-container>

        <q-layout-footer style="background-color:white">
          <q-item>
            <q-item-main label style="width:60%">
              <input
                type="file"
                accept="application/json"
                @input="openFile"
                @click="loadError=false; $event.target.value=null"
              >
            </q-item-main>
            <q-item-side right>
              <q-btn v-if="docSize" color="primary" @click="loadDoc" :disable="loadError">
                <v-icon name="edit" scale="1.4"/>
              </q-btn>
            </q-item-side>
          </q-item>
        </q-layout-footer>
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
    doc: {}
  },
  components: {
    TextInput
  },
  methods: {
    openLoadModal: function() {
      this.loadModalOpen = true;
    },

    closeLoadModal: function() {
      this.loadModalOpen = false;
    },

    openFile: function(e) {
      var reader = new FileReader();

      reader.onloaderror = function(err) {
        config.noop(err);
        // TODO: implement handling of errors while browser attempts to read the file
      };

      reader.onloadend = (function(that) {
        return function(ev) {
          that.parseFile(ev.target.result);
        };
      })(this);

      var file = e.target.files[0];
      reader.readAsText(file);
    },

    parseFile: function(s) {
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

    loadDoc: function(e) {
      config.noop(e);
      this.$emit("loadMd", this.docToLoad);
      this.closeLoadModal();
    },

    openSaveModal: function() {
      this.filenameInternal = this.doc.userGivenFilename;
      delete this.doc.userGivenFilename;
      this.saveModalOpen = true;
    },

    closeSaveModal: function() {
      this.doc.userGivenFilename = this.filenameInternal;
      this.saveModalOpen = false;
    },

    fastSaveDoc: function() {
      if (!this.filenameInternal) this.openSaveModal();
      else {
        this.saveDoc();
      }
    },

    saveDoc: function() {
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

    SaveAsFile: function(t, f, m) {
      try {
        var b = new Blob([t], { type: m });
        saveAs(b, f, false);
      } catch (e) {
        // Fall back to forcing a download by opening a new window
        window.open("data:" + m + "," + encodeURIComponent(t), "_blank", "");
      }
    },

    perform: function(action) {
      if (action == "load") {
        this.openLoadModal();
      } else if (action == "view") {
        this.fastSaveDoc();
      } else if (action == "save") {
        this.openSaveModal();
      }
      this.action_ = "";
      this.$emit("modalClosed");
    },

    formatHighlight: formatHighlight
  },

  computed: {
    docSize() {
      return Object.keys(this.docToLoad).length;
    },

    filename: {
      get: function() {
        return this.filenameInternal;
      },
      set: function(newValue) {
        this.filenameInternal = newValue;
      }
    },

    filenameFull: {
      get: function() {
        return (
          this.filenameInternal || this.doc.dataset[0].identifier + ".json"
        );
      }
    }
  },

  watch: {
    action: {
      handler: function(newAction) {
        this.action_ = newAction;
        this.perform(this.action_);
      },
      immediate: true
    }
  },

  data() {
    return {
      action_: "",
      menuOpen: true,
      saveModalOpen: false,
      loadModalOpen: false,
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