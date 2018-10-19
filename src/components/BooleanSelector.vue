<template>
  <q-toggle 
    v-model="userSelection"
    :label="(userSelection ? 'Meets' : 'Does not meet') + ' your organization's Information Quality Guidelines'"
  />
</template>

<script>
export default {
  name: "BooleanSelector",

  methods: {
    emitUpdate: function(e) {
      this.$emit("update:userSelection", e);
    }
  },
  data() {
    return {
      userSelection: false
    };
  }
};
</script>

<style scoped>
</style>