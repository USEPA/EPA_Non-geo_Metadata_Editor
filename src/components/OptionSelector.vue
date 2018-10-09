<template>

  <q-select
    v-model="selectedOption"
    :options="availableOptions"
    @input="emitUpdate()"
  />
  
</template>

<script>
export default {
  name: "OptionSelector",
  props: {
    availableOptions: Array
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