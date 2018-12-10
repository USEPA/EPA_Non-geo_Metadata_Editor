<template>
  <q-input
    v-model="modelValue"
    :type="multiLine ? 'textarea' : 'text'"
    :float-label="defaultText"
    :rows="multiLine ? 4 : 1"
  />
</template>

<script>
export default {
  name: "TextInput",
  props: {
    value: String,
    defaultText: String,
    multiLine: {
      type: Boolean,
      default: false
    }
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
    //console.log(this.value);
    return {
      modelValue: this.value
    };
  }
};
</script>

<style scoped>
</style>