<template>
  <div>
    <q-layout-header>
      <q-toolbar color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'">
        <slot name="left" />

        <q-toolbar-title style="font-size:2.2em">
          EPA Open Data Metadata Editor
          <div slot="subtitle">for extramural researchers</div>
        </q-toolbar-title>
        <slot name="right" />
      </q-toolbar>
    </q-layout-header>
  </div>
</template>

<script>
export default {
  name: "EPA"
};
</script>

<style scoped>
</style>