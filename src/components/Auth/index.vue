<template>
  <div>
    <esri-auth @user="$emit('user', $event)" />
  </div>
</template>

<script>
import EsriAuth from './EsriAuth'

export default {
  name: 'AuthWrapper',

  components: {
    EsriAuth
  },

}
</script>

<style lang="scss" scoped>
</style>