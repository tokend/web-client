<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'withdrawal',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/withdraw/make', label: 'Withdraw' }
    ]
  })
}
</script>

<style scoped>
</style>
