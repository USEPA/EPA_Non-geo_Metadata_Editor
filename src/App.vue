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
          <ElementHeader title="EPA Grant" 
            :guidance="getGuidanceFor('epa_grant')"
            :validations.sync="validations.epa_grant"
            :mandatory="config['epa_grant']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter EPA grant no" v-model="doc.epa_grant" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="EPA Contact Email" 
            :guidance="getGuidanceFor('epa_contact')"
            :validations.sync="validations.epa_contact"
            :mandatory="config['epa_contact']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter EPA contact's email" v-model="doc.epa_contact" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Title" 
            :guidance="getGuidanceFor('title')"
            :validations.sync="validations.title"
            :mandatory="config['title']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter a title for the dataset" v-model="doc.title" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Description" 
            :guidance="getGuidanceFor('description')"
            :validations.sync="validations.description"
            :mandatory="config['description']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter a description for the dataset" multiLine  v-model="doc.description" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Place Keywords" 
            :guidance="getGuidanceFor('tags_place')"
            :validations.sync="validations.tags_place"
            :mandatory="config['tags_place']['mandatory']"
          />
          <q-card-main>
            <TagCollector v-model="doc.tags_place" :availableTags.sync="config['tags_place']['availableTags']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="ISO Keywords" 
            :guidance="getGuidanceFor('tags_iso')"
            :validations.sync="validations.tags_iso"
            :mandatory="config['tags_iso']['mandatory']"
          />
          <q-card-main>
            <TagCollector v-model="doc.tags_iso" :availableTags.sync="config['tags_iso']['availableTags']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="EPA Keywords" 
            :guidance="getGuidanceFor('tags_epa_theme')"
            :validations.sync="validations.tags_epa_theme"
            :mandatory="config['tags_epa_theme']['mandatory']"
          />
          <q-card-main>
            <TagCollector v-model="doc.tags_epa_theme" :availableTags.sync="config['tags_epa_theme']['availableTags']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="General Keywords" 
            :guidance="getGuidanceFor('tags_general')"
            :validations.sync="validations.tags_general"
            :mandatory="config['tags_general']['mandatory']"
          />
          <q-card-main>
            <UserTags v-model="doc.tags_general"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Publishing Organization" 
            :guidance="getGuidanceFor('publisher')"
            :validations.sync="validations.publisher"
            :mandatory="config['publisher']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter the name of the publishing organization for the dataset" v-model="doc.publisher" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Publisher" 
            :guidance="getGuidanceFor('contactPoint.fn')"
            :validations.sync="validations.contactPoint.fn"
            :mandatory="config.contactPoint.fn['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter the name of the publisher for the dataset" v-model="doc.contactPoint.fn" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Publisher Email" 
            :guidance="getGuidanceFor('contactPoint.hasEmail')"
            :validations.sync="validations.contactPoint.hasEmail"
            :mandatory="config.contactPoint.hasEmail['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please enter the email address of the publisher for the dataset" v-model="doc.contactPoint.hasEmail" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Distribution" 
            :guidance="getGuidanceFor('distribution')"
            :validations.sync="validations.distribution"
            :mandatory="config['distribution']['mandatory']"
          />
          <q-card-main>
            <Distribution v-model="doc.distribution"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Identifier" 
            :guidance="getGuidanceFor('identifier')"
            :validations.sync="validations.identifier"
            :mandatory="config['identifier']['mandatory']"
          />
          <q-card-main>
            <DocId v-model="doc.identifier" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Access Level" 
            :guidance="getGuidanceFor('accessLevel')"
            :validations.sync="validations.accessLevel"
            :mandatory="config['accessLevel']['mandatory']"
          />
          <q-card-main>
            <OptionSelector v-model="doc.accessLevel" :availableOptions.sync="config['accessLevel']['availableOptions']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Rights" 
            :guidance="getGuidanceFor('rights')"
            :validations.sync="validations.rights"
            :mandatory="doc.accessLevel!=='public'"
          />
          <q-card-main>
            <TextInput v-if="!doc.accessLevel || doc.accessLevel=='public'" defaultText="Restrictions on the dataset" v-model="doc.rights" />
            <OptionSelector v-else v-model="doc.rights" :availableOptions.sync="config['rights']['availableOptions']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Data License" 
            :guidance="getGuidanceFor('license')"
            :validations.sync="validations.license"
            :mandatory="config['license']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="URL of the license for the dataset" v-model="doc.license" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Temporal Extent" 
            :guidance="getGuidanceFor('temporal')"
            :validations.sync="validations.temporal"
            :mandatory="config['temporal']['mandatory']"
          />
          <q-card-main>
            <DateOrRangeInput v-model="doc.temporal" :range="true" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Last Update" 
            :guidance="getGuidanceFor('modified')"
            :validations.sync="validations.modified"
            :mandatory="config['modified']['mandatory']"
          />
          <q-card-main>
            <DateOrRangeInput v-model="doc.modified" />
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
          <ElementHeader title="Release Date" 
            :guidance="getGuidanceFor('issued')"
            :validations.sync="validations.issued"
            :mandatory="config['issued']['mandatory']"
          />
          <q-card-main>
            <DateOrRangeInput v-model="doc.issued" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Language" 
            :guidance="getGuidanceFor('language')"
            :validations.sync="validations.language"
            :mandatory="config['language']['mandatory']"
          />
          <q-card-main>
            <TagCollector v-model="doc.language" :availableTags.sync="config['language']['availableTags']"/>
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Data Quality" 
            :guidance="getGuidanceFor('dataQuality')"
            :validations.sync="validations.dataQuality"
            :mandatory="config['dataQuality']['mandatory']"
          />
          <q-card-main>
            Does the dataset meet your organization’s Information Quality Guidelines? &nbsp;
            <BooleanSelector v-model="doc.dataQuality" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Conforms To" 
            :guidance="getGuidanceFor('conformsTo')"
            :validations.sync="validations.conformsTo"
            :mandatory="config['conformsTo']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please provide a URL" v-model="doc.conformsTo" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="Described By" 
            :guidance="getGuidanceFor('describedBy')"
            :validations.sync="validations.describedBy"
            :mandatory="config['describedBy']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please provide a URL" v-model="doc.describedBy" />
            <OptionSelector 
              v-model="doc.describedByType" 
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
            <TextInput defaultText="Please provide a URL" v-model="doc.landingPage" />
          </q-card-main>
        </q-card>

        <q-card  class="q-ma-sm">
          <ElementHeader title="References" 
            :guidance="getGuidanceFor('references')"
            :validations.sync="validations.references"
            :mandatory="config['references']['mandatory']"
          />
          <q-card-main>
            <TextInput defaultText="Please provide a URL" v-model="doc.references" />
          </q-card-main>
        </q-card>
