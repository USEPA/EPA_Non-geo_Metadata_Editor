<template>    
  <div>
    <q-modal v-model="saveModalOpen">
        <q-modal-layout>
            <q-layout-header>

                <q-toolbar color="primary">
                    <q-toolbar-title>
                        {{filenameFull}}
                    </q-toolbar-title>

                    <q-btn flat round dense icon="close" @click="closeSaveModal"/>
                </q-toolbar>

            </q-layout-header>

            <q-page-container>
                <q-page>
                    <pre v-highlightjs="JSON.stringify(doc, null, 4)" style="margin-top:0px;margin-bottom:0px"><code class="JSON"/></pre>
                </q-page>
            </q-page-container>

            <q-layout-footer style="background-color:white">
                <q-item>
                    <q-item-main label="Filename (leave empty to use document identifier):">
                        <TextInput v-model="filename" :defaultText="filenameFull" />
                    </q-item-main>
                    <q-item-side right>
                        <q-btn icon="fas fa-cloud-download-alt" color="primary" @click="saveDoc"/>
                    </q-item-side>
                </q-item>
            </q-layout-footer>
        </q-modal-layout>
    </q-modal>


    <q-modal v-model="loadModalOpen">
        <q-modal-layout>
            <q-layout-header>

                <q-toolbar color="primary">
                    <q-toolbar-title>
                        Load Metadata File
                    </q-toolbar-title>

                    <q-btn flat round dense icon="close" @click="closeLoadModal"/>
                </q-toolbar>

            </q-layout-header>

            <q-page-container id="xxx">
                <q-page>
                  <pre v-if="loadError"> {{loadErrorMessage}} </pre>
                  <pre v-else v-highlightjs="JSON.stringify(docToLoad, null, 4)" style="margin-top:0px;margin-bottom:0px"><code class="JSON"/></pre>
                </q-page>
            </q-page-container>

            <q-layout-footer style="background-color:white">
                <q-item>
                    <q-item-main label="" style="width:60%">
                      <input type='file' accept='application/json' @input="openFile" @click="loadError=false; $event.target.value=null"/>
                    </q-item-main>
                    <q-item-side right>
                        <q-btn icon="edit" color="primary" @click="loadDoc" :disable="loadError"/>
                    </q-item-side>
                </q-item>
            </q-layout-footer>
        </q-modal-layout>
    </q-modal>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
            color="primary"
            icon="fas fa-ellipsis-v"
            direction="up"
        >
            
            <q-fab-action
                color="primary"
                @click="fastSaveDoc"
                icon="fas fa-cloud-download-alt"
            >
                <q-tooltip anchor="center left" self="center right">Save</q-tooltip>
            </q-fab-action>

            <q-fab-action
                color="primary"
                @click="openSaveModal()"
                icon="fas fa-eye"
            >
                <q-tooltip anchor="center left" self="center right">View</q-tooltip>
            </q-fab-action>

            <q-fab-action
                color="primary"
                @click="openLoadModal()"
                icon="fas fa-cloud-upload-alt"
            >
                <q-tooltip anchor="center left" self="center right">Load</q-tooltip>
            </q-fab-action>

    </q-fab>
    </q-page-sticky>

  </div>
</template>

<script>
import TextInput from "../components/TextInput.vue";
import saveAs from "file-saver";

export default {
  name: "DocumentActions",
  props: {
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
        console.log("ERROR");
        console.log(err);
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
      document.getElementById("xxx").scrollTop = 0;
    },

    loadDoc: function(e) {
      console.log("Emitting event");
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
        "Metadata document '" + this.filenameInternal + "' downloaded"
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
    }
  },
  computed: {
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
  data() {
    return {
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
.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #333;
  background: #f8f8f8;
}
.hljs-comment,
.hljs-quote {
  color: #998;
  font-style: italic;
}
.hljs-keyword,
.hljs-selector-tag,
.hljs-subst {
  color: #333;
  font-weight: bold;
}
.hljs-number,
.hljs-literal,
.hljs-variable,
.hljs-template-variable,
.hljs-tag .hljs-attr {
  color: #008080;
}
.hljs-string,
.hljs-doctag {
  color: #d14;
}
.hljs-title,
.hljs-section,
.hljs-selector-id {
  color: #900;
  font-weight: bold;
}
.hljs-subst {
  font-weight: normal;
}
.hljs-type,
.hljs-class .hljs-title {
  color: #458;
  font-weight: bold;
}
.hljs-tag,
.hljs-name,
.hljs-attribute {
  color: #000080;
  font-weight: normal;
}
.hljs-regexp,
.hljs-link {
  color: #009926;
}
.hljs-symbol,
.hljs-bullet {
  color: #990073;
}
.hljs-built_in,
.hljs-builtin-name {
  color: #0086b3;
}
.hljs-meta {
  color: #999;
  font-weight: bold;
}
.hljs-deletion {
  background: #fdd;
}
.hljs-addition {
  background: #dfd;
}
.hljs-emphasis {
  font-style: italic;
}
.hljs-strong {
  font-weight: bold;
}
</style>