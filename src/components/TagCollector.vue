<template>
  <multiselect
    v-model="modelValue"
    tag-placeholder="Add this as new keyword"
    placeholder="Search or add keyword"
    label="label"
    track-by="value"
    :options="availableTags"
    :multiple="true"
    :close-on-select="false"
    :clearOnSelect="false"
    :hide-selected="true"
  />
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  name: "TagCollector",

  props: {
    value: Array,
    availableTags: Array
  },

  components: { Multiselect },

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