<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'deposit',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/deposit/make', label: 'Deposit' }
    ]
  })
}
</script>

<style scoped>
</style>
