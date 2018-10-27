<template>

  <q-select
    multiple
    filter
    chips 
    clearable
    v-model="modelValue"
    :options="availableTags"
    filter-placeholder="Type here to filter"
  />

</template>

<script>
export default {
  name: "TagCollector",

  props: {
    value: Array,
    availableTags: Array
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