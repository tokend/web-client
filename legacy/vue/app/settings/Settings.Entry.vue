<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'settings',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/settings/security', label: 'Security' }
    ]
  })
}
</script>

<style scoped>
</style>
