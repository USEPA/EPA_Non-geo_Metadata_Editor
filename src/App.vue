<template>
  <q-layout id="q-app">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/default.min.css">
    <EPA/>
  
    <q-page-container>

        <Intro/>

<!--
        <q-card  class="q-ma-sm">
          <q-card-main>
            <q-btn color="secondary" :icon="isEpaUser ? 'fas fa-user' : ''" @click="isEpaUser=!isEpaUser">&nbsp;&nbsp;Pretend Log{{isEpaUser ? 'off' : 'in'}}</q-btn>
          </q-card-main>
        </q-card>
-->
        <q-card  class="q-ma-sm">
          <ElementHeader title="Title" 
            :guidance="getGuidanceFor('title')"
            :validations.sync="validations.title"
            :mandatory="config['title']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter a title for the dataset" :userText.sync="doc.title" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Description" 
            :guidance="getGuidanceFor('description')"
            :validations.sync="validations.description"
            :mandatory="config['description']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter a description for the dataset" multiLine  :userText.sync="doc.description" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Place Keywords" 
            :guidance="getGuidanceFor('tags_place')"
            :validations.sync="validations.tags_place"
            :mandatory="config['tags_place']['mandatory']"
          />
          <q-card-main>
            <TagCollector :collectedTags.sync="doc.tags_place" :availableTags.sync="config['tags_place']['availableTags']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="ISO Keywords" 
            :guidance="getGuidanceFor('tags_iso')"
            :validations.sync="validations.tags_iso"
            :mandatory="config['tags_iso']['mandatory']"
          />
          <q-card-main>
            <TagCollector :collectedTags.sync="doc.tags_iso" :availableTags.sync="config['tags_iso']['availableTags']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="EPA Organization Keywords" 
            :guidance="getGuidanceFor('epa_org')"
            :validations.sync="validations.epa_org"
            :mandatory="config['epa_org']['mandatory']"
          />
          <q-card-main>
            <TagCollector :collectedTags.sync="doc.epa_org" :availableTags.sync="config['epa_org']['availableTags']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="EPA Theme" 
            :guidance="getGuidanceFor('tags_epa_theme')"
            :validations.sync="validations.tags_epa_theme"
            :mandatory="config['tags_epa_theme']['mandatory']"
          />
          <q-card-main>
            <TagCollector :collectedTags.sync="doc.tags_epa_theme" :availableTags.sync="config['tags_epa_theme']['availableTags']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Last Update" 
            :guidance="getGuidanceFor('modified')"
            :validations.sync="validations.modified"
            :mandatory="config['modified']['mandatory']"
          />
          <q-card-main>
            <DateOrRangeInput :userInput.sync="doc.modified" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Update Frequency" 
            :guidance="getGuidanceFor('accrualPeriodicity')"
            :validations.sync="validations.accrualPeriodicity"
            :mandatory="config['accrualPeriodicity']['mandatory']"
          />
          <q-card-main>
            <PeriodicityInput :userInput.sync="doc.accrualPeriodicity" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Publishing Organization" 
            :guidance="getGuidanceFor('publisher')"
            :validations.sync="validations.publisher"
            :mandatory="config['publisher']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter the name of the publishing organization for the dataset" :userText.sync="doc.publisher" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Publisher" 
            :guidance="getGuidanceFor('contactPoint.fn')"
            :validations.sync="validations.contactPoint.fn"
            :mandatory="config.contactPoint.fn['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter the name of the publisher for the dataset" :userText.sync="doc.contactPoint.fn" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Publisher Email" 
            :guidance="getGuidanceFor('contactPoint.hasEmail')"
            :validations.sync="validations.contactPoint.hasEmail"
            :mandatory="config.contactPoint.hasEmail['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter the email address of the publisher for the dataset" :userText.sync="doc.contactPoint.hasEmail" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Distribution" 
            :guidance="getGuidanceFor('distribution')"
            :validations.sync="validations.distribution"
            :mandatory="config['distribution']['mandatory']"
          />
          <q-card-main>
            <Distribution :distribution.sync="doc.distribution"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Identifier" 
            :guidance="getGuidanceFor('identifier')"
            :validations.sync="validations.identifier"
            :mandatory="config['identifier']['mandatory']"
          />
          <q-card-main>
            <DocId :userText.sync="doc.identifier" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Access Level" 
            :guidance="getGuidanceFor('accessLevel')"
            :validations.sync="validations.accessLevel"
            :mandatory="config['accessLevel']['mandatory']"
          />
          <q-card-main>
            <OptionSelector :selectedOption.sync="doc.accessLevel" :availableOptions.sync="config['accessLevel']['availableOptions']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Rights" 
            :guidance="getGuidanceFor('rights')"
            :validations.sync="validations.rights"
            :mandatory="doc.accessLevel!=='public'"
          />
          <q-card-main>
            <TextInput v-if="!doc.accessLevel || doc.accessLevel=='public'" defaultText="Restrictions on the dataset" :userText.sync="doc.rights" />
            <OptionSelector v-else :selectedOption.sync="doc.rights" :availableOptions.sync="config['rights']['availableOptions']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Data License" 
            :guidance="getGuidanceFor('license')"
            :validations.sync="validations.license"
            :mandatory="config['license']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="URL of the license for the dataset" :userText.sync="doc.license" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Temporal Extent" 
            :guidance="getGuidanceFor('temporal')"
            :validations.sync="validations.temporal"
            :mandatory="config['temporal']['mandatory']"
          />
          <q-card-main>
            <DateOrRangeInput :userInput.sync="doc.temporal" :range="true" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Release Date" 
            :guidance="getGuidanceFor('issued')"
            :validations.sync="validations.issued"
            :mandatory="config['issued']['mandatory']"
          />
          <q-card-main>
            <DateOrRangeInput :userInput.sync="doc.issued" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Language" 
            :guidance="getGuidanceFor('language')"
            :validations.sync="validations.language"
            :mandatory="config['language']['mandatory']"
          />
          <q-card-main>
            <TagCollector :collectedTags.sync="doc.language" :availableTags.sync="config['language']['availableTags']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Data Quality" 
            :guidance="getGuidanceFor('dataQuality')"
            :validations.sync="validations.dataQuality"
            :mandatory="config['dataQuality']['mandatory']"
          />
          <q-card-main>
            <BooleanSelector :userSelection.sync="doc.dataQuality" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Conforms To" 
            :guidance="getGuidanceFor('conformsTo')"
            :validations.sync="validations.conformsTo"
            :mandatory="config['conformsTo']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please provide a URL" :userText.sync="doc.conformsTo" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Described By" 
            :guidance="getGuidanceFor('describedBy')"
            :validations.sync="validations.describedBy"
            :mandatory="config['describedBy']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please provide a URL" :userText.sync="doc.describedBy" />
            <OptionSelector 
              :selectedOption.sync="doc.describedByType" 
              :availableOptions.sync="config['describedByType']['availableOptions']"
              placeHolderText="Please select the type of file pointed by the above URL"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Landing Page" 
            :guidance="getGuidanceFor('landingPage')"
            :validations.sync="validations.landingPage"
            :mandatory="config['landingPage']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please provide a URL" :userText.sync="doc.landingPage" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="References" 
            :guidance="getGuidanceFor('references')"
            :validations.sync="validations.references"
            :mandatory="config['references']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please provide a URL" :userText.sync="doc.references" />
          </q-card-main>
        </q-card>
