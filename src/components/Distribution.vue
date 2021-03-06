<template>
  <div>
    <q-card v-for="(item, index) in modelValue" :key="index" class="q-ma-sm">
      <q-card-main>
        <FieldWrapper :propInfo="getPropInfo(index, 'title')">
          <q-input v-model="item.title" float-label="Please enter the title for the URL below" />
        </FieldWrapper>

        <FieldWrapper :propInfo="getPropInfo(index, 'description')">
          <q-input
            v-model="item.description"
            :float-label="'Please enter a description for the dataset'"
            type="textarea"
            rows="3"
          />
        </FieldWrapper>

        <q-card flat v-if="isBeingEdited(index)">
          <q-item>
            <q-item-main>
              <q-btn-toggle
                v-model="item.urlType"
                toggle-color="primary"
                :options="[
              {label: 'Access URL', value: 'access'},
              {label: 'Download URL', value: 'download'}
            ]"
                aria-label="Pick a choice"
              />
            </q-item-main>
          </q-item>
        </q-card>

        <FieldWrapper :propInfo="getPropInfo(index, 'url')" :overrideName="item.urlType+' URL'">
          <q-input
            v-model="item.url"
            :float-label="'Please enter the ' + item.urlType + ' URL for the dataset'"
          />
        </FieldWrapper>

        <FieldWrapper :propInfo="getPropInfo(index, 'mediaType')" v-show="item.urlType=='download'">
          <OptionSelector
            v-model="item.mediaType"
            :availableOptions.sync="config['distribution']['mediaType']['availableOptions']"
            placeHolderText="Please select the file format of the distribution's download URL"
          />
        </FieldWrapper>

        <FieldWrapper :propInfo="getPropInfo(index, 'format')" v-show="item.urlType=='access'">
          <OptionSelector
            v-model="item.formatType"
            :availableOptions.sync="config['distribution']['format']['availableOptions']"
            placeHolderText="Is the URL above for an API?"
          />
          <TextInput
            v-show="item.formatType=='Other'"
            defaultText="Please enter the a human-readable description of the file format of the distribution"
            v-model="item.format"
          />
        </FieldWrapper>

        <FieldWrapper :propInfo="getPropInfo(index, 'describedBy')">
          <TextInput
            defaultText="Please enter the URL to the data dictionary for the distribution found at the download URL"
            v-model="item.describedBy"
          />
        </FieldWrapper>

        <FieldWrapper :propInfo="getPropInfo(index, 'describedByType')">
          <OptionSelector
            v-model="item.describedByType"
            :availableOptions.sync="config['describedByType']['availableOptions']"
            placeHolderText="Please select the type of file for the data dictionary"
          />
        </FieldWrapper>

        <FieldWrapper :propInfo="getPropInfo(index, 'conformsTo')">
          <TextInput
            defaultText="Please enter the URI for the standardized specification the distribution conforms to.	"
            v-model="item.conformsTo"
          />
        </FieldWrapper>

        <br />
        <div class="row">
          <q-btn
            class="col-sm"
            @click="editThis(index)"
            v-show="!isBeingEdited(index)"
            aria-label="Edit this distribution entry"
          >
            <v-icon aria-hidden="true" name="pen" style="margin-right:1em" />Edit this distribution entry
          </q-btn>
          <q-btn
            class="col-sm"
            @click="closeThis()"
            v-show="isBeingEdited(index)"
            aria-label="Done editing this distribution entry"
          >
            <v-icon aria-hidden="true" name="check" style="margin-right:1em" />Done editing this distribution entry
          </q-btn>
          <q-btn
            class="col-sm"
            @click="deleteThis(index)"
            aria-label="Delete this distribution entry"
          >
            <v-icon aria-hidden="true" name="trash" style="margin-right:1em" />Delete this distribution entry
          </q-btn>
        </div>
      </q-card-main>
    </q-card>

    <br />
    <q-btn @click="addAnother()" aria-label="Add distribution entry">
      <v-icon aria-hidden="true" name="plus" style="margin-right:1em" />
      {{'Add '+(modelValue.length?'another':'a')+' distribution entry'}}
    </q-btn>
  </div>
</template>

<script>
import TextInput from "../components/TextInput.vue";
import ValidationIcon from "./ValidationIcon.vue";
import OptionSelector from "../components/OptionSelector.vue";
import FieldWrapper from "../components/FieldWrapper.vue";
import config from "../config.js";

