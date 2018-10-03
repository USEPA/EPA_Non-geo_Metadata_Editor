<template>    
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
            color="primary"
            icon="fas fa-ellipsis-v"
            direction="up"
        >
            
            <q-fab-action
                color="primary"
                @click="$ons.notification.alert(`You will eventually be able to save this record!`)"
                icon="far fa-save"
            >
                <q-tooltip anchor="center left" self="center right">Save</q-tooltip>
            </q-fab-action>

            <q-fab-action
                color="primary"
                @click="$ons.notification.alert(doc)"
                icon="fas fa-file"
            >
                <q-tooltip anchor="center left" self="center right">View</q-tooltip>
            </q-fab-action>

    </q-fab>
    </q-page-sticky>
</template>

<script>
export default {
  name: "SpeedDial",
  props: {
    doc: String
  }
};
</script>

<style scoped>
</style>