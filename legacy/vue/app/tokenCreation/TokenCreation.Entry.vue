<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'token-creation',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/token-creation/index', label: 'Creating token' }
    ]
  })
}
</script>

<style scoped>
</style>
