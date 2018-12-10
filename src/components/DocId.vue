<template>
  <div>
    <q-input v-model="modelValue" :float-label="placeholderText()"/>
  </div>
</template>

<script>
import { uuid } from "vue-uuid";

export default {
  name: "DoiInput",
  props: {
    value: "",
    defaultId: {
      type: String,
      default: uuid.v4().toString()
    }
  },
  methods: {
    placeholderText: function() {
      return (
        "Please enter a DOI for the dataset or leave empty to use: " +
        this.defaultId
      );
    }
  },
  watch: {
    modelValue(newValue) {
      // Broadcast new value (if any) or the default DOI we generated
      this.$emit("input", newValue ? newValue : this.defaultId);
    },
    value(newValue) {
      // Intern the new value only if it's not the DOI we generated as default
      if (newValue != this.defaultId) this.modelValue = newValue;
    }
  },
  data() {
    return {
      modelValue: this.value
    };
  },
  mounted: function() {
    // Force broadcast of component value upon mount
    this.$emit("input", this.value ? this.value : this.defaultId);
  }
};
</script>

<style scoped>
</style>