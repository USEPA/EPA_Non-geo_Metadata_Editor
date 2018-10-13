<template>
    <div>
        <q-card v-for="(item, index) in distInner" :key="index" class="q-ma-sm">
            <q-card-main>
                <div v-if="isBeingEdited(index)">
                  <q-field :error="isError(item,'title')" :error-label="validations.title">
                    <q-input v-model="item.title" float-label="Please enter the title for the URL below"/>
                  </q-field>
                  <q-field :error="isError(item,'description')" :error-label="validations.description">
                    <q-input v-model="item.description" :float-label="'Please enter a description for the dataset'" type="textarea" rows="3"/>
                  </q-field>
                    <br/>URL type: &nbsp;
                    <q-radio v-model="item.urlType" label="access" val="access"/>
                    &nbsp;&nbsp;
                    <q-radio v-model="item.urlType" label="download" val="download"/>
                  <q-field :error="isError(item,'url')" :error-label="validations.url">
                    <q-input v-model="item.url" :float-label="'Please enter the ' + item.urlType + ' URL for the dataset'"/>
                  </q-field>
                  <q-field :error="isError(item,'mediaType')" :error-label="validations.mediaType" v-show="item.urlType=='download'">
                    <OptionSelector 
                      :selectedOption.sync="item.mediaType" 
                      :availableOptions.sync="config['distribution']['mediaType']['availableOptions']"
                      placeHolderText="Please select the file format of the distribution's download URL"
                    />
                  </q-field>
                  <q-field :error="isError(item,'format')" :error-label="validations.format" v-show="item.urlType=='access'">
                    <q-input v-model="item.format" :float-label="'Please enter the a human-readable description of the file format of a distribution'"/>
                  </q-field>
                  <q-field :error="isError(item,'describedBy')" :error-label="validations.describedBy" v-show="item.urlType=='download'">
                    <TextInput defaultText="Please enter the URL to the data dictionary for the distribution found at the download URL" :userText.sync="item.describedBy"/>
                  </q-field>
                  <q-field :error="isError(item,'describedByType')" :error-label="validations.describedByType" v-show="item.urlType=='download'">
                    <OptionSelector 
                      :selectedOption.sync="item.describedByType" 
                      :availableOptions.sync="config['describedByType']['availableOptions']"
                      placeHolderText="Please select the type of file for the data dictionary"
                    />
                  </q-field>
                  <q-field :error="isError(item,'conformsTo')" :error-label="validations.conformsTo" v-show="item.urlType=='download'">
                    <TextInput defaultText="Please enter the URI for the standardized specification the distribution conforms to.	" :userText.sync="item.conformsTo"/>
                  </q-field>
                  <!--
                  -->
                </div>
                <div v-else>
                    <div class="row">
                        <div class="col-md-auto" :style="getValiMandaVisualizer(validations.title,false,false).style">
                            <b><q-icon :name="getValiMandaVisualizer(validations.title).icon"/> Title: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            {{item.title}}
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-md-auto" :style="getValiMandaVisualizer(validations.description,false,false).style">
                            <b><q-icon :name="getValiMandaVisualizer(validations.description).icon"/> Description: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            {{item.description}}
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-md-auto" :style="getValiMandaVisualizer(validations.url,false,false).style">
                            <b><q-icon :name="getValiMandaVisualizer(validations.url).icon"/> {{item.urlType=="access"?"access":"download" | capitalize}} URL: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            <a target="previewURL" :href="item.url">{{item.url}}</a>
                        </div>
                    </div>
                    <div v-show="item.urlType=='download'">
                    <br/>
                    <div class="row">
                        <div class="col-md-auto" :style="getValiMandaVisualizer(validations.mediaType,false,false).style">
                            <b><q-icon :name="getValiMandaVisualizer(validations.mediaType).icon"/> Media Type: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            {{item.mediaType}}
                        </div>
                    </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-md-auto" :style="getValiMandaVisualizer(validations.format,false,false).style">
                            <b><q-icon :name="getValiMandaVisualizer(validations.format).icon"/> Format: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            {{item.format}}
                        </div>
                    </div>

                    <div v-show="item.urlType=='download'">
                    <br/>
                    <div class="row">
                        <div class="col-md-auto" :style="getValiMandaVisualizer(validations.describedBy,false,false).style">
                            <b><q-icon :name="getValiMandaVisualizer(validations.describedBy).icon"/> Described by: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            {{item.describedBy}}
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-md-auto" :style="getValiMandaVisualizer(validations.describedByType,false,false).style">
                            <b><q-icon :name="getValiMandaVisualizer(validations.describedByType).icon"/> Described by type: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            {{item.describedByType}}
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-md-auto" :style="getValiMandaVisualizer(validations.conformsTo,false,false).style">
                            <b><q-icon :name="getValiMandaVisualizer(validations.conformsTo).icon"/> Conforms to: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            {{item.conformsTo}}
                        </div>
                    </div>
                </div>
                </div>
                <br/>
                <div class="row">
                <q-btn class="col-sm" icon="fas fa-pen" label="Edit this distribution entry" @click="editThis(index)" v-show="!isBeingEdited(index)"/>
                <q-btn class="col-sm" icon="fas fa-check" label="Done editing this distribution entry" @click="closeThis()" v-show="isBeingEdited(index)"/>
                <q-btn class="col-sm" icon="fas fa-trash" label="Delete this distribution entry" @click="deleteThis(index)"/>
                </div>
            </q-card-main>
        </q-card>

        <br/>
        <q-btn icon="fas fa-plus" :label="'Add '+(distInner.length?'another':'a')+' distribution entry'" @click="addAnother()"/>
    </div>
