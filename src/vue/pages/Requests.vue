<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.assetCreationRequests">
          <span>{{ 'requests-page.asset-creation-title' | globalize }}</span>
        </router-link>

        <router-link :to="vueRoutes.assetUpdateRequests">
          <span>{{ 'requests-page.asset-update-title' | globalize }}</span>
        </router-link>

        <router-link :to="vueRoutes.saleCreationRequests">
          <span>{{ 'requests-page.sale-creation-title' | globalize }}</span>
        </router-link>

        <router-link :to="vueRoutes.preIssuanceUploadRequests">
          <span>
            {{ 'requests-page.pre-issuance-upload-title' | globalize }}
          </span>
        </router-link>

        <router-link :to="vueRoutes.incomingWithdrawalRequests">
          <span>
            {{ 'requests-page.incoming-withdrawal-title' | globalize }}
          </span>
        </router-link>
      </template>
    </top-bar>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'

import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'requests',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
  }),
}
</script>

<style lang="scss" scoped>
</style>
