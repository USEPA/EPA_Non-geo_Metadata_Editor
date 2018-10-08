<template>
    <div>
        <q-card v-for="(item, index) in distInner" :key="index" class="q-ma-sm">
            <q-card-main>
                <div v-if="isBeingEdited(index)">
                    <q-input v-model="item.title" :error="isError(item)" :warning="isWarning(item)" :float-label="titleLabel(item)"/>
                    <br/>URL type: &nbsp;
                    <q-radio v-model="item.urlType" label="access" val="access"/>
                    &nbsp;&nbsp;
                    <q-radio v-model="item.urlType" label="download" val="download"/>
                    <q-input v-model="item.url" :float-label="'Please enter the ' + item.urlType + ' URL for the dataset'"/>
                </div>
                <div v-else>
                    <b>Title: </b>{{item.title}}
                    <br/>
                    <b>{{item.urlType=="access"?"access":"download" | capitalize}} URL: </b><a target="previewURL" :href="item.url">{{item.url}}</a>
                    <br/>
                    <br/>
                </div>
                <br/>
                <div class="row">
                <q-btn class="col-sm" icon="fas fa-pen" label="Edit this distribution entry" @click="editThis(index)" v-show="!isBeingEdited(index)"/>
                <q-btn class="col-sm" icon="fas fa-check" label="Done editing this distribution entry" @click="closeThis(index)" v-show="isBeingEdited(index)"/>
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
import config from "../config.js";

export default {
  name: "Distribution",
  components: {
    TextInput
  },
  props: {},
  methods: {
    addAnother: function() {
      this.distInner.push({
        title: "",
        url: "",
        urlType: "download",
        titleValidation: "Empty.",
        urlValidation: "Empty."
      });
    },

    editThis: function(index) {
      this.indexBeingEdited = index;
    },

    closeThis: function(index) {
      this.indexBeingEdited = -1;
    },

    deleteThis: function(index) {
      this.distInner.splice(index, 1);
    },

    emitUpdate: function() {
      if (this.indexBeingEdited > -1)
        this.validate(this.distInner[this.indexBeingEdited]);
      this.$emit("update:distribution", this.distribution);
      //console.log(this.distribution);
    },

    isError: function(item) {
      this.validate(item);
      return (
        item.titleValidation.trim() != "" &&
        item.titleValidation.trim() != "Empty."
      );
    },

    isWarning: function(item) {
      this.validate(item);
      return item.titleValidation.trim() == "Empty.";
    },

    isBeingEdited: function(index) {
      return index == this.indexBeingEdited;
    },

    validate: function(item) {
      item.titleValidation = config.global_validators.nonTrivialText(
        item.title,
        { minWords: 2, minCharsinWord: 3 }
      );
      item.urlValidation = config.global_validators.validUrl(item.url);
      //console.log(item.titleValidation);
    },

    titleLabel: function(item) {
      return (
        "Please enter a title for the URL below" +
        (item.titleValidation ? " (" + item.titleValidation + ")" : "")
      );
    }
  },
  computed: {
    distribution: {
      get: function() {
        var normalize = function(item, copyValidation) {
          var normalizedItem = {
            title: item.title
          };

          if (item.urlType == "download")
            normalizedItem["downloadURL"] = item.url;
          else if (item.urlType == "access")
            normalizedItem["accessURL"] = item.url;

          normalizedItem["validations"] = "";
          if (copyValidation)
            if (item.titleValidation)
              normalizedItem["validations"] = item.titleValidation;
            else if (item.urlValidation)
              normalizedItem["validations"] = item.urlValidation;

          return normalizedItem;
        };
        console.log("distro!!");
        return this.distInner.map((item, index) =>
          normalize(
            item,
            this.indexBeingEdited == -1 || index == this.indexBeingEdited
          )
        );
      },
      set: function(newValue) {}
    }
  },
  data() {
    return {
      indexBeingEdited: -1,
      distInner: [
        {
          title: "",
          url: "",
          urlType: "download",
          titleValidation: "Empty.",
          urlValidation: "Empty."
        }
      ]
    };
  },
  watch: {
    distInner: {
      handler: function() {
        this.emitUpdate();
      },
      immediate: true,
      deep: true
    },
    indexBeingEdited: {
      handler: function() {
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