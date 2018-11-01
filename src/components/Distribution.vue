<template>
    <div>
        <q-card v-for="(item, index) in modelValue" :key="index" class="q-ma-sm">
            <q-card-main>

                <FieldWrapper :propInfo="getPropInfo(index, 'title')">
                  <q-input v-model="item.title" float-label="Please enter the title for the URL below"/>
                </FieldWrapper>

                <FieldWrapper :propInfo="getPropInfo(index, 'description')">
                  <q-input v-model="item.description" :float-label="'Please enter a description for the dataset'" type="textarea" rows="3"/>
                </FieldWrapper>

                <div v-if="isBeingEdited(index)">
                  URL type: &nbsp;
                  <q-radio v-model="item.urlType" label="access" val="access"/>
                  &nbsp;&nbsp;
                  <q-radio v-model="item.urlType" label="download" val="download"/>

                  <FieldWrapper :propInfo="getPropInfo(index, 'url')">
                    <q-input v-model="item.url" :float-label="'Please enter the ' + item.urlType + ' URL for the dataset'"/>
                  </FieldWrapper>
                </div>
                <div v-else>
                    <div class="row">
                        <div class="col-md-auto" :style="getStyle(index,'url')">
                            <b><q-icon :name="getIcon(index,'url')"/> {{item.urlType=="access"?"access":"download" | capitalize}} URL: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            <a target="previewURL" :href="item.url">{{item.url}}</a>
                        </div>
                    </div>
                </div>
                <br/>

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
                    <TextInput v-show="item.formatType=='Other'" defaultText="Please enter the a human-readable description of the file format of the distribution" v-model="item.format"/>
                </FieldWrapper>

                  <FieldWrapper :propInfo="getPropInfo(index, 'describedBy')">
                    <TextInput defaultText="Please enter the URL to the data dictionary for the distribution found at the download URL" v-model="item.describedBy"/>
                  </FieldWrapper>

                  <FieldWrapper :propInfo="getPropInfo(index, 'describedByType')">
                    <OptionSelector 
                      v-model="item.describedByType" 
                      :availableOptions.sync="config['describedByType']['availableOptions']"
                      placeHolderText="Please select the type of file for the data dictionary"
                    />
                  </FieldWrapper>

                  <FieldWrapper :propInfo="getPropInfo(index, 'conformsTo')">
                    <TextInput defaultText="Please enter the URI for the standardized specification the distribution conforms to.	" v-model="item.conformsTo"/>
                  </FieldWrapper>

                <br/>
                <div class="row">
                  <q-btn class="col-sm" icon="fas fa-pen" label="Edit this distribution entry" @click="editThis(index)" v-show="!isBeingEdited(index)"/>
                  <q-btn class="col-sm" icon="fas fa-check" label="Done editing this distribution entry" @click="closeThis()" v-show="isBeingEdited(index)"/>
                  <q-btn class="col-sm" icon="fas fa-trash" label="Delete this distribution entry" @click="deleteThis(index)"/>
                </div>
            </q-card-main>
        </q-card>

        <br/>
        <q-btn icon="fas fa-plus" :label="'Add '+(modelValue.length?'another':'a')+' distribution entry'" @click="addAnother()"/>
    </div>
</template>

<script>
import TextInput from "../components/TextInput.vue";
import OptionSelector from "../components/OptionSelector.vue";
import FieldWrapper from "../components/FieldWrapper.vue";
import config from "../config.js";

export default {
  name: "Distribution",

  components: {
    TextInput,
    OptionSelector,
    FieldWrapper
  },

  props: {
    value: {
      type: Array,
      default: []
    }
  },

  methods: {
    makeEmptyDistribution: function() {
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

    intern: function(fromItem) {
      // Ignore already interned items
      if (!fromItem || fromItem.interned) return fromItem;

      // Start with empty distribution
      var item = this.makeEmptyDistribution();
      // Copy properties that are mapped directly
      Object.keys(item).map(prop => {
        if (fromItem[prop]) item[prop] = fromItem[prop];
      });
      // Handle special cases
      if (fromItem["downloadURL"]) {
        item.url = fromItem["downloadURL"];
        item.urlType = "download";
      } else {
        item.url = fromItem["accessURL"] || "";
        item.urlType = "access";
      }

      item.interned = true;

      return item;
    },

    makeEmptyValidation: function() {
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

    makeEmptyValidationsFor: function(dist) {
      return dist.map(item => this.makeEmptyValidation());
    },

    addAnother: function() {
      this.modelValue.push(this.makeEmptyDistribution());

      this.validations.push(this.makeEmptyValidation());

      this.indexBeingEdited = this.modelValue.length - 1;
    },

    editThis: function(index) {
      this.indexBeingEdited = index;
    },

    closeThis: function() {
      this.indexBeingEdited = -1;
    },

    deleteThis: function(index) {
      this.modelValue.splice(index, 1);
      this.validations.splice(index, 1);
      this.indexBeingEdited = -1;
    },

    getPropInfo: function(index, prop) {
      return {
        name: prop,
        mandatory: config.distribution[prop].mandatory,
        value: this.modelValue[index][prop],
        validation: this.validations[index][prop],
        editMode: this.isBeingEdited(index)
      };
    },

    getStyle: function(index, prop) {
      return config.getValiMandaVisualizer(
        this.validations[index][prop],
        config.distribution[prop].mandatory,
        false
      ).style;
    },

    getIcon: function(index, prop) {
      return config.getValiMandaVisualizer(
        this.validations[index][prop],
        false,
        true
      ).icon;
    },

    isBeingEdited: function(index) {
      return index == this.indexBeingEdited;
    },

    validate: function(item, validations) {
      console.log("validate");
      if (item.formatType == "API") item.format = "API";
      else if (item.format == "API") item.format = "";

      // Auto detect mediaType from file extension embedded in URL, if any
      if (item.url) {
        var ext = item.url.split(".").pop();
        var mime = config.extension2mimeType(ext);
        item.mediaType = mime;
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
      get: function() {
        var normalize = function(item, validations) {
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

      set: function(newValue) {
        config.noop(newValue);
      }
    }
  },

  data() {
    return {
      modelValue: this.value,
      validations: [],
      indexBeingEdited: -1,
      config: config
    };
  },

  watch: {
    value(newValue) {
      if (newValue.length && !newValue[0].interned) {
        this.indexBeingEdited = -1;
        this.modelValue = newValue.map(item => this.intern(item));
      }
    },

    modelValue: {
      handler: function(newValue) {
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