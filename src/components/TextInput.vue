<template>
      <q-input
        v-model="userText"
        :type="multiLine ? 'textarea' : 'text'"
        :float-label="defaultText"
        :rows="multiLine ? 4 : 1"
        :value="userText"
         @keyup="emitUpdate($event.target.value)"
      />
</template>

<script>
export default {
  name: "TextInput",
  props: {
    defaultText: String,
    multiLine: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userText: ""
    };
  },
  methods: {
    emitUpdate: function(e) {
      this.$emit("update:userText", e);
    }
  }
};
</script>

<style scoped>
</style>