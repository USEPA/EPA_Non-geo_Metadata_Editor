<template>
  <q-card class="q-ma-sm">
    <q-card-main>
      <span v-if="!isEpaUser">
        <span class="q-subheading">If you are an EPA user, you can login for additional functionality.</span>&nbsp;
        <q-btn color="blue" :icon="'far fa-user'" @click="login">&nbsp;&nbsp;Login</q-btn>
      </span>

      <span v-else>
        <span class="q-subheading">You are logged in as an EPA user and can access additional functionality.</span>&nbsp;
        <q-btn color="blue" :icon="'fas fa-user'" @click="logout">&nbsp;&nbsp;Logout</q-btn>
      </span>
    </q-card-main>
  </q-card>
</template>

<script>
export default {
  name: "Authentication",
  props: ["isEpaUser"],
  data () {
    return {
      AuthUrl: `https://epa.maps.arcgis.com/sharing/oauth2/authorize?redirect_uri=${window.location.origin}/&client_id=hbaGyaPPJzMxGnOj&response_type=token`,
      logoutUrl: ''
    }
  },
  methods: {
    login () {
      window.location = this.AuthUrl
    },
    logout () {
      window.location = this.logoutUrl
    },
    getQueryVariable (variable) {
      let query = window.location.hash.substring(1)
      // console.log('query', query, window.location)
      let vars = query.split("&")
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=")
        if (pair[0] == variable) { return pair[1] }
      }
      return (false)
    }
  },
  mounted () {
    this.$emit('token', this.getQueryVariable("access_token"))
  }
}
</script>
