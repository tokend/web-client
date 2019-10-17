<template>
  <router-link class="logotype" :to="vueRoutes.app">
    <img :src="logoUrl" alt="INCLUSIVITY">
  </router-link>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'
import { SchemeRegistry } from '@/modules-arch/scheme-registry'

const DEFAULT_LOGO_URL = '/static/logo.png'

export default {
  data: _ => ({
    vueRoutes,
  }),

  computed: {
    logoUrl () {
      return SchemeRegistry.current.appLogoUrl || DEFAULT_LOGO_URL
    },
  },
}
</script>

<style lang="scss">
.logotype img {
  max-height: 4.5rem;
}
</style>
