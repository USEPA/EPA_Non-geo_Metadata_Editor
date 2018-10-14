<template>
    <div>
        <q-card v-for="(item, index) in distInner" :key="index" class="q-ma-sm">
            <q-card-main>
                <div v-if="isBeingEdited(index)">

                  <q-field :icon="getIcon(index,'title')" :icon-color="getIconColor(index,'title')" :error="isError(index,'title')" :error-label="getErrorLabel(index,'title')">
                    <q-input v-model="item.title" float-label="Please enter the title for the URL below"/>
                  </q-field>

                  <q-field :icon="getIcon(index,'description')" :icon-color="getIconColor(index,'description')" :error="isError(index,'description')" :error-label="getErrorLabel(index,'description')">
                    <q-input v-model="item.description" :float-label="'Please enter a description for the dataset'" type="textarea" rows="3"/>
                  </q-field>

                  <br/>URL type: &nbsp;
                  <q-radio v-model="item.urlType" label="access" val="access"/>
                  &nbsp;&nbsp;
                  <q-radio v-model="item.urlType" label="download" val="download"/>

                  <q-field :icon="getIcon(index,'url')" :icon-color="getIconColor(index,'url')" :error="isError(index,'url')" :error-label="getErrorLabel(index,'url')">
                    <q-input v-model="item.url" :float-label="'Please enter the ' + item.urlType + ' URL for the dataset'"/>
                  </q-field>

                  <q-field :icon="getIcon(index,'mediaType')" :icon-color="getIconColor(index,'mediaType')" :error="isError(index,'mediaType')" :error-label="getErrorLabel(index,'mediaType')" v-show="item.urlType=='download'">
                    <OptionSelector 
                      :selectedOption.sync="item.mediaType" 
                      :availableOptions.sync="config['distribution']['mediaType']['availableOptions']"
                      placeHolderText="Please select the file format of the distribution's download URL"
                    />
                  </q-field>

                  <q-field :icon="getIcon(index,'format')" :icon-color="getIconColor(index,'format')" :error="isError(index,'format')" :error-label="getErrorLabel(index,'format')" v-show="item.urlType=='access'">
                    <q-input v-model="item.format" :float-label="'Please enter the a human-readable description of the file format of a distribution'"/>
                  </q-field>

                  <q-field :icon="getIcon(index,'describedBy')" :icon-color="getIconColor(index,'describedBy')" :error="isError(index,'describedBy')" :error-label="getErrorLabel(index,'describedBy')" v-show="item.urlType=='download'">
                    <TextInput defaultText="Please enter the URL to the data dictionary for the distribution found at the download URL" :userText.sync="item.describedBy"/>
                  </q-field>

                  <q-field :icon="getIcon(index,'describedByType')" :icon-color="getIconColor(index,'describedByType')" :error="isError(index,'describedByType')" :error-label="getErrorLabel(index,'describedByType')" v-show="item.urlType=='download'">
                    <OptionSelector 
                      :selectedOption.sync="item.describedByType" 
                      :availableOptions.sync="config['describedByType']['availableOptions']"
                      placeHolderText="Please select the type of file for the data dictionary"
                    />
                  </q-field>

                  <q-field :icon="getIcon(index,'conformsTo')" :icon-color="getIconColor(index,'conformsTo')" :error="isError(index,'conformsTo')" :error-label="getErrorLabel(index,'conformsTo')" v-show="item.urlType=='download'">
                    <TextInput defaultText="Please enter the URI for the standardized specification the distribution conforms to.	" :userText.sync="item.conformsTo"/>
                  </q-field>

                </div>
                <div v-else>
                    <div class="row">
                        <div class="col-md-auto" :style="getStyle(index,'title')">
                            <b><q-icon :name="getIcon(index,'title')"/> Title: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            {{item.title}}
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-md-auto" :style="getStyle(index,'description')">
                            <b><q-icon :name="getIcon(index,'description')"/> Description: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            {{item.description}}
                        </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-md-auto" :style="getStyle(index,'url')">
                            <b><q-icon :name="getIcon(index,'url')"/> {{item.urlType=="access"?"access":"download" | capitalize}} URL: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            <a target="previewURL" :href="item.url">{{item.url}}</a>
                        </div>
                    </div>
                    <div v-show="item.urlType=='download'">
                      <br/>
                      <div class="row">
                          <div class="col-md-auto" :style="getStyle(index,'mediaType')">
                              <b><q-icon :name="getIcon(index,'mediaType')"/> Media Type: &nbsp;</b>
                          </div>
                          <div class="col-md-auto">
                              {{item.mediaType}}
                          </div>
                      </div>
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-md-auto" :style="getStyle(index,'format')">
                            <b><q-icon :name="getIcon(index,'format')"/> Format: &nbsp;</b>
                        </div>
                        <div class="col-md-auto">
                            {{item.format}}
                        </div>
                    </div>

                    <div v-show="item.urlType=='download'">
                      <br/>
                      <div class="row">
                          <div class="col-md-auto" :style="getStyle(index,'describedBy')">
                              <b><q-icon :name="getIcon(index,'describedBy')"/> Described by: &nbsp;</b>
                          </div>
                          <div class="col-md-auto">
                              {{item.describedBy}}
                          </div>
                      </div>
                      <br/>
                      <div class="row">
                          <div class="col-md-auto" :style="getStyle(index,'describedByType')">
                              <b><q-icon :name="getIcon(index,'describedByType')"/> Described by type: &nbsp;</b>
                          </div>
                          <div class="col-md-auto">
                              {{item.describedByType}}
                          </div>
                      </div>
                      <br/>
                      <div class="row">
                          <div class="col-md-auto" :style="getStyle(index,'conformsTo')">
                              <b><q-icon :name="getIcon(index,'conformsTo')"/> Conforms to: &nbsp;</b>
                          </div>
                          <div class="col-md-auto">
                              {{item.conformsTo}}
                          </div>
                      </div>
                  </div>
                  <!--
                  -->
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

      this.validations.push({
        title: "",
        url: "",
        mediaType: "",
        format: "",
        description: "",
        describedBy: "",
        describedByType: "",
        conformsTo: ""
      });

      this.indexBeingEdited = this.distInner.length - 1;
    },

    editThis: function(index) {
      this.indexBeingEdited = index;
    },

    closeThis: function() {
      this.indexBeingEdited = -1;
    },

    deleteThis: function(index) {
      this.distInner.splice(index, 1);
      this.validations.splice(index, 1);
      this.indexBeingEdited = -1;
    },

    emitUpdate: function() {
      this.$emit("update:distribution", this.distribution);
    },

    isError: function(index, prop) {
      return (
        this.validations[index][prop].trim() != "" &&
        this.validations[index][prop].trim() != "Empty."
      );
    },

    getErrorLabel: function(index, prop) {
      return this.validations[index][prop].trim();
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

    getIconColor: function(index, prop) {
      var validation = this.validations[index][prop];
      if (validation == "Empty.")
        if (config.distribution[prop].mandatory) return "empty-mandatory";
        else return "empty-optional";
      else if (validation == "") return "valid";
      else return "invalid";
    },

    isBeingEdited: function(index) {
      return index == this.indexBeingEdited;
    },

    validate: function(item, validations) {
      for (var key in item) {
        if (item.hasOwnProperty(key) && key != "urlType") {
          if (
            !item[key] &&
            (item.urlType == "download" ||
              key == "description" ||
              key == "format" ||
              key == "title")
          )
            validations[key] = "Empty.";
          else validations[key] = "";
        }
      }

      if (item.title)
        validations.title = config.global_validators.nonTrivialText(
          item.title,
          { minWords: 2, minCharsinWord: 3 }
        );
      else validations.title = "Empty.";

      if (item.urlType == "download" && !item.mediaType)
        validations.mediaType = "Empty.";
      else validations.mediaType = "";

      validations.url = config.global_validators.validUrl(item.url);
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
              if (item[key] && key != "url" && key != "urlType") {
                normalizedItem[key] = item[key];
              }
            }
          }
          return normalizedItem;
        };

        var dist = [];
        for (var i = 0; i < this.distInner.length; i++) {
          dist.push(normalize(this.distInner[i], this.validations[i]));
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
      indexBeingEdited: -1,
      distInner: [],
      validations: [],
      config: config
    };
  },
  watch: {
    distInner: {
      handler: function() {
        if (this.indexBeingEdited > -1)
          this.validate(
            this.distInner[this.indexBeingEdited],
            this.validations[this.indexBeingEdited]
          );
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

<style>
.text-empty-mandatory {
  color: #fdae61;
}
.text-empty-optional {
  color: #9e9e9e91;
}
.text-invalid {
  color: #d7191c;
}
.text-valid {
  color: #1a9641;
}
</style>