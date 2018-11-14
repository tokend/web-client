<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'wallet',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/wallet/overview', label: 'Overview' }
    ]
  })
}
</script>

<style scoped>

</style>
