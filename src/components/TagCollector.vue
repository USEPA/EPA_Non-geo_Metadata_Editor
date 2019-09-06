<template>
  <multiselect
    v-model="modelValue"
    placeholder="Search"
    label="label"
    :show-labels="false"
    track-by="value"
    :options="availableTags"
    :multiple="true"
    :close-on-select="false"
    :clearOnSelect="false"
    :hide-selected="true"
  >
    <template slot="option" slot-scope="props">
      <div class="option__desc">
        <span class="option__title">{{ props.option.label }}</span>
        <br />
        <span class="option__small">{{ props.option.sublabel }}</span>
      </div>
    </template>
  </multiselect>
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
    modelValue (newValue) {
      this.$emit("input", newValue);
    },

    value (newValue) {
      this.modelValue = newValue;
    }
  },

  data () {
    return {
      modelValue: this.value
    };
  }
};
</script>
 

<style scoped>
.option__small {
  font-size: 1em;
  color: gray;
}
</style>