<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'sales',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/sales/explore', label: 'Explore' }
    ]
  })
}
</script>

<style scoped>
</style>
