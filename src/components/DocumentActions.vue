<template>    
<div>
    <q-modal v-model="modalOpen">
        <q-modal-layout>
            <q-layout-header>

                <q-toolbar color="primary">
                    <q-toolbar-title>
                        {{filenameFull}}
                    </q-toolbar-title>

                    <q-btn flat round dense icon="close" @click="closeModal"/>
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
                        <TextInput :userText.sync="filename" />
                    </q-item-main>
                    <q-item-side right>
                        <q-btn icon="save" color="primary" @click="saveDoc"/>
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
                icon="far fa-save"
            >
                <q-tooltip anchor="center left" self="center right">Save</q-tooltip>
            </q-fab-action>

            <q-fab-action
                color="primary"
                @click="openModal()"
                icon="fas fa-file"
            >
                <q-tooltip anchor="center left" self="center right">View</q-tooltip>
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
    doc: Object
  },
  components: {
    TextInput
  },
  methods: {
    openModal: function() {
      this.filenameInternal = this.doc.userGivenFilename;
      delete this.doc.userGivenFilename;
      this.modalOpen = true;
    },

    closeModal: function() {
      this.doc.userGivenFilename = this.filenameInternal;
      this.modalOpen = false;
    },

    fastSaveDoc: function() {
      if (!this.filenameInternal) this.openModal();
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
        return this.filenameInternal || this.doc.identifier + ".json";
      }
    }
  },
  data() {
    return {
      modalOpen: false,
      filenameInternal: ""
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