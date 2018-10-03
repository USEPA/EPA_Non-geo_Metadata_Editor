import Vue from "vue";
import App from "./App.vue";
//import store from './store'
import UUID from "vue-uuid";

import "./styles/quasar.styl";
import "quasar-framework/dist/quasar.ie.polyfills";
import iconSet from "quasar-framework/icons/fontawesome";
import "quasar-extras/animate";
import "quasar-extras/roboto-font";
import "quasar-extras/material-icons";
import "quasar-extras/fontawesome";
import "quasar-extras/ionicons";
import "quasar-extras/mdi";
import Quasar from "quasar";

Vue.use(Quasar, {
  config: {},
  iconSet: iconSet
});

Vue.use(UUID);
Vue.config.productionTip = false;

new Vue({
  //  store,
  render: h => h(App)
}).$mount("#app");
