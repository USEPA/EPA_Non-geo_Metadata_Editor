<template>
    <q-jumbotron dark img-src="https://www.epa.gov/sites/production/files/styles/microsite_banner/public/2018-08/epa-banner-images/banners_xcpp_aug2018.jpg">
        <div class="q-display-3">Welcome!</div>
        <div class="q-subheading">
        Welcome to the EPA Open Data Metadata Editor in support of EPA's initiative to make data open, discoverable, and usable.
        </div>
        <hr class="q-hr q-my-lg">
        <div>
            This tool allows data owners to author, save, and submit metadata records that are compliant with <a href="https://www.epa.gov/geospatial/epa-metadata-technical-specification">EPA's Metadata Technical Specification</a>. 
            Each element has a corresponding status: 
            <q-icon :name="validationStyles().empty.mandatory.icon" :style="'color:#'+validationStyles().empty.mandatory.color"/>  Mandatory (empty),
            <q-icon :name="validationStyles().empty.optional.icon" :style="'color:#'+validationStyles().empty.optional.color"/>  Optional (empty),
            <q-icon :name="validationStyles().nonempty.invalid.icon" :style="'color:#'+validationStyles().nonempty.invalid.color"/>  Invalid, and 
            <q-icon :name="validationStyles().nonempty.valid.icon" :style="'color:#'+validationStyles().nonempty.valid.color"/>  Valid.
            Additional guidance and best practices are available by clicking each element's status icon. 
            Use the menu at the lower right to save, load, or submit records or log in as an EPA user. 
            Please contact the <a href="mailto:edg@epa.gov">EPA EDG team</a> with any questions.
        </div>
    </q-jumbotron>
</template>

<script>
import config from "../config.js";

export default {
  name: "Intro",
  methods: {
    validationStyles: function() {
      return config.validation_config;
    }
  }
};
</script>

<style scoped>
</style>