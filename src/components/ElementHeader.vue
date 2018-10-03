<template>
  <div @click="show($event)">

    <q-card-title style="background-color:#dddddd;padding: 0px">
        <q-item>
          <q-item-tile :icon="getValiMandaVisualizer().icon" :style="getValiMandaVisualizer().style"/>
          <q-item-main :label="title"  style="font-size:1.4em"/>
        </q-item>
    </q-card-title>

    <q-card-main>
      <div v-if="guidanceVisible" style="border-color: red;">
        <br/>
        <q-card inset>
          <q-item dense color="primary">
            <q-item-tile icon="fas fa-lightbulb" style="padding-left:0.2em;padding-right:1.1em;font-size:2em;color:gold;width:8em;"/>
            <q-item-main v-html="guidance" style="color:gray;width:999%"/>
          </q-item>
            <q-item-separator/>
          <q-item>
            <q-item-tile :icon="getValiMandaVisualizer().icon" :style="getValiMandaVisualizer().style"/>
            <q-item-main :style="getValiMandaVisualizer(false).style" v-html="getValidations()"/>
          </q-item>
        </q-card>
      </div>
    </q-card-main>

  </div>

</template>

<script>
export default {
  name: "ElementHeader",
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
      validationVisible: false
    };
  },

  methods: {
    show() {
      this.guidanceVisible = !this.guidanceVisible;
      this.validationVisible = !this.validationVisible;
    },

    getValidations() {
      if (this.validations.trim()) return this.validations.trim();
      else return "Valid.";
    },

    getValiMandaVisualizer: function(forIcon = true) {
      var vals = this.validations.replace(/^\s+|\s+$/g, "");
      var isEmpty =
        vals.startsWith("Empty.") ||
        vals.startsWith("Must select at least one.") ||
        vals.startsWith("Must make a selection.");
      var isValid = vals == "";
      var icon = "fas fa-meh-rolling-eyes";
      var color = "000000";
      if (this.mandatory && isEmpty) {
        icon = "fas fa-exclamation-triangle";
        color = "fdae61";
      } else if (!this.mandatory && isEmpty) {
        icon = "fas fa-question-circle";
        color = "9e9e9e91";
      } else if (isValid) {
        icon = "fas fa-check-circle";
        color = "1a9641";
      } else if (!isValid) {
        icon = "fas fa-times-circle";
        color = "d7191c";
      }
      var style = "color:#" + color;
      if (forIcon) style += ";font-size:2em;width:2em;";
      //;text-shadow: 3px 3px 16px #666666
      return { icon: icon, style: style };
    }
  }
};
</script>

<style scoped>
</style>