<template>
  <q-layout id="q-app" v-if="mdSpecReady">
    <q-page-container>
      <EPA>
        <q-btn round aria-label="EPA logo" v-model="menuOpen" @click="menuOpen=!menuOpen">
          <img
            alt="EPA logo"
            style="width:2.7em"
            src="~@/assets/environmental_protection_agency-logo-white.png"
            :class="menuOpen?'spinner':''"
          />
        </q-btn>
      </EPA>

      <q-layout-drawer :width="200" side="left" v-model="menuOpen" overlay style="color:#157CDA">
        <q-list no-border>
          <q-item>
            <q-btn flat @click="perform('load')" aria-label="load metadata record">
              <v-icon scale="2" name="cloud-download-alt" class="menuIcon" />
              <q-item-main label="Load" class="menuLabel" />
            </q-btn>
          </q-item>
          <q-item>
            <q-btn flat @click="perform('view')" aria-label="view metadata record">
              <v-icon scale="2" name="eye" class="menuIcon" />
              <q-item-main label="View" class="menuLabel" />
            </q-btn>
          </q-item>
          <q-item>
            <q-btn flat @click="perform('save')" aria-label="save metadata record">
              <v-icon scale="2" name="cloud-upload-alt" class="menuIcon" />
              <q-item-main label="Save" class="menuLabel" />
            </q-btn>
          </q-item>
        </q-list>
      </q-layout-drawer>

      <Intro />
      <q-card class="q-ma-sm">
        <q-card-main>
          <span
            v-if="!isEpaUser"
            class="q-subheading"
          >If you are an EPA user, you can login for additional functionality.</span>
          <span
            v-else
            class="q-subheading"
          >You are logged in as an EPA user and can access additional functionality.</span>
          &nbsp;
          <q-btn
            color="blue"
            :icon="isEpaUser ? 'fas fa-user' : 'far fa-user'"
            @click="isEpaUser=!isEpaUser"
          >&nbsp;&nbsp;Log{{isEpaUser ? 'off' : 'in'}}</q-btn>
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm" v-if="!isEpaUser">
        <ElementHeader
          title="EPA Agreement"
          :guidance="getGuidanceFor('epa_agreement_no')"
          :validations.sync="this.oneOf('epa_agreement_type', 'Agreement Type: ', 'epa_agreement_no', 'Agreement No: ')"
          :mandatory="config['epa_agreement_no']['mandatory']"
        />
        <q-card-main>
          <OptionSelector
            v-model="doc.epa_agreement_type"
            placeHolderText="Please select EPA agreement type"
            :availableOptions.sync="config['epa_agreement_type']['availableOptions']"
          />
          <TextInput
            defaultText="Please enter EPA agreement number or description"
            v-model="doc.epa_agreement_no"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm" v-if="isEpaUser">
        <ElementHeader
          title="EPA Program"
          :guidance="getGuidanceFor('programCode')"
          :validations.sync="validations.programCode"
          :mandatory="config['programCode']['mandatory']"
        />
        <q-card-main>
          <TagCollector
            v-model="doc.programCode"
            :availableTags.sync="config['programCode']['availableTags']"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm" v-if="!isEpaUser">
        <ElementHeader
          title="EPA Contact Email"
          :guidance="getGuidanceFor('tags_epa_theme')"
          :validations.sync="validations.epa_contact"
          :mandatory="config['epa_contact']['mandatory']"
        />
        <q-card-main>
          <TextInput defaultText="Please enter EPA contact's email" v-model="doc.epa_contact" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Title"
          :guidance="getGuidanceFor('title')"
          :validations.sync="validations.title"
          :mandatory="config['title']['mandatory']"
        />
        <q-card-main>
          <TextInput defaultText="Please enter a title for the dataset" v-model="doc.title" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Description"
          :guidance="getGuidanceFor('description')"
          :validations.sync="validations.description"
          :mandatory="config['description']['mandatory']"
        />
        <q-card-main>
          <TextInput
            defaultText="Please enter a description for the dataset"
            multiLine
            v-model="doc.description"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Place Keywords"
          :guidance="getGuidanceFor('tags_place')"
          :validations.sync="validations.tags_place"
          :mandatory="config['tags_place']['mandatory']"
        />
        <q-card-main>
          <TagCollector
            v-model="doc.tags_place"
            :availableTags.sync="config['tags_place']['availableTags']"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="ISO Keywords"
          :guidance="getGuidanceFor('tags_iso')"
          :validations.sync="validations.tags_iso"
          :mandatory="config['tags_iso']['mandatory']"
        />
        <q-card-main>
          <TagCollector
            v-model="doc.tags_iso"
            :availableTags.sync="config['tags_iso']['availableTags']"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="EPA Keywords"
          :guidance="getGuidanceFor('tags_epa_theme')"
          :validations.sync="validations.tags_epa_theme"
          :mandatory="config['tags_epa_theme']['mandatory']"
        />
        <q-card-main>
          <TagCollector
            v-model="doc.tags_epa_theme"
            :availableTags.sync="config['tags_epa_theme']['availableTags']"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="General Keywords"
          :guidance="getGuidanceFor('tags_general')"
          :validations.sync="validations.tags_general"
          :mandatory="config['tags_general']['mandatory']"
        />
        <q-card-main>
          <UserTags v-model="doc.tags_general" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Publishing Organization"
          :guidance="getGuidanceFor('publisher')"
          :validations.sync="validations.publisher"
          :mandatory="config['publisher']['mandatory']"
        />
        <q-card-main>
          <TextInput
            defaultText="Please enter the name of the publishing organization for the dataset"
            v-model="doc.publisher"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Publishing Individual"
          :guidance="getGuidanceFor('contactPoint.fn')"
          :validations.sync="validations.contactPoint.fn"
          :mandatory="config.contactPoint.fn['mandatory']"
        />
        <q-card-main>
          <TextInput
            defaultText="Please enter the name of the individual responsible for publishing the dataset"
            v-model="doc.contactPoint.fn"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Publisher Email"
          :guidance="getGuidanceFor('contactPoint.hasEmail')"
          :validations.sync="validations.contactPoint.hasEmail"
          :mandatory="config.contactPoint.hasEmail['mandatory']"
        />
        <q-card-main>
          <TextInput
            defaultText="Please enter the email address of the publisher for the dataset"
            v-model="doc.contactPoint.hasEmail"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Distribution"
          :guidance="getGuidanceFor('distribution')"
          :validations.sync="validations.distribution"
          :mandatory="config['distribution']['mandatory']"
        />
        <q-card-main>
          <Distribution v-model="doc.distribution" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Identifier"
          :guidance="getGuidanceFor('identifier')"
          :validations.sync="validations.identifier"
          :mandatory="config['identifier']['mandatory']"
        />
        <q-card-main>
          <DocId v-model="doc.identifier" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Access Level"
          :guidance="getGuidanceFor('accessLevel')"
          :validations.sync="validations.accessLevel"
          :mandatory="config['accessLevel']['mandatory']"
        />
        <q-card-main>
          <OptionSelector
            v-model="doc.accessLevel"
            :availableOptions.sync="config['accessLevel']['availableOptions']"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Rights"
          :guidance="getGuidanceFor('rights')"
          :validations.sync="validations.rights"
          :mandatory="doc.accessLevel!=='public'"
        />
        <q-card-main>
          <TextInput
            v-if="!doc.accessLevel || doc.accessLevel=='public'"
            defaultText="Restrictions on the dataset"
            v-model="doc.rights"
          />
          <OptionSelector
            v-else
            v-model="doc.rights"
            :availableOptions.sync="config['rights']['availableOptions']"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Data License"
          :guidance="getGuidanceFor('license')"
          :validations.sync="validations.license"
          :mandatory="config['license']['mandatory']"
        />
        <q-card-main>
          <TextInput defaultText="URL of the license for the dataset" v-model="doc.license" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Temporal Extent"
          :guidance="getGuidanceFor('temporal')"
          :validations.sync="validations.temporal"
          :mandatory="config['temporal']['mandatory']"
        />
        <q-card-main>
          <DateOrRangeInput v-model="doc.temporal" :range="true" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Last Update"
          :guidance="getGuidanceFor('modified')"
          :validations.sync="validations.modified"
          :mandatory="config['modified']['mandatory']"
        />
        <q-card-main>
          <DateOrRangeInput v-model="doc.modified" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Update Frequency"
          :guidance="getGuidanceFor('accrualPeriodicity')"
          :validations.sync="validations.accrualPeriodicity"
          :mandatory="config['accrualPeriodicity']['optional']"
        />
        <q-card-main>
          <PeriodicityInput :userInput.sync="doc.accrualPeriodicity" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Release Date"
          :guidance="getGuidanceFor('issued')"
          :validations.sync="validations.issued"
          :mandatory="config['issued']['mandatory']"
        />
        <q-card-main>
          <DateOrRangeInput v-model="doc.issued" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Language"
          :guidance="getGuidanceFor('language')"
          :validations.sync="validations.language"
          :mandatory="config['language']['mandatory']"
        />
        <q-card-main>
          <TagCollector
            v-model="doc.language"
            :availableTags.sync="config['language']['availableTags']"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Data Quality"
          :guidance="getGuidanceFor('dataQuality')"
          :validations.sync="validations.dataQuality"
          :mandatory="config['dataQuality']['mandatory']"
        />
        <q-card-main>
          Does the dataset meet your organization’s Information Quality Guidelines? &nbsp;
          <BooleanSelector v-model="doc.dataQuality" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Conforms To"
          :guidance="getGuidanceFor('conformsTo')"
          :validations.sync="validations.conformsTo"
          :mandatory="config['conformsTo']['mandatory']"
        />
        <q-card-main>
          <TextInput defaultText="Please provide a URL" v-model="doc.conformsTo" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Described By"
          :guidance="getGuidanceFor('describedBy')"
          :validations.sync="validations.describedBy"
          :mandatory="config['describedBy']['mandatory']"
        />
        <q-card-main>
          <TextInput defaultText="Please provide a URL" v-model="doc.describedBy" />
          <OptionSelector
            v-model="doc.describedByType"
            :availableOptions.sync="config['describedByType']['availableOptions']"
            placeHolderText="Please select the type of file pointed by the above URL"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="Landing Page"
          :guidance="getGuidanceFor('landingPage')"
          :validations.sync="validations.landingPage"
          :mandatory="config['landingPage']['mandatory']"
        />
        <q-card-main>
          <TextInput defaultText="Please provide a URL" v-model="doc.landingPage" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm">
        <ElementHeader
          title="References"
          :guidance="getGuidanceFor('references')"
          :validations.sync="validations.references"
          :mandatory="config['references']['mandatory']"
        />
        <q-card-main>
          <TextInput defaultText="Please provide a URL" v-model="doc.references" />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm" v-if="isEpaUser">
        <ElementHeader
          title="System Of Records"
          :guidance="getGuidanceFor('systemofrecords')"
          :validations.sync="validations.systemofrecords"
          :mandatory="config['systemofrecords']['mandatory']"
        />
        <q-card-main>
          <OptionSelector
            v-model="doc.systemofrecords"
            :availableOptions.sync="config['systemofrecords']['availableOptions']"
          />
        </q-card-main>
      </q-card>

      <q-card class="q-ma-sm" v-if="isEpaUser">
        <ElementHeader
          title="Primary IT Investment UII"
          :guidance="getGuidanceFor('primaryitinvestmentuii')"
          :validations.sync="validations.primaryitinvestmentuii"
          :mandatory="config['primaryitinvestmentuii']['mandatory']"
        />
        <q-card-main>
          <OptionSelector
            v-model="doc.primaryitinvestmentuii"
            :availableOptions.sync="config['primaryitinvestmentuii']['availableOptions']"
          />
        </q-card-main>
      </q-card>

      <Footer />

      <!--

      -->

      <DocumentActions
        :action="menuAction"
        :doc="materializeDoc"
        @loadMd="loadDocFrom"
        @modalClosed="menuAction=''"
      />

      <Submitter :doc="materializeDoc" :docError="docError()" />
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
import Submitter from "./components/Submitter.vue";
import Footer from "./components/Footer.vue";
import merge from "deepmerge";
import traverse from "traverse";
import cleanDeep from "clean-deep";
import "vue-awesome/icons";
import "whatwg-fetch";
//import func from "./vue-temp/vue-editor-bridge";

