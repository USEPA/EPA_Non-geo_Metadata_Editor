<template>
  <div>
    <q-modal
      v-model="modalState"
      no-esc-dismiss
      no-route-dismiss
      no-backdrop-dismiss
      v-if="!authenticated"
    >
      <q-card>
        <q-card-title>Welcome</q-card-title>
        <q-card-main>
          <span v-if="loading">We're currently checking to see if you are logged in</span>
          <span v-if="!loading && authenticated">You are currently authenticated through Esri</span>
          <span
            v-if="!loading && !authenticated"
          >If you are an EPA user, you may login now to access additional functionality</span>
        </q-card-main>
        <q-card-actions>
          <q-btn
            v-if="!authenticated && !loading"
            dense
            color="primary"
            label="Login With EPA Geoplatform"
            @click="modalTrigger = true"
          />
          <q-btn
            v-if="!authenticated && !loading"
            dense
            color="primary"
            label="Continue Without Login"
            @click="modalState = false"
          />
        </q-card-actions>
        <q-inner-loading :visible="loading"></q-inner-loading>
      </q-card>
    </q-modal>
    <esri-auth
      :modal-trigger.sync="modalTrigger"
      @token="setAccessToken"
      @loaded="setLoading(false)"
      @authenticated="setAuthenticated"
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
      modalState: true,
      modalTrigger: false,
      loading: true,
      authenticated: false
    }
  },
  methods: {
    setAuthenticated (value) {
      this.authenticated = value
    },
    setLoading (value) {
      this.loading = value
      if (!this.loading) this.$emit('portal_auth_complete')
    },
    setAccessToken (token) {
      this.$emit('token', token)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>