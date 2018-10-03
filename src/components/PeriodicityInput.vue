<template>
  <div class="aligned">
    <q-input type="number" v-model="repeatNumericalPart" @change="emitUpdate()" min="1" max="365" placeholder="number"/>

    <q-select
      v-model="repeatPeriodPart"
      :options="periods"
      @input="emitUpdate()"
    />
  </div>
</template>

<script>
var noop = function() {};

export default {
  name: "DateOrPeriodicityInput",
  props: {
    periods: {
      type: Array,
      default: () => [
        { label: "", value: "" },
        { label: "years", value: "R/P%Y" },
        { label: "months", value: "R/P%M" },
        { label: "weeks", value: "R/P%W" },
        { label: "days", value: "R/P%D" },
        { label: "hours", value: "R/PT%H" },
        { label: "minutes", value: "R/PT%M" }
      ]
    }
  },
  data() {
    return {
      repeatNumericalPart: "",
      repeatPeriodPart: ""
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
        var result = "";
        if (this.repeatNumericalPart && this.repeatPeriodPart)
          result = this.repeatPeriodPart.replace("%", this.repeatNumericalPart);
        return result;
      },
      set: function(newValue) {
        noop(newValue);
        //TODO
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