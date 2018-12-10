<template>
  <div class="aligned">
    <div v-if="range">Start:&nbsp;</div>
    <q-input type="date" v-model="modelValue1"/>
    <div v-if="range">&nbsp;&nbsp;&nbsp;End:&nbsp;</div>
    <q-input v-if="this.range" type="date" v-model="modelValue2"/>
  </div>
</template>

<script>
export default {
  name: "DateOrRangeInput",

  props: {
    value: String,
    range: false
  },

  watch: {
    modelValue1(newValue) {
      this.$emit("input", this.modelValue);
    },
    modelValue2(newValue) {
      if (this.range) this.$emit("input", this.modelValue);
    },
    value(newValue) {
      var values = this.parseInput(newValue);
      if (this.modelValue1 != values[0]) this.modelValue1 = values[0];
      if (this.modelValue2 != values[1]) this.modelValue2 = values[1];
    }
  },

  methods: {
    parseInput: function(inp) {
      if (!inp || inp == "") {
        return ["", ""];
      }
      var parts = inp.split("/");
      parts = parts.map(item => item.trim());
      if (parts.length < 1) parts[0] = "";
      if (parts.length < 2) parts[1] = "";
      return parts;
    }
  },

  computed: {
    modelValue: function() {
      var result = this.modelValue1;
      if (this.range) result += "/" + (this.modelValue2 || "");
      return result;
    }
  },

  data() {
    var values = this.parseInput(this.value);
    return { modelValue1: values[0], modelValue2: values[2] };
  }
};
</script>

<style scoped>
.aligned {
  margin-left: 2%;
  display: flex;
  align-items: center;
}
</style>