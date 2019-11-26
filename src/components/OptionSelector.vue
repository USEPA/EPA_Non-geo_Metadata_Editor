<template>
  <q-select
    v-model="modelValue"
    :options="availableOptions"
    :filter="availableOptions.length > 10"
    :placeholder="placeHolderText"
    :aria-label="placeHolderText"
  />
</template>

<script>
export default {
  name: 'OptionSelector',

  props: {
    value: String,
    availableOptions: Array,
    placeHolderText: String
  },

  watch: {
    modelValue(newValue) {
      this.$emit('input', newValue)
    },
    value(newValue) {
      var item = this.availableOptions.find(
        x => x.value == newValue || x.label == newValue
      )
      if (item) this.modelValue = item.value
      else this.modelValue = this.availableOptions[0].value
    }
  },

  data() {
    return {
      modelValue: this.value
    }
  }
}
</script>

<style scoped></style>
