<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'requests',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/requests/index', label: 'Requests' }
    ]
  })
}
</script>

<style scoped>
</style>
