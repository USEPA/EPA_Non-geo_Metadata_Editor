<template>
  <div>
    <q-card-title style="background-color:#dddddd; padding:0px; cursor:pointer;">
      <div @click="show()" class="element">
        <q-item>
          <ValidationIcon :validations="validations" :mandatory="mandatory"/>
          <q-item-main style="font-size: 1.4em;">{{title}}</q-item-main>
        </q-item>
      </div>
    </q-card-title>

    <q-card-main>
      <div v-if="guidanceVisible" style="border-color: red;" class="animate-scale">
        <br>
        <q-card inset>
          <q-item>
            <q-item-tile>
              <v-icon scale="2" name="lightbulb" style="color:gold"/>
            </q-item-tile>
            <q-item-main v-html="guidance" style="color:gray;padding-left:1.4em"/>
          </q-item>
          <q-item-separator/>
          <q-item>
            <q-item-tile>
              <ValidationIcon :validations="validations" :mandatory="mandatory"/>
            </q-item-tile>
            <q-item-main :style="getValiMandaVisualizer().style" v-html="getValidations()"/>
          </q-item>
        </q-card>
      </div>
    </q-card-main>
  </div>
</template>

<script>
import ValidationIcon from "./ValidationIcon.vue";
import config from "../config.js";

export default {
  name: "ElementHeader",

  components: {
    ValidationIcon
  },

  props: {
    title: String,
    guidance: {
      type: String,
      default: "No guidance available at this time."
    },
    validations: String,
    mandatory: false
  },

  data: () => {
    return {
      guidanceVisible: false,
      validationVisible: false,
      config: config
    };
  },

  methods: {
    show () {
      this.guidanceVisible = !this.guidanceVisible;
      this.validationVisible = !this.validationVisible;
    },

    getValidations () {
      if (this.validations.trim()) return this.validations.trim();
      else return "Valid.";
    },

    getValiMandaVisualizer: function () {
      return config.getValiMandaVisualizer(this.validations, this.mandatory);
    }
  }
};
</script>

<style scoped>
.element:hover {
  background-color: #aaa;
}
</style>