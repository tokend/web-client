<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'preissuance-creation',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/preissuance-creation/index', label: 'Upload preissuance' }
    ]
  })
}
</script>

<style scoped>
</style>
