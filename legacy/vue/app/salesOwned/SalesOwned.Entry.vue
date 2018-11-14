<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'my-sales',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/issuance-creation/index', label: 'My sales' }
    ]
  })
}
</script>

<style scoped>
</style>