<!--

-->
        <br/><br/><br/>

        <DocumentActions :doc="materializeDoc" />

    </q-page-container>
  </q-layout>

<!--


        <q-card  class="q-ma-sm">
          <q-card-main>
          </q-card-main>
        </q-card>

-->

</template>

<script>
import mdSpec from "./assets/epa-metadata-tech-spec.json";
import config from "./config.js";

import EPA from "./components/EPA.vue";
import Intro from "./components/Intro.vue";
import ElementHeader from "./components/ElementHeader.vue";
//import ORCID from './components/ORCID.vue'
import TextInput from "./components/TextInput.vue";
import TagCollector from "./components/TagCollector.vue";
import PeriodicityInput from "./components/PeriodicityInput.vue";
import DateOrRangeInput from "./components/DateOrRangeInput.vue";
import DocId from "./components/DocId.vue";
import OptionSelector from "./components/OptionSelector.vue";
import BooleanSelector from "./components/BooleanSelector.vue";
import Distribution from "./components/Distribution.vue";
import DocumentActions from "./components/DocumentActions.vue";
import { uuid } from "vue-uuid";

var noop = function() {};

export default {
  name: "app",
  components: {
    EPA,
    Intro,
    ElementHeader,
    TextInput,
    TagCollector,
    PeriodicityInput,
    DateOrRangeInput,
    DocId,
    OptionSelector,
    BooleanSelector,
    Distribution,
    DocumentActions

    //, ORCID
  },
  data() {
    return {
      doc: {
        title: "",
        description: "",
        tags_epa_theme: [],
        tags_place: [],
        tags_iso: [],
        epa_org: [],
        modified: "",
        publisher: "",
        contactPoint: {
          fn: "",
          hasEmail: ""
        },
        identifier: "",
        accessLevel: "public",
        rights: "",
        license: "",
        bureauCode: ["020:00"],
        programCode: ["020:000"],
        temporal: "",
        issued: "",
        accrualPeriodicity: "",
        language: "",
        dataQuality: false,
        conformsTo: "",
        describedBy: "",
        describedByType: "",
        landingPage: "",
        references: "",
        distribution: ""
      },
      validations: {
        title: "",
        description: "",
        tags_epa_theme: "",
        tags_place: "",
        tags_iso: "",
        epa_org: "",
        modified: "",
        publisher: "",
        contactPoint: {
          fn: "",
          hasEmail: ""
        },
        identifier: "",
        accessLevel: "",
        rights: "",
        license: "",
        temporal: "",
        issued: "",
        accrualPeriodicity: "",
        language: "",
        dataQuality: "",
        conformsTo: "",
        describedBy: "",
        describedByType: "",
        landingPage: "",
        references: "",
        distribution: ""
      },
      mdSpec: mdSpec,
      config: config,
      uuid: uuid,
      isEpaUser: false
    };
  },

  methods: {
    getConfigFor(mdElement, cfgElement, defaultValue) {
      var searchDoc;
      if (
        cfgElement == "guidance" ||
        cfgElement == "epaguidance" ||
        cfgElement == "externalguidance"
      )
        searchDoc = this.mdSpec;
      else searchDoc = this.config;
      var mdElementSpec = this.findElement(searchDoc, mdElement);
      return mdElementSpec && mdElementSpec[cfgElement]
        ? mdElementSpec[cfgElement]
        : defaultValue;
    },

    getGuidanceFor(mdElement) {
      var guidance = this.getConfigFor(mdElement, "guidance") || "";
      if (this.isEpaUser) {
        var epaguidance = this.getConfigFor(mdElement, "epaguidance") || "";
        if (epaguidance) guidance += "<br/>" + epaguidance;
      } else {
        var externalguidance =
          this.getConfigFor(mdElement, "externalguidance") || "";
        if (externalguidance) guidance += "<br/>" + externalguidance;
      }
      return guidance.trim()
        ? guidance.trim()
        : "No guidance available at this time.";
    },

    applyValidators(elementConfig, mdElementValue) {
      var validationResults = "";
      var validators = elementConfig.validators;
      if (!validators || !validators.length) return validationResults; // No validator(s) for element
      validators.forEach(validator => {
        validator.args.doc = this.doc;
        validationResults +=
          validator.fn.call(this, mdElementValue, validator.args) + "\n";
      });
      return validationResults;
    },

    validateElement(mdElement) {
      var mdElementValue = this.findElement(this.doc, mdElement);
      var elementConfig = this.findElement(this.config, mdElement);
      var validationResults = "";
      if (elementConfig) {
        if (Array.isArray(mdElementValue) && mdElement == "distribution") {
          validationResults = "";
          var hasErrors = mdElementValue.find(entry => entry.validations > "");
          if (hasErrors)
            validationResults = "You have entries that are not validating.";
        } else
          validationResults = this.applyValidators(
            elementConfig,
            mdElementValue
          );
      } else {
        // No config for element
        validationResults = "No validators available for this element";
      }
      this.setElement(this.validations, mdElement, validationResults);
    },

    findElement(doc, elementPath) {
      var tempRoot = doc;
      noop(tempRoot);
      try {
        return eval("tempRoot." + elementPath);
      } catch (e) {
        return "";
      }
    },

    setElement(doc, elementPath, newValue) {
      elementPath = "tempRoot." + elementPath;
      var i = elementPath.lastIndexOf(".");
      var leaf = elementPath.substring(i + 1);
      elementPath = elementPath.substring(0, i);
      var tempRoot = doc;
      noop(tempRoot);
      var element = eval(elementPath);
      element[leaf] = newValue;
    },

    mergeArrays: function() {
      var keywords = {};
      var args = [].slice.call(arguments);
      args.map(a => a.map(x => (keywords[x.toLowerCase()] = x)));
      return Object.values(keywords);
    },

    pruneDoc: function(doc) {
      for (var prop in doc)
        if (doc.hasOwnProperty(prop)) {
          if (typeof doc[prop] == "object" && !Array.isArray(doc[prop]))
            this.pruneDoc(doc[prop]);
          if (
            !doc[prop] ||
            Object.keys(doc[prop]).length == 0 ||
            (Array.isArray(doc[prop]) && doc[prop].length == 0)
          )
            delete doc[prop];
        }
    }
  },
  watch: {
    "doc.title": {
      handler: function() {
        this.validateElement("title");
      },
      immediate: true
    },
    "doc.description": {
      handler: function() {
        this.validateElement("description");
      },
      immediate: true
    },
    "doc.epa_org": {
      handler: function() {
        this.validateElement("epa_org");
      },
      immediate: true
    },
    "doc.tags_place": {
      handler: function() {
        this.validateElement("tags_place");
      },
      immediate: true
    },
    "doc.tags_iso": {
      handler: function() {
        this.validateElement("tags_iso");
      },
      immediate: true
    },
    "doc.tags_epa_theme": {
      handler: function() {
        this.validateElement("tags_epa_theme");
      },
      immediate: true
    },
    "doc.modified": {
      handler: function() {
        this.validateElement("modified");
        this.validateElement("accrualPeriodicity");
      },
      immediate: true
    },
    "doc.accrualPeriodicity": {
      handler: function() {
        this.validateElement("accrualPeriodicity");
        this.validateElement("modified");
      },
      immediate: true
    },
    "doc.publisher": {
      handler: function() {
        this.validateElement("publisher");
      },
      immediate: true
    },
    "doc.contactPoint.fn": {
      handler: function() {
        this.validateElement("contactPoint.fn");
      },
      immediate: true
    },
    "doc.contactPoint.hasEmail": {
      handler: function() {
        this.validateElement("contactPoint.hasEmail");
      },
      immediate: true
    },
    "doc.identifier": {
      handler: function() {
        this.validateElement("identifier");
      },
      immediate: true
    },
    "doc.accessLevel": {
      handler: function() {
        this.validateElement("accessLevel");
      },
      immediate: true
    },

    "doc.rights": {
      handler: function() {
        this.validateElement("rights");
      },
      immediate: true
    },
    "doc.license": {
      handler: function() {
        this.validateElement("license");
      },
      immediate: true
    },
    "doc.temporal": {
      handler: function() {
        this.validateElement("temporal");
      },
      immediate: true
    },

    "doc.issued": {
      handler: function() {
        this.validateElement("issued");
      },
      immediate: true
    },
    "doc.language": {
      handler: function() {
        this.validateElement("language");
      },
      immediate: true
    },
    "doc.dataQuality": {
      handler: function() {
        this.validateElement("dataQuality");
      },
      immediate: true
    },
    "doc.conformsTo": {
      handler: function() {
        this.validateElement("conformsTo");
      },
      immediate: true
    },
    "doc.describedBy": {
      handler: function() {
        this.validateElement("describedBy");
      },
      immediate: true
    },
    "doc.describedByType": {
      handler: function() {
        this.validateElement("describedByType");
      },
      immediate: true
    },
    "doc.landingPage": {
      handler: function() {
        this.validateElement("landingPage");
      },
      immediate: true
    },
    "doc.references": {
      handler: function() {
        this.validateElement("references");
      },
      immediate: true
    },
    "doc.distribution": {
      handler: function() {
        this.validateElement("distribution");
      },
      immediate: true
    }
  },
  computed: {
    materializeDoc() {
      // Deep copy the working document
      var outDoc = JSON.parse(JSON.stringify(this.doc));
      // Remove empty elements
      this.pruneDoc(outDoc);
      // Fix up hasEmail
      if (outDoc.contactPoint && outDoc.contactPoint.hasEmail)
        outDoc.contactPoint.hasEmail = "mailto:" + outDoc.contactPoint.hasEmail;
      // Fix up modified using accrualPeriodicity if needed
      if (
        !outDoc.modified &&
        outDoc.accrualPeriodicity &&
        outDoc.accrualPeriodicity.startsWith("R/P")
      )
        outDoc.modified = outDoc.accrualPeriodicity;

      if (this.doc.publisher)
        outDoc.publisher = {
          "@type": "org:Organization",
          name: this.doc.publisher
        };

      if (outDoc.references) {
        outDoc.references = outDoc.references.split(",").map(u => u.trim());
      }

      if (outDoc.tags_epa_theme || outDoc.tags_place || outDoc.tags_iso) {
        var keyword = this.mergeArrays(
          outDoc.tags_epa_theme,
          outDoc.tags_place,
          outDoc.tags_iso
        );
        if (keyword.length) outDoc.keyword = keyword;
        delete outDoc.tags_epa_theme;
        delete outDoc.tags_place;
        delete outDoc.tags_iso;
      }

      //          "@type": "vcard:Contact",

      outDoc = {
        "@context":
          "https://project-open-data.cio.gov/v1.1/schema/catalog.jsonld",
        "@id": "https://replace.me",
        "@type": "dcat:Catalog",
        conformsTo: "https://project-open-data.cio.gov/v1.1/schema",
        describedBy:
          "https://project-open-data.cio.gov/v1.1/schema/catalog.json",
        dataset: [outDoc]
      };

      // Return prettified document
      return outDoc;
    }
  }
};
</script>

<style>
</style>
