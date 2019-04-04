<template>
  <q-btn-toggle
    v-model="modelValue"
    toggle-color="primary"
    :options="[
      {label: 'Skip', value: null},
      {label: 'No', value: false},
      {label: 'Yes', value: true}
    ]"
    aria-label="Pick a choice"
  />
</template>

<script>
export default {
  name: "BooleanSelector",

  props: {
    value: { type: Boolean, default: null }
  },

  watch: {
    modelValue (newValue) {
      this.$emit("input", newValue);
    },

    value (newValue) {
      this.modelValue = newValue;
    }
  },

  data () {
    return {
      modelValue: this.value
    };
  }
};
</script>

<style scoped>
</style>