<template>
  <div>
    <esri-auth
      @token="setAccessToken"
      @loaded="setLoading(false)"
      @authenticated="setAuthenticated"
      @logout="$emit('logout')"
      :loading="loading"
    />
  </div>
</template>

<script>
import EsriAuth from './EsriAuth'

export default {
  name: 'AuthWrapper',

  components: {
    EsriAuth
  },

  data () {
    return {
      loading: true,
      authenticated: false
    }
  },

  methods: {
    setAuthenticated (value) {
      this.authenticated = value
      if (!this.authenticated) this.$emit('token', "")
    },
    setLoading (value) {
      this.loading = value
    },
    setAccessToken (token) {
      this.$emit('token', token)
    }
  },

}
</script>

<style lang="scss" scoped>
</style>