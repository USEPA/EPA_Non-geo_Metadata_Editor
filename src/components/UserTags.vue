<template>
  <q-chips-input
    v-model="modelValue"
    placeholder="Please enter keywords that don't belong in other categories"
    add-icon="fas fa-plus"
  />
</template>

<script>
export default {
  name: "UserTags",

  props: { value: Array },

  watch: {
    modelValue(newValue) {
      this.$emit("input", newValue);
    },
    value(newValue) {
      this.modelValue = newValue;
    }
  },

  data() {
    console.log(this.value);
    return {
      modelValue: this.value
    };
  }
};
</script>

<style scoped>
</style>