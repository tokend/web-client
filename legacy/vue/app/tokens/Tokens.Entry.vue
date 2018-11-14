<template>
  <router-view />
</template>

<script>
import RouteEntryMixin from '../../common/mixins/route-entry'

export default {
  name: 'tokens',
  mixins: [RouteEntryMixin],
  data: _ => ({
    routes: [
      { path: '/tokens/explore', label: 'Explore' }
    ]
  })
}
</script>

<style scoped>
</style>
