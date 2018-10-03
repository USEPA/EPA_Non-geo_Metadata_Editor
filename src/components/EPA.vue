<template>
  <q-layout-header>
    <q-toolbar
      color="primary"
      :glossy="$q.theme === 'mat'"
      :inverted="$q.theme === 'ios'"
    >
      <q-btn round aria-label="EPA logo">
        <img alt="EPA logo" style="width:2.7em" src="../assets/environmental_protection_agency-logo-white.png"  />
      </q-btn>

      <q-toolbar-title style="font-size:2.2em">
        EPA Open Data Metadata Editor
        <div slot="subtitle">for extramural researchers</div>
      </q-toolbar-title>
    </q-toolbar>
  </q-layout-header>
</template>

<script>
export default {
  name: "EPA"
};
</script>

<style scoped>
</style>