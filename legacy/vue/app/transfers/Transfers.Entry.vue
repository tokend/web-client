<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'transfers',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/transfers/make', label: 'Send' }
    ]
  })
}
</script>

<style scoped>
</style>
