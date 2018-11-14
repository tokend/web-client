<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'trade',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/trade/make', label: 'Trade' }
    ]
  })
}
</script>

<style scoped>
</style>
