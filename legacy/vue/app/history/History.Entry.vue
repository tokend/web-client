<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'history',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/history/index', label: 'History' }
    ]
  })
}
</script>

<style scoped>
</style>
