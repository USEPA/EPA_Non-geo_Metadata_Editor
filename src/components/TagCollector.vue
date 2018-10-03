<template>

  <q-select
    multiple
    filter
    chips 
    clearable
    v-model="collectedTags"
    :options="availableTags"
    @input="emitUpdate()"
    filter-placeholder="Type here to filter"
  />

</template>

<script>
export default {
  name: "TagCollector",
  props: {
    availableTags: Array
  },
  methods: {
    emitUpdate: function() {
      this.$emit("update:collectedTags", this.collectedTags);
    }
  },
  data() {
    return {
      collectedTags: []
    };
  }
};
</script>
 

<style scoped>
</style>