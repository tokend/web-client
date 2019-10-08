<template>
  <router-link class="logotype" :to="logoRout">
    <img
      v-if="isLoggedIn"
      :src="yellowLogoUrl"
      class="logo"
      alt="UNIT city">
    <img
      v-else
      :src="blackLogoUrl"
      class="logo"
      alt="UNIT city">
  </router-link>
</template>

<script>
import { vueRoutes } from '@/vue-router/routes'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

const DEFAULT_LOGO_URL = '/static/logo-yellow.svg'
const BLACK_LOGO_URL = '/static/logo-black.svg'

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
      vuexTypes.isLoggedIn,
    ]),
    yellowLogoUrl () {
      return DEFAULT_LOGO_URL
    },
    blackLogoUrl () {
      return BLACK_LOGO_URL
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
  height: 2rem;
}
</style>
