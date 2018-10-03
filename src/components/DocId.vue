<template>
    <div v-show="this.emitUpdate()">
      <q-input
        type="text"
        :float-label="defaultText()"
        :value="userDoi"
         @keyup="emitUpdate()"
      />
    </div>
</template>

<script>
import { uuid } from "vue-uuid";

var noop = function() {};

export default {
  name: "DoiInput",
  props: {
    userDoi: {
      type: String,
      default: ""
    },
    defaultId: {
      type: String,
      default: "" + uuid.v4()
    }
  },
  computed: {
    userText: {
      get: function() {
        if (this.userDoi.trim() > "") {
          return this.userDoi;
        } else {
          return this.defaultId;
        }
      },
      set: function(newValue) {
        this.emitUpdate();
        noop(newValue);
      }
    }
  },
  methods: {
    defaultText: function() {
      return (
        "Please enter a DOI for the dataset or leave empty to use: " +
        this.defaultId
      );
    },
    emitUpdate: function() {
      this.$emit("update:userText", this.userText);
      return true;
    }
  }
};
</script>

<style scoped>
</style>