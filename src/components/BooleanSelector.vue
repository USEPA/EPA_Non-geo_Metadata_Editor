<template>
  <q-toggle 
    v-model="modelValue"
    :label="(modelValue ? 'Meets' : 'Does not meet') + ' the agency’s Information Quality Guidelines'"
  />
</template>

<script>
export default {
  name: "BooleanSelector",

  props: {
    value: Boolean
  },

  methods: {
    emitUpdate: function(e) {
      this.$emit("update:modelValue", e);
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
    return {
      modelValue: false
    };
  }
};
</script>

<style scoped>
</style>