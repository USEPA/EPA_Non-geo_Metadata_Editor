<template>
  <div>
    <div v-if="loading">
      <q-btn color="blue" :icon="'fa fa-spinner fa-spin'">&nbsp;&nbsp;Checking...</q-btn>
    </div>
    <div v-else-if="personalizedView">
      Welcome
      <span style="font-weight: bold;">{{fullName}}</span>
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
  props: {
  },
  data () {
    return {
      esriId: null,
      info: null,
      arcgisPortal: null,
      fullName: '',
      personalizedView: false,
      appId: 's0brwjWwE7aFPPbF',
      loading: true
    }
  },
  methods: {
    displayItems () {
      new this.arcgisPortal.Portal(this.info.portalUrl).signIn().then(
        (portalUser) => {
          console.log("Signed in to the portal: ", portalUser);
          this.$emit('user', portalUser)
          this.fullName = portalUser.fullName
          this.personalizedView = true
          this.loading = false
        }
      ).otherwise(
        function (error) {
          // eslint-disable-next-line
          console.log("Error occurred while signing in: ", error);
        }

      );
    },

    signIn () {
      // user will be shown the OAuth Sign In page
      this.esriId.getCredential(this.info.portalUrl + "/sharing");
    },

    signOut () {
      this.personalizedView = false
      this.fullName = ''
      this.esriId.destroyCredentials();
      this.$emit('user', null)
    }
  },

  computed: {
    AuthUrl: () => `https://epa.maps.arcgis.com/sharing/oauth2/authorize?redirect_uri=${window.location.origin}/&client_id=${appId}&response_type=token`
  },

  mounted () {
    loadCss()
    const options = { version: '3.29', css: true, insertCssBefore: 'style' }
    loadModules(["esri/arcgis/Portal", "esri/arcgis/OAuthInfo", "esri/IdentityManager"], options)
      .then(([arcgisPortal, OAuthInfo, esriId]) => {
        this.esriId = esriId
        this.arcgisPortal = arcgisPortal
        this.info = new OAuthInfo({
          appId: this.appId,
          portalUrl: 'https://epa.maps.arcgis.com'
        })

        this.esriId.registerOAuthInfos([this.info]);

        this.esriId.checkSignInStatus(this.info.portalUrl + "/sharing").then(
          () => {
            this.displayItems();
          }
        ).otherwise(
          () => {
            this.personalizedView = false
            this.loading = false
          }
        )
      })
  }
}
</script>

<style scoped>
</style>