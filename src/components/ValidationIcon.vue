<template>
  <v-icon
    :scale="scale"
    :name="getValiMandaVisualizer().icon"
    :style="getValiMandaVisualizer().style"
  />
</template>

<script>
import config from "../config.js";

export default {
  name: "ValidationIcon",

  props: {
    validations: { type: String, default: "Empty." },
    mandatory: { type: Boolean, default: false },
    scale: {
      type: Number,
      default: 3
    }
  },

  methods: {
    getValiMandaVisualizer: function() {
      return config.getValiMandaVisualizer(this.validations, this.mandatory);
    }
  }
};
</script>

<style scoped>
</style>