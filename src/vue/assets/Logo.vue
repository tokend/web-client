<template>
  <router-link class="logotype" :to="logoRout">
    <img :src="logoUrl" alt="Conto">
  </router-link>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
// import { SchemeRegistry } from '@/modules-arch/scheme-registry'

const DEFAULT_LOGO_URL = '/static/conto-logo.png'

export default {
  data: _ => ({
    vueRoutes,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
      vuexTypes.isAccountGeneral,
      vuexTypes.isBusinessToBrowse,
      vuexTypes.isCustomerUiShown,
    ]),
    logoUrl () {
      return DEFAULT_LOGO_URL
    },
    logoRout () {
      if (this.isAccountCorporate && !this.isCustomerUiShown) {
        return vueRoutes.customers
      }
      return this.isBusinessToBrowse
        ? vueRoutes.assetsExplore
        : vueRoutes.businesses
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
