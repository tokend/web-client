<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'issuance-creation',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/issuance-creation/index', label: 'Creating issuance' }
    ]
  })
}
</script>

<style scoped>
</style>
