<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.verification">
          <span>{{ verificationTabId | globalize }}</span>
        </router-link>
        <router-link :to="vueRoutes.security">
          <span>{{ 'settings-page.security-tab' | globalize }}</span>
        </router-link>
      </template>
    </top-bar>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'

import { vueRoutes } from '@/vue-router/routes'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'settings',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
  }),
  computed: {
    ...mapGetters({
      kycRequest: vuexTypes.kycRequest,
    }),
    verificationTabId () {
      if (this.kycRequest.isApproved) {
        return 'settings-page.my-account-tab'
      } else {
        return 'settings-page.verification-tab'
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