export default {
  name: "Distribution",

  components: {
    TextInput,
    ValidationIcon,
    OptionSelector,
    FieldWrapper
  },

  props: {
    value: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },

  methods: {
    makeEmptyDistribution: function () {
      return {
        interned: true, // True if we created the record (from scratch or by interning a loaded record)
        title: "",
        description: "",
        url: "",
        urlType: "access",
        mediaType: "",
        format: "",
        formatType: "",
        describedBy: "",
        describedByType: "",
        conformsTo: ""
      };
    },

    intern: function (fromItem) {
      // Ignore already interned items
      if (!fromItem || fromItem.interned) return fromItem;

      // Start with empty distribution
      var item = this.makeEmptyDistribution();
      // Copy properties that are mapped directly
      Object.keys(item).map(prop => {
        if (fromItem[prop]) item[prop] = fromItem[prop] || "";
      });

      // Handle special cases

      if (fromItem["downloadURL"]) {
        item.url = fromItem["downloadURL"];
        item.urlType = "download";
      } else {
        item.url = fromItem["accessURL"] || "";
        item.urlType = "access";
      }

      if (item.format == "API") item.formatType = "API";
      else if (item.format > "") item.formatType = "Other";
      else item.formatType = "";

      // Check and fix if not in lookup
      item.mediaType = config.extract(item, "mediaType", {
        defaultValue: "",
        extract: false,
        conf: config.distribution
      });

      // Check and fix if not in lookup
      item.describedByType = config.extract(item, "describedByType", {
        defaultValue: "",
        extract: false,
        conf: config.distribution
      });

      item.interned = true;

      return item;
    },

    makeEmptyValidation: function () {
      return {
        title: "",
        url: "",
        mediaType: "",
        format: "",
        formatType: "",
        description: "",
        describedBy: "",
        describedByType: "",
        conformsTo: ""
      };
    },

    makeEmptyValidationsFor: function (dist) {
      return dist.map(() => this.makeEmptyValidation());
    },

    addAnother: function () {
      this.modelValue.push(this.makeEmptyDistribution());

      this.validations.push(this.makeEmptyValidation());

      this.indexBeingEdited = this.modelValue.length - 1;
    },

    editThis: function (index) {
      this.indexBeingEdited = index;
    },

    closeThis: function () {
      this.indexBeingEdited = -1;
    },

    deleteThis: function (index) {
      this.modelValue.splice(index, 1);
      this.validations.splice(index, 1);
      this.indexBeingEdited = -1;
    },

    getPropInfo: function (index, prop) {
      return {
        name: prop,
        mandatory: config.distribution[prop].mandatory,
        value: this.modelValue[index][prop],
        validation: this.validations[index][prop],
        editMode: this.isBeingEdited(index)
      };
    },

    getStyle: function (index, prop) {
      return (
        config.getValiMandaVisualizer(
          this.validations[index][prop],
          config.distribution[prop].mandatory
        ).style + ";margin-bottom:-0.4em"
      );
    },

    isBeingEdited: function (index) {
      return index == this.indexBeingEdited;
    },

    validate: function (item, validations) {
      if (item.formatType == "API") item.format = "API";
      else if (item.format == "API") item.format = "";

      // Auto detect mediaType from file extension embedded in URL, if any
      if (item.url) {
        let lookedUpType = config.url2mimeType(item.url)
        if (lookedUpType) item.mediaType = lookedUpType;
      }

      // Auto detect describedByType from file extension embedded in URL, if any
      if (item.describedBy) {
        let mime = config.url2mimeType(item.describedBy);
        if (mime) item.describedByType = mime;
      }

      for (var key in item) {
        if (item.hasOwnProperty(key) && key != "urlType") {
          if (!item[key]) validations[key] = "Empty.";
          else validations[key] = "";
        }
      }

      validations.title = config.global_validators.nonTrivialText(item.title, {
        minWords: 2,
        minCharsinWord: 3
      });

      if (item.urlType == "download" && !item.mediaType)
        validations.mediaType = "Empty.";
      else validations.mediaType = "";

      validations.url = config.global_validators.validUrl(item.url);
      validations.describedBy = config.global_validators.validUrl(
        item.describedBy
      );
      validations.conformsTo = config.global_validators.validUrl(
        item.conformsTo
      );
    }
  },

  computed: {
    distribution: {
      get: function () {
        var normalize = function (item, validations) {
          var normalizedItem = {
            "@type": "dcat:Distribution"
          };

          // Copy properties that require special handling

          if (item.urlType == "download")
            normalizedItem["downloadURL"] = item.url;
          else if (item.urlType == "access")
            normalizedItem["accessURL"] = item.url;

          if (item.mediaType) {
            var mediaTypeOption = config.distribution.mediaType.availableOptions.find(
              o => o.value == item.mediaType
            );
            if (mediaTypeOption) normalizedItem.format = mediaTypeOption.label;
          }

          for (var key in item) {
            if (item.hasOwnProperty(key)) {
              // Note if any property has validation messages
              if (validations[key]) {
                if (
                  validations[key] != "Empty." ||
                  key == "url" ||
                  key == "mediaType"
                )
                  normalizedItem["validations"] = "Fails validation";
              }

              // Copy properties that directly map to output
              if (
                item[key] &&
                key != "url" &&
                key != "urlType" &&
                key != "formatType"
              ) {
                normalizedItem[key] = item[key];
              }
            }
          }
          return normalizedItem;
        };

        var dist = [];
        for (var i = 0; i < this.modelValue.length; i++) {
          dist.push(normalize(this.modelValue[i], this.validations[i]));
        }

        return dist;
      },

      set: function (newValue) {
        config.noop(newValue);
      }
    }
  },

  data () {
    return {
      modelValue: this.value,
      validations: [],
      indexBeingEdited: -1,
      config: config
    };
  },

  watch: {
    value (newValue) {
      if (Array.isArray(newValue) && newValue.length) {
        if (!newValue[0].interned) {
          this.indexBeingEdited = -1;
          this.modelValue = newValue.map(item => this.intern(item));
        }
      } else {
        if (Array.isArray(this.modelValue) && this.modelValue.length && !newValue.length) {
          this.modelValue = newValue
        }
      }
    },

    modelValue: {
      handler: function (newValue) {
        this.validations = this.makeEmptyValidationsFor(newValue);
        for (var i = 0; i < this.modelValue.length; i++)
          if (this.indexBeingEdited == -1 || this.indexBeingEdited == i)
            this.validate(this.modelValue[i], this.validations[i]);
        this.$emit("input", this.distribution);
      },
      immediate: true,
      deep: true
    }
  },

  filters: {
    capitalize: config.capitalize
  }
};
</script>

<style scoped>
</style>