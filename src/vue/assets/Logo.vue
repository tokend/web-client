<template>
  <router-link class="logotype" :to="vueRoutes.dashboard">
    <img src="@static/branding/logo.svg" :alt="config.APP_NAME">
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
  height: inherit;
}
</style>
