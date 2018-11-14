<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'mass-transfers',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/issuance-creation/index', label: 'Mass payment' }
    ]
  })
}
</script>

<style scoped>
</style>
