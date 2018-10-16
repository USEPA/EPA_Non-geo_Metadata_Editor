<template>
    <div>
        <q-field  v-if="propInfo.editMode" :icon="getIcon()" :icon-color="getIconColor()" :error="isError()" :error-label="getErrorLabel()">
            <slot></slot>
        </q-field>

        <div v-else class="row">
            <div class="col-md-auto" :style="getStyle()">
                <b><q-icon :name="getIcon()"/> {{propInfo.name | capitalize}}: &nbsp;</b>
            </div>
            <div class="col-md-auto">
                {{propInfo.value}}
            </div>
        </div>
        <br/>
    </div>
</template>

<script>
import config from "../config.js";

export default {
  name: "FieldWrapper",
  props: {
    propInfo: {}
  },
  methods: {
    isError: function() {
      return (
        this.propInfo.validation.trim() != "" &&
        this.propInfo.validation.trim() != "Empty."
      );
    },

    getErrorLabel: function() {
      return this.propInfo.validation.trim();
    },

    getStyle: function() {
      return config.getValiMandaVisualizer(
        this.propInfo.validation,
        this.propInfo.mandatory,
        false
      ).style;
    },

    getIcon: function() {
      return config.getValiMandaVisualizer(
        this.propInfo.validation,
        this.propInfo.mandatory,
        true
      ).icon;
    },

    getIconColor: function() {
      if (this.propInfo.validation == "Empty.")
        if (this.propInfo.mandatory) return "empty-mandatory";
        // TODO
        else return "empty-optional";
      else if (this.propInfo.validation == "") return "valid";
      else return "invalid";
    }
  },
  filters: {
    capitalize: config.capitalize
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