<template>
    <q-field :icon="getIcon()" :icon-color="getIconColor()" :error="isError()" :error-label="getErrorLabel()">
        <slot></slot>
    </q-field>
</template>

<script>
import config from "../config.js";

export default {
  name: "FieldWrapper",
  props: {
    mandatory: false,
    validation: ""
  },
  methods: {
    isError: function() {
      return this.validation.trim() != "" && this.validation.trim() != "Empty.";
    },

    getErrorLabel: function() {
      console.log(this.validation);
      return this.validation.trim();
    },

    getStyle: function() {
      return config.getValiMandaVisualizer(
        this.validation,
        this.mandatory,
        false
      ).style;
    },

    getIcon: function() {
      return config.getValiMandaVisualizer(
        this.validation,
        this.mandatory,
        true
      ).icon;
    },

    getIconColor: function() {
      if (this.validation == "Empty.")
        if (this.mandatory) return "empty-mandatory";
        // TODO
        else return "empty-optional";
      else if (this.validation == "") return "valid";
      else return "invalid";
    }
  }
};
</script>

<style>
.text-empty-mandatory {
  color: #fdae61 !important;
}
.text-empty-optional {
  color: #9e9e9e91 !important;
}
.text-invalid {
  color: #d7191c !important;
}
.text-valid {
  color: #1a9641 !important;
}
</style>