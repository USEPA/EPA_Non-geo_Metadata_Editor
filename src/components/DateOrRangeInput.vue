<template>
    <div class="aligned">
      <div v-if="range">Start:&nbsp;</div>
      <q-input type="date" v-model="datePart" @input="emitUpdate()"/> 
      <div v-if="range">&nbsp;&nbsp;&nbsp;End:&nbsp;</div>
      <q-input v-if="this.range" type="date" v-model="datePart2" @input="emitUpdate()"/> 
    </div>
</template>

<script>
var noop = function() {};

export default {
  name: "DateOrRangeInput",
  props: {
    range: false
  },
  data() {
    return {
      datePart: "",
      datePart2: ""
    };
  },
  methods: {
    emitUpdate: function() {
      this.$emit("update:userInput", this.userInput);
    }
  },
  computed: {
    userInput: {
      get: function() {
        var result = this.datePart;
        if (this.range) result += "/" + this.datePart2;
        return result;
      },
      set: function(newValue) {
        noop(newValue);
      }
    }
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