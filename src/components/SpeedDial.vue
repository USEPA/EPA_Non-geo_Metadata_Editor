<template>    

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
            color="primary"
            icon="fas fa-ellipsis-v"
            direction="up"
        >
            
            <q-fab-action
                color="primary"
                @click="saveDoc"
                icon="far fa-save"
            >
                <q-tooltip anchor="center left" self="center right">Save</q-tooltip>
            </q-fab-action>

            <q-fab-action
                color="primary"
                @click="$q.notify({message:doc})"
                icon="fas fa-file"
            >
                <q-tooltip anchor="center left" self="center right">View</q-tooltip>
            </q-fab-action>

    </q-fab>
    </q-page-sticky>

</template>

<script>
import saveAs from "file-saver";

export default {
  name: "SpeedDial",
  props: {
    doc: Object
  },
  methods: {
    saveDoc: function() {
      this.SaveAsFile(
        JSON.stringify(this.doc, null, 4),
        this.doc.identifier + ".txt",
        "application/json;charset=" + window.document.charset
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
  }
};
</script>

<style scoped>
</style>