<template>
  <router-link
    class="logotype"
    :to="vueRoutes.dashboard">
    <img
      src="@static/branding/logo.png"
      :alt="config.APP_NAME">
  </router-link>
</template>

<script>
import config from '@/config'

import { vueRoutes } from '@/vue-router/routes'

export default {
  data: _ => ({
    vueRoutes,
    config,
  }),
}
</script>

<style lang="scss">
.logotype img {
  max-height: 4.5rem;
  height: inherit;
}
</style>
