<template>
  <router-link class="logotype" :to="vueRoutes.app">
    <img :src="logoUrl" alt="Conto">
  </router-link>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'
// import { SchemeRegistry } from '@/modules-arch/scheme-registry'

const DEFAULT_LOGO_URL = '/static/conto-logo.png'

export default {
  data: _ => ({
    vueRoutes,
  }),

  computed: {
    logoUrl () {
      return DEFAULT_LOGO_URL
    },
  },
}
</script>

<style lang="scss">
.logotype img {
  max-height: 4.5rem;
  height: inherit;
  width: inherit;
  margin-left: -1.1rem;
}
</style>
