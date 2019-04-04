<template>
  <q-jumbotron dark img-src="./banner.jpg">
    <div
      class="q-subheading tb"
    >Welcome to the EPA Open Data Metadata Editor for Extramural Researchers in support of EPA's initiative to make data open, discoverable, and usable.</div>
    <hr class="q-hr q-my-lg">
    <div class="tb">
      This tool allows extramural researchers to author, save, and submit metadata records for non-geospatial data that are compliant with
      <a
        href="https://www.epa.gov/geospatial/epa-metadata-technical-specification"
      >EPA's Metadata Technical Specification</a>. If you wish to submit metadata for geospatial data, please contact the
      <a
        href="mailto:edg@epa.gov"
      >EPA EDG team</a> for further assistance.
      <br>Each element has a corresponding status:
      <ValidationIcon mandatory :scale="1.4" style="margin-bottom:-0.2em"/>Mandatory (empty),
      <ValidationIcon :scale="1.4" style="margin-bottom:-0.2em"/>Optional (empty),
      <ValidationIcon validations="Some error" :scale="1.4" style="margin-bottom:-0.2em"/>Invalid, and
      <ValidationIcon validations :scale="1.4" style="margin-bottom:-0.2em"/>Valid.
      Additional guidance and best practices are available by clicking each element's status icon.
      <br>Use the blue button at the upper left to save, view or load existing records. The red button at the lower right will turn green when a record has passed all validation tests and is ready for submission.
      Please contact the
      <a
        href="mailto:edg@epa.gov"
      >EPA EDG team</a> with any questions.
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
a:link,
a:visited {
  color: white;
  text-align: center;
  text-decoration: underline;
}

a:hover,
a:active {
  background-color: #aaa;
}
</style>