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
import hljs from "highlight.js";

Vue.directive("highlightjs", {
  deep: true,
  bind: function(el, binding) {
    // on first bind, highlight all targets
    let targets = el.querySelectorAll("code");
    targets.forEach(target => {
      // if a value is directly assigned to the directive, use this
      // instead of the element content.
      if (binding.value) {
        target.textContent = binding.value;
      }
      hljs.highlightBlock(target);
    });
  },
  componentUpdated: function(el, binding) {
    // after an update, re-fill the content and then highlight
    let targets = el.querySelectorAll("code");
    targets.forEach(target => {
      if (binding.value) {
        target.textContent = binding.value;
        hljs.highlightBlock(target);
      }
    });
  }
});

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
