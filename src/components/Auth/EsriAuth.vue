<template>
  <div>
    <div v-if="loading">
      <q-btn color="blue" :icon="'fa fa-spinner fa-spin'">&nbsp;&nbsp;Checking...</q-btn>
    </div>
    <div v-else-if="portalUser">
      Welcome
      <span style="font-weight: bold;">{{portalUser.fullName}}</span>
      &nbsp;&nbsp;
      <q-btn color="blue" :icon="'fas fa-user'" @click="signOut">&nbsp;&nbsp;Sign Out</q-btn>
    </div>
    <div v-else>
      <q-btn color="blue" :icon="'fa fa-user'" @click="signIn">&nbsp;&nbsp;Sign In</q-btn>
    </div>
  </div>
</template>

<script>
import { loadModules, loadCss } from 'esri-loader'

export default {

  name: 'EsriAuth',

  data () {
    return {
      portal: null,
      portalUser: null,
      appId: 's0brwjWwE7aFPPbF',
      loading: true
    }
  },

  methods: {
    populateUser (portalUser) {
      this.portalUser = portalUser
    }
    ,

    signIn () {
      this.portal.signIn().then(
        this.populateUser
      ).otherwise(
        function (error) {
          // eslint-disable-next-line
          console.log("Error occurred while signing in: ", error);
        }

      );
    },

    signOut () {
      this.portalUser = null
    }
  },

  watch: {
    "portalUser": function (newValue) {
      console.log("Portal user: ", newValue);
      this.$emit('user', newValue)
      this.loading = false
      if (!newValue)
        this.portal.signOut()
    }
  },

  mounted () {
    loadCss()
    const options = { version: '3.29', css: true, insertCssBefore: 'style' }
    loadModules(["esri/arcgis/Portal", "esri/arcgis/OAuthInfo", "esri/IdentityManager"], options)
      .then(([portalModule, OAuthInfoModule, IdentityManagerModule]) => {
        var info = new OAuthInfoModule({
          appId: this.appId,
          portalUrl: 'https://epa.maps.arcgis.com'
        })
        this.portal = new portalModule.Portal(info.portalUrl)

        IdentityManagerModule.registerOAuthInfos([info])

        IdentityManagerModule.checkSignInStatus(info.portalUrl + "/sharing").then(
          this.signIn
        ).otherwise(
          () => {
            this.loading = false
          }
        )
      })
  }
}
</script>

<style scoped>
</style>