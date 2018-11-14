<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'sale-creation',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/sale-creation/index', label: 'Creating sale' }
    ]
  })
}
</script>

<style scoped>
</style>
