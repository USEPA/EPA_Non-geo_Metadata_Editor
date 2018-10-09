<template>

  <q-select
    v-model="selectedOption"
    :options="availableOptions"
    :filter="availableOptions.length>10"
    @input="emitUpdate()"
    :placeholder="placeHolderText"
  />
  
</template>

<script>
export default {
  name: "OptionSelector",
  props: {
    availableOptions: Array,
    placeHolderText: String
  },
  data() {
    return {
      selectedOption: this.availableOptions[0].value
    };
  },
  methods: {
    emitUpdate: function() {
      this.$emit("update:selectedOption", this.selectedOption);
    }
  }
};
</script>

<style scoped>
</style>