<!--

-->
        <br/><br/><br/>

        <DocumentActions :doc="materializeDoc" @loadMd="loadDocFrom"/>

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
import UserTags from "./components/UserTags.vue";
import merge from "deepmerge";
import clean from "obj-clean";

// Prompt user if they really want to navigate away from the page
var confirmOnPageExit = function(e) {
  // If we haven't been passed the event get the window.event
  e = e || window.event;

  var message = "Are you sure?";

  // For IE6-8 and Firefox prior to version 4
  if (e) {
    e.returnValue = message;
  }

  // For Chrome, Safari, IE8+ and Opera 12+
  return message;
};

window.onbeforeunload = confirmOnPageExit;

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
    DocumentActions,
    UserTags

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
        tags_general: [],
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
        language: [],
        dataQuality: null,
        conformsTo: "",
        describedBy: "",
        describedByType: "",
        landingPage: "",
        references: "",
        distribution: [],
        epa_grant: "",
        epa_contact: ""
      },
      validations: {
        title: "",
        description: "",
        tags_epa_theme: "",
        tags_place: "",
        tags_iso: "",
        tags_general: "",
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
        distribution: "",
        epa_grant: "",
        epa_contact: ""
      },
      holder: {},
      mdSpec: mdSpec,
      config: config,
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
      var validationResults = "Empty.";
      if (elementConfig) {
        if (Array.isArray(mdElementValue) && mdElement == "distribution") {
          validationResults = this.applyValidators(
            elementConfig,
            mdElementValue
          );

          var hasErrors = mdElementValue.find(entry => entry.validations > "");
          if (hasErrors)
            validationResults = "You have entries that are not validating.";
          else if (mdElementValue.length) validationResults = "";
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
      config.noop(tempRoot);
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
      config.noop(tempRoot);
      var element = eval(elementPath);
      element[leaf] = newValue;
    },

    mergeArrays: function() {
      var keywords = {};
      var args = [].slice.call(arguments);
      args.map(a => a.map(x => (keywords[x.toLowerCase()] = x)));
      return Object.values(keywords);
    },

    // Destructively extract and return tags found in tagOptions
    extractTags: function(tags, tagOptions) {
      // Find matching ones to be returned
      var matchedTags = tags.filter(tag =>
        tagOptions.find(
          option => option.value.toLowerCase() == tag.toLowerCase()
        )
      );
      // Find unmatched ones
      var unmatchedTags = tags.filter(tag => matchedTags.indexOf(tag) == -1);
      // In-place modify tags array to consist only of unmatched tags
      for (let i = 0; i < unmatchedTags.length; i++) tags[i] = unmatchedTags[i];
      tags.length = unmatchedTags.length;
      // Return matched tags
      return matchedTags;
    },

    loadDocFrom: function(newDoc) {
      // Deep clone the document read as we will apply destructive ops
      this.holder = config.clone(newDoc || {});
      var inDoc = this.holder.dataset || [];
      if (inDoc.length == 0) inDoc.push({});
      inDoc = inDoc[0];
      this.doc.title = config.extract(inDoc, "title");
      this.doc.description = config.extract(inDoc, "description");
      if (!inDoc.publisher) inDoc.publisher = [];
      this.doc.publisher = config.extract(inDoc.publisher, "name");
      if (!inDoc.contactPoint) inDoc.contactPoint = {};
      this.doc.contactPoint = {
        fn: config.extract(inDoc.contactPoint, "fn"),
        hasEmail: config
          .extract(inDoc.contactPoint, "hasEmail")
          .replace("mailto:", "")
      };
      this.doc.rights = config.extract(inDoc, "rights", { lookup: false });
      this.doc.license = config.extract(inDoc, "license");
      this.doc.temporal = config.extract(inDoc, "temporal");
      this.doc.accrualPeriodicity = config.extract(inDoc, "accrualPeriodicity");
      this.doc.conformsTo = config.extract(inDoc, "conformsTo");
      this.doc.describedBy = config.extract(inDoc, "describedBy");
      this.doc.landingPage = config.extract(inDoc, "landingPage");
      this.doc.references = config
        .extract(inDoc, "references", { defaultValue: [] })
        .join(",");
      this.doc.accessLevel = config.extract(inDoc, "accessLevel", {
        defaultValue: "public"
      });
      this.doc.identifier = config.extract(inDoc, "identifier");
      this.doc.dataQuality = config.extract(inDoc, "dataQuality", {
        defaultValue: false
      });
      this.doc.issued = config.extract(inDoc, "issued");
      this.doc.modified = config.extract(inDoc, "modified");
      this.doc.describedByType = config.extract(inDoc, "describedByType");
      if (!inDoc.keyword) inDoc.keyword = [];

      // Extract tags into applicable categories
      this.doc.tags_place = this.extractTags(
        inDoc.keyword,
        config.tags_place.availableTags
      );
      this.doc.tags_iso = this.extractTags(
        inDoc.keyword,
        config.tags_iso.availableTags
      );
      this.doc.tags_epa_theme = this.extractTags(
        inDoc.keyword,
        config.tags_epa_theme.availableTags
      );
      // Remaning tags are moved to general category
      this.doc.tags_general = config.clone(inDoc.keyword);
      inDoc.keyword.length = 0;

      if (!inDoc.language) inDoc.language = [];
      this.doc.language = this.extractTags(
        config.extract(inDoc, "language", { defaultValue: [] }),
        config.language.availableTags
      );
      this.doc.distribution = config.extract(inDoc, "distribution", {
        defaultValue: []
      });
      this.doc.epa_grant = config.extract(inDoc, "epa_grant");
      this.doc.epa_contact = config.extract(inDoc, "epa_contact");
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
    "doc.tags_general": {
      handler: function() {
        this.validateElement("tags_general");
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

        // Auto detect describedByType from file extension embedded in URL, if any
        if (this.doc.describedBy)
          this.doc.describedByType = config.url2mimeType(this.doc.describedBy);
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
    },
    "doc.epa_grant": {
      handler: function() {
        this.validateElement("epa_grant");
      },
      immediate: true
    },
    "doc.epa_contact": {
      handler: function() {
        this.validateElement("epa_contact");
      },
      immediate: true
    }
  },
  computed: {
    materializeDoc: {
      get: function() {
        // Deep copy the working document
        var outDoc = config.clone(this.doc);

        if (outDoc.tags_epa_theme || outDoc.tags_place || outDoc.tags_iso) {
          var keyword = this.mergeArrays(
            outDoc.tags_epa_theme,
            outDoc.tags_place,
            outDoc.tags_iso,
            outDoc.tags_general
          );
          if (keyword.length) outDoc.keyword = keyword;
          delete outDoc.tags_epa_theme;
          delete outDoc.tags_place;
          delete outDoc.tags_iso;
          delete outDoc.tags_general;
        }

        outDoc.distribution.map(item => {
          delete item.validations;
          if (item.interned) delete item.interned;
        });

        // Remove empty elements
        outDoc = clean(outDoc, { preserveArrays: false });

        // Fix up hasEmail
        if (outDoc.contactPoint) outDoc.contactPoint["@type"] = "vcard:Contact";
        if (outDoc.contactPoint && outDoc.contactPoint.hasEmail)
          outDoc.contactPoint.hasEmail =
            "mailto:" + outDoc.contactPoint.hasEmail;

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

        // Need to merge the main part of the object separate from the array (dataset) part
        // due to how deepmerge works
        var holderMain = config.clone(this.holder);
        if (!holderMain.dataset || holderMain.dataset.length == 0)
          holderMain.dataset = [{}];
        var holderDataset = holderMain.dataset.shift();

        var docMain = {
          "@context":
            "https://project-open-data.cio.gov/v1.1/schema/catalog.jsonld",
          "@id": "https://replace.me",
          "@type": "dcat:Catalog",
          conformsTo: "https://project-open-data.cio.gov/v1.1/schema",
          describedBy:
            "https://project-open-data.cio.gov/v1.1/schema/catalog.json"
        };
        holderMain = merge(docMain, holderMain);

        outDoc = merge(holderDataset, outDoc, {
          arrayMerge: merge.combineMerge
        });

        holderMain.dataset.unshift(outDoc);

        // Return prettified document
        return holderMain;
      }
    }
  }
};
</script>

<style>
</style>
