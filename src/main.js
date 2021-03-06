import Vue from 'vue'
import App from './App.vue'
import UUID from 'vue-uuid'

import './styles/quasar.styl'
import 'quasar-framework/dist/quasar.ie.polyfills'
import iconSet from 'quasar-framework/icons/fontawesome'
import 'quasar-extras/animate'
import 'quasar-extras/roboto-font'
import 'quasar-extras/material-icons'
import 'quasar-extras/fontawesome'
import 'quasar-extras/ionicons'
import 'quasar-extras/mdi'
import Quasar from 'quasar'

Vue.use(Quasar, {
  config: {},
  iconSet: iconSet
})

import Icon from 'vue-awesome/components/Icon'
Vue.component('v-icon', Icon)

Vue.use(UUID)
Vue.config.productionTip = false

import revuest from 'revuest'
Vue.use(revuest)

if (process.env.NODE_ENV !== 'production') {
  /*
  const VueAxe = require('vue-axe')
  Vue.use(VueAxe, {
    config: {
      // ...
    }
  })
  */
}

new Vue({
  render: h => h(App)
}).$mount('#app')