</template>

<script>
import TextInput from "../components/TextInput.vue";
import OptionSelector from "../components/OptionSelector.vue";
import config from "../config.js";

export default {
  name: "Distribution",
  components: {
    TextInput,
    OptionSelector
  },
  props: {},
  methods: {
    addAnother: function() {
      this.distInner.push({
        title: "",
        description: "",
        url: "",
        urlType: "access",
        mediaType: "",
        format: "",
        describedBy: "",
        describedByType: "",
        conformsTo: ""
      });
      this.indexBeingEdited = this.distInner.length - 1;
    },

    editThis: function(index) {
      this.validations = {
        title: "",
        url: "",
        mediaType: "",
        format: "",
        description: "",
        describedBy: "",
        describedByType: "",
        conformsTo: ""
      };
      this.indexBeingEdited = index;
    },

    closeThis: function() {
      this.indexBeingEdited = -1;
    },

    deleteThis: function(index) {
      this.distInner.splice(index, 1);
      this.indexBeingEdited = -1;
    },

    emitUpdate: function() {
      if (this.indexBeingEdited > -1)
        this.validate(this.distInner[this.indexBeingEdited]);
      this.$emit("update:distribution", this.distribution);
    },

    isError: function(item, prop) {
      //this.validate(item);
      return (
        this.validations[prop].trim() != "" &&
        this.validations[prop].trim() != "Empty."
      );
    },

    isBeingEdited: function(index) {
      return index == this.indexBeingEdited;
    },

    validate: function(item) {
      for (var key in item) {
        if (item.hasOwnProperty(key) && key != "urlType") {
          if (
            !item[key] &&
            (item.urlType == "download" ||
              key == "description" ||
              key == "format" ||
              key == "title")
          )
            this.validations[key] = "Empty.";
          else this.validations[key] = "";
        }
      }

      if (item.title)
        this.validations.title = config.global_validators.nonTrivialText(
          item.title,
          { minWords: 2, minCharsinWord: 3 }
        );
      else this.validations.title = "Empty.";

      if (item.urlType == "download" && !item.mediaType)
        this.validations.mediaType = "Empty.";
      else this.validations.mediaType = "";

      this.validations.url = config.global_validators.validUrl(item.url);
    },

    getValiMandaVisualizer: function(
      validations,
      mandatory = false,
      forIcon = true
    ) {
      return config.getValiMandaVisualizer(validations, mandatory, forIcon);
    }
  },

  computed: {
    distribution: {
      get: function() {
        var validationsCopy = this.validations;

        var normalize = function(item) {
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
              if (validationsCopy[key]) {
                if (
                  validationsCopy[key] != "Empty." ||
                  key == "url" ||
                  key == "mediaType"
                )
                  normalizedItem["validations"] = "Fails validation";
              }

              // Copy properties that directly map to output
              if (item[key] && key != "url" && key != "urlType") {
                normalizedItem[key] = item[key];
              }
            }
          }

          return normalizedItem;
        };

        return this.distInner.map(item => normalize(item));
      },
      set: function(newValue) {
        config.noop(newValue);
      }
    }
  },
  data() {
    return {
      indexBeingEdited: -1,
      distInner: [],
      validations: {},
      config: config
    };
  },
  watch: {
    distInner: {
      handler: function() {
        if (this.indexBeingEdited > -1)
          this.validate(this.distInner[this.indexBeingEdited]);
        this.emitUpdate();
      },
      immediate: true,
      deep: true
    }
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
};
</script>

<style scoped>
</style>