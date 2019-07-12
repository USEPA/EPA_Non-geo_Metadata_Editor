<template>
  <div>
    <div v-if="personalizedView">
      Welcome
      <span style="font-weight: bold;">{{fullName}}</span>
      &nbsp;&nbsp;
      <q-btn color="blue" :icon="'fas fa-user'" @click="signOut">&nbsp;&nbsp;Sign Out</q-btn>
    </div>
  </div>
</template>

<script>
import { loadModules, loadCss } from 'esri-loader'
export default {
  name: 'EsriAuth',
  props: ['modalTrigger'],
  data () {
    return {
      esriId: null,
      info: null,
      arcgisPortal: null,
      fullName: '',
      anonView: true,
      personalizedView: false,
      appId: 'hbaGyaPPJzMxGnOj',
      AuthUrl: `https://epa.maps.arcgis.com/sharing/oauth2/authorize?redirect_uri=${window.location.origin}/&client_id=hbaGyaPPJzMxGnOj&response_type=token`
    }
  },
  methods: {
    displayItems () {
      new this.arcgisPortal.Portal(this.info.portalUrl).signIn().then(
        (portalUser) => {
          // console.log("Signed in to the portal: ", portalUser);
          this.fullName = portalUser.fullName
          this.personalizedView = true
          this.$emit('token', portalUser.credential.token)
        }
      ).otherwise(
        function (error) {
          // eslint-disable-next-line
          console.log("Error occurred while signing in: ", error);
        }
      );
    },
    signIn () {
      // console.log("click", arguments);
      // user will be shown the OAuth Sign In page
      this.esriId.getCredential(this.info.portalUrl + "/sharing", {
        oAuthPopupConfirmation: false
      }
      ).then(() => {
        this.displayItems();
      });
    },
    signOut () {
      this.fullName = ''
      this.personalizedView = false
      this.esriId.destroyCredentials();
      this.$emit('authenticated', false)
    }
  },
  watch: {
    modalTrigger: {
      handler: 'signIn'
    }
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
            this.$emit('loaded')
            this.$emit('authenticated', true)
            this.displayItems();
          }
        ).otherwise(
          () => {
            this.$emit('loaded')
            this.$emit('authenticated', false)
            this.anonView = true
            this.personalizedView = false
          }
        )
      })
  }
}
</script>

<style scoped>
</style>