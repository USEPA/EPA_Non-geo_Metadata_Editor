<template>
  <q-toggle 
    v-model="modelValue"
    :label="(modelValue ? 'Meets' : 'Does not meet') + ' your organization’s Information Quality Guidelines'"
  />
</template>

<script>
export default {
  name: "BooleanSelector",

  props: {
    value: { type: Boolean, default: false }
  },

  watch: {
    modelValue(newValue) {
      this.$emit("input", newValue);
    },

    value(newValue) {
      this.modelValue = newValue;
    }
  },

  data() {
    return {
      modelValue: this.value
    };
  }
};
</script>

<style scoped>
</style>