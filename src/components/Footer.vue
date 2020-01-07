<template>
  <q-jumbotron dark img-src="./banner.jpg">
    <div class="q-subheading tb">
      You have reached the last of the Open Data Metadata Editor elements. If there are valid entries for all of the mandatory elements and no invalid entries for any optional elements, the submit button at right should be green
      <q-btn
        round
        color="positive"
        size="sm"
        style="margin-right:0.5em"
        aria-label="Green submit button"
      >
        <v-icon aria-hidden="true" name="paper-plane" :scale="1" />
      </q-btn>and you may submit your record. If not, please address any validation errors or missing entries. You may also save a copy of your record before or after submission using the menu at top left.
    </div>
  </q-jumbotron>
</template>

<script>
import ValidationIcon from "./ValidationIcon.vue";
import config from "../config.js";

export default {
  name: "Intro",

  components: { ValidationIcon },

  methods: {
    validationStyles: function () {
      return config.validation_config;
    }
  }
};
</script>

<style scoped>
.tb {
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}
</style>