// Prompt user if they really want to navigate away from the page
var confirmOnPageExit = function (e) {
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
    UserTags,
    Submitter,
    Footer

    //, ORCID
  },
  data () {
    return {
      menuOpen: false,
      menuAction: "",
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
        epa_agreement_no: "",
        epa_agreement_type: "",
        epa_contact: "",
        programCode: [],
        systemofrecords: "",
        primaryitinvestmentuii: ""
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
        epa_agreement_no: "",
        epa_agreement_type: "",
        epa_contact: "",
        programCode: "",
        systemofrecords: "",
        primaryitinvestmentuii: ""
      },
      holder: {},
      mdSpec: null,
      mdSpecReady: false,
      config: config,
      isEpaUser: false
    };
  },

  methods: {
    oneOf: function (val1, pref1, val2, pref2) {
      if (this.validations[val1].trim()) return pref1 + this.validations[val1];
      if (this.validations[val2].trim()) return pref2 + this.validations[val2];
      return "";
    },

    getConfigFor (mdElement, cfgElement, defaultValue) {
      var searchDoc;
      if (
        cfgElement == "definition" ||
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

    getGuidanceFor (mdElement) {
      var guidance = "";
      var definition = this.getConfigFor(mdElement, "definition") || "";
      if (definition) guidance += "<b>Definition:</b> " + definition;
      var generalGuidance = this.getConfigFor(mdElement, "guidance") || "";
      if (generalGuidance)
        guidance += "<br/><b>Guidance:</b> " + generalGuidance;
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

    applyValidators (elementConfig, mdElementValue) {
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

    validateElement (mdElement) {
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

    findElement (doc, elementPath) {
      var tempRoot = doc;
      config.noop(tempRoot);
      try {
        return eval("tempRoot." + elementPath);
      } catch (e) {
        return "";
      }
    },

    setElement (doc, elementPath, newValue) {
      elementPath = "tempRoot." + elementPath;
      var i = elementPath.lastIndexOf(".");
      var leaf = elementPath.substring(i + 1);
      elementPath = elementPath.substring(0, i);
      var tempRoot = doc;
      config.noop(tempRoot);
      var element = eval(elementPath);
      element[leaf] = newValue;
    },

    mergeArrays: function () {
      var keywords = {};
      var args = [].slice.call(arguments);
      args.map(a => a.map(x => (keywords[x.value.toLowerCase()] = x.value)));
      return Object.values(keywords);
    },

    // Destructively extract and return tags found in tagOptions
    extractTags: function (tags, tagOptions) {
      // Find matching ones to be returned
      var matchedTags = tagOptions.filter(option =>
        tags.find(tag => option.value.toLowerCase() == tag.toLowerCase())
      );
      // Find unmatched ones
      var unmatchedTags = tags.filter(
        tag =>
          !matchedTags.find(m => m.value.toLowerCase() == tag.toLowerCase())
      );
      // In-place modify tags array to consist only of unmatched tags
      for (let i = 0; i < unmatchedTags.length; i++) tags[i] = unmatchedTags[i];
      tags.length = unmatchedTags.length;
      // Return matched tags
      return matchedTags;
    },

    loadDocFrom: function (newDoc) {
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
      this.doc.systemofrecords = config.extract(inDoc, "systemofrecords");
      this.doc.primaryitinvestmentuii = config.extract(inDoc, "primaryitinvestmentuii");


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
      this.doc.tags_general = config.clone(inDoc.keyword).map(x => {
        return { value: x, label: x };
      });
      inDoc.keyword.length = 0;

      if (!inDoc.language) inDoc.language = [];
      this.doc.language = this.extractTags(
        config.extract(inDoc, "language", { defaultValue: [] }),
        config.language.availableTags
      );
      this.doc.distribution = config.extract(inDoc, "distribution", {
        defaultValue: []
      });
      this.doc.epa_agreement_type = config.extract(inDoc, "epa_agreement_type");
      this.doc.epa_agreement_no = config.extract(inDoc, "epa_agreement_no");
      this.doc.epa_contact = config.extract(inDoc, "epa_contact");

      if (!inDoc.programCode) inDoc.programCode = [];
      this.doc.programCode = this.extractTags(
        config.extract(inDoc, "programCode", { defaultValue: [] }),
        config.programCode.availableTags
      );
    },

    docError: function () {
      let fn = function (val, n) {
        if (val) return val;

        if (this.isLeaf) {
          n = n.trim();
          let isMandatory = traverse(config).get(this.path)["mandatory"];
          if (n && n != "Empty.") return this.path;
          if (n && isMandatory) return this.path;
        }
        return "";
      };

      let failingElement = traverse(this.validations).reduce(fn, "");
      if (failingElement) {
        return {
          name: this.mdSpec
            ? traverse(this.mdSpec).get(failingElement)["field"]
            : failingElement,
          message: this.validations[failingElement]
        };
      } else return "";
    },

    perform: function (action) {
      this.menuAction = action;
      this.menuOpen = false;
    },

    getSpec () {
      fetch(
        //"https://raw.githubusercontent.com/USEPA/EPA_Non-geo_Metadata_Editor/master/public/epa-metadata-tech-spec.json"
        "/epa-metadata-tech-spec.json"
      )
        .then(response => response.json())
        .then(data => {
          this.mdSpec = data;
        });
    }
  },

  watch: {
    mdSpec: {
      handler: function () {
        if (this.mdSpec) this.mdSpecReady = true;
      },
      immediate: true
    },
    "doc.title": {
      handler: function () {
        this.validateElement("title");
      },
      immediate: true
    },
    "doc.description": {
      handler: function () {
        this.validateElement("description");
      },
      immediate: true
    },
    "doc.tags_place": {
      handler: function () {
        this.validateElement("tags_place");
      },
      immediate: true
    },
    "doc.tags_iso": {
      handler: function () {
        this.validateElement("tags_iso");
      },
      immediate: true
    },
    "doc.tags_epa_theme": {
      handler: function () {
        this.validateElement("tags_epa_theme");
      },
      immediate: true
    },
    "doc.tags_general": {
      handler: function () {
        this.validateElement("tags_general");
      },
      immediate: true
    },
    "doc.modified": {
      handler: function () {
        this.validateElement("modified");
        this.validateElement("accrualPeriodicity");
      },
      immediate: true
    },
    "doc.accrualPeriodicity": {
      handler: function () {
        this.validateElement("accrualPeriodicity");
        this.validateElement("modified");
      },
      immediate: true
    },
    "doc.publisher": {
      handler: function () {
        this.validateElement("publisher");
      },
      immediate: true
    },
    "doc.contactPoint.fn": {
      handler: function () {
        this.validateElement("contactPoint.fn");
      },
      immediate: true
    },
    "doc.contactPoint.hasEmail": {
      handler: function () {
        this.validateElement("contactPoint.hasEmail");
      },
      immediate: true
    },
    "doc.identifier": {
      handler: function () {
        this.validateElement("identifier");
      },
      immediate: true
    },
    "doc.accessLevel": {
      handler: function () {
        this.validateElement("accessLevel");
      },
      immediate: true
    },

    "doc.rights": {
      handler: function () {
        this.validateElement("rights");
      },
      immediate: true
    },
    "doc.license": {
      handler: function () {
        this.validateElement("license");
      },
      immediate: true
    },
    "doc.temporal": {
      handler: function () {
        this.validateElement("temporal");
      },
      immediate: true
    },

    "doc.issued": {
      handler: function () {
        this.validateElement("issued");
      },
      immediate: true
    },
    "doc.language": {
      handler: function () {
        this.validateElement("language");
      },
      immediate: true
    },
    "doc.dataQuality": {
      handler: function () {
        this.validateElement("dataQuality");
      },
      immediate: true
    },
    "doc.conformsTo": {
      handler: function () {
        this.validateElement("conformsTo");
      },
      immediate: true
    },
    "doc.describedBy": {
      handler: function () {
        this.validateElement("describedBy");

        // Auto detect describedByType from file extension embedded in URL, if any
        if (this.doc.describedBy)
          this.doc.describedByType = config.url2mimeType(this.doc.describedBy);
      },
      immediate: true
    },
    "doc.describedByType": {
      handler: function () {
        this.validateElement("describedByType");
      },
      immediate: true
    },
    "doc.landingPage": {
      handler: function () {
        this.validateElement("landingPage");
      },
      immediate: true
    },
    "doc.references": {
      handler: function () {
        this.validateElement("references");
      },
      immediate: true
    },
    "doc.distribution": {
      handler: function () {
        this.validateElement("distribution");
      },
      immediate: true
    },
    "doc.epa_agreement_type": {
      handler: function () {
        this.validateElement("epa_agreement_type");
      },
      immediate: true
    },
    "doc.epa_agreement_no": {
      handler: function () {
        this.validateElement("epa_agreement_no");
      },
      immediate: true
    },
    "doc.epa_contact": {
      handler: function () {
        this.validateElement("epa_contact");
      },
      immediate: true
    },
    "doc.programCode": {
      handler: function () {
        this.validateElement("programCode");
      },
      immediate: true
    },
    "doc.systemofrecords": {
      handler: function () {
        this.validateElement("systemofrecords");
      },
      immediate: true
    },
    "doc.primaryitinvestmentuii": {
      handler: function () {
        this.validateElement("primaryitinvestmentuii");
      },
      immediate: true
    }
  },

  computed: {
    materializeDoc: {
      get: function () {
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

        // Distill code only from value/label pairs
        outDoc.language = outDoc.language.map(item => item.value);
        outDoc.programCode = outDoc.programCode.map(item => item.value);

        // Remove empty elements
        outDoc = cleanDeep(outDoc);

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
  },

  created: function () {
    this.getSpec();
  },

  mounted: function () {
    let f = function (open) {
      this.menuOpen = open;
    };
    setTimeout(f.bind(this, true), 1000);
    setTimeout(f.bind(this, false), 5000);
  }
};
</script>

<style>
.menuIcon {
  font-size: 2em;
  margin-right: 0.2em;
}
.menuLabel {
  font-size: 1.5em;
}
.spinner {
  -webkit-animation: spin 4s linear infinite;
  -moz-animation: spin 4s linear infinite;
  animation: spin 4s linear infinite;
}
@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
