<template>
  <multiselect
    v-model="modelValue"
    tag-placeholder="Add this as new keyword"
    placeholder="Search or add keyword"
    label="label"
    track-by="value"
    :multiple="true"
    :options="options"
    :taggable="true"
    @tag="addTag"
    allowEmpty
  />
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  name: "UserTags",

  props: { value: Array },

  components: { Multiselect },

  watch: {
    modelValue(newValue) {
      this.$emit("input", newValue);
    },
    value(newValue) {
      this.modelValue = newValue;
      this.options = newValue;
    }
  },

  methods: {
    addTag: function(t) {
      if (this.value.find(x => x.value.toLowerCase() == t.toLowerCase()))
        this.$q.notify("Keyword already present");
      else this.value.push({ value: t, label: t });
    }
  },

  data() {
    return {
      modelValue: this.value,
      options: []
    };
  }
};
</script>

<style scoped>
</style>