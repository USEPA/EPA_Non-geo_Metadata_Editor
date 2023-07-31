<template>
  <div>
    <div v-if="loading">
      <q-btn color="blue" :icon="'fa fa-spinner fa-spin'">&nbsp;&nbsp;Checking...</q-btn>
    </div>
    <div v-else-if="edgUserData">
      <q-tooltip>You are an {{userText}}</q-tooltip>Welcome
      <span style="font-weight: bold;">{{portalUser.fullName}}</span>
      &nbsp;&nbsp;
      <q-btn color="blue" :icon="userIcon" @click="signOut">&nbsp;&nbsp;Sign Out</q-btn>
    </div>
    <div v-else>
      <q-btn color="blue" :icon="'far fa-user'" @click="signIn">&nbsp;&nbsp;Sign In</q-btn>
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
      loading: true,
      edgUserData: null,
      edgUrl: 'https://edg.epa.gov/metadata/'
      // edgUrl: 'http://52.20.85.254:8080/metadata/'
    }
  },

  computed: {
    userIcon: function () {
      let icon = ''
      if (this.portalUser)
        if (this.edgUserData)
          if (this.edgUserData.roles.gptAdministrator)
            icon = 'shield'
          else if (this.edgUserData.roles.gptPublisher)
            icon = 'edit'
      if (icon)
        return 'fas fa-user-' + icon
      else
        return 'fa fa-user'
    },

    userText: function () {
      let txt = ''
      if (this.portalUser)
        if (this.edgUserData)
          if (this.edgUserData.roles.gptAdministrator)
            txt = 'EDG Administrator'
          else if (this.edgUserData.roles.gptPublisher)
            txt = 'EDG Publisher'
          else if (this.edgUserData.roles.gptRegisteredUser)
            txt = 'EDG User'
      return txt
    },

  },

  methods: {
    populateUser (portalUser) {
      this.portalUser = portalUser
          if (portalUser && portalUser.credential)
          // hard coding this for now because the distinction isn't meaningful until the editor is wired up to write to a metadata catalog via api.
              this.edgUserData = {
                  "roles": {
                      "gptAdministrator": false,
                      "gptPublisher": true,
                      "gptRegisteredUser": true
                  },
                  "user": portalUser
              }
        //fetch(
        //  `${this.edgUrl}/getUserData.jsp?u=${portalUser.credential.userId}&t=${portalUser.credential.token}`
        //)
        //  .then(response => response.json())
        //  .then(data => {
            // eslint-disable-next-line
        //    console.log('EDG:', data)
        //    if (data && data.user) this.edgUserData = data;
        //  });
    },

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
      this.loading = true
      this.portalUser = null
    }
  },

  watch: {
    "portalUser": function (newValue) {
      // eslint-disable-next-line
      console.log("Portal user: ", newValue);
      this.$emit('user', newValue)
      this.loading = false
      if (!newValue) {
        this.portal.signOut()
        this.edgUserData = null
      }
    }
  },

  mounted () {
    loadCss()
    const options = { version: '3.29' }
    loadModules(["esri/arcgis/Portal", "esri/arcgis/OAuthInfo", "esri/IdentityManager"], options)
      .then(([portalModule, OAuthInfoModule, IdentityManagerModule]) => {
        var info = new OAuthInfoModule({
          appId: 's0brwjWwE7aFPPbF',
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