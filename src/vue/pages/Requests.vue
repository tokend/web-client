<template>
  <div>
    <top-bar>
      <template slot="main">
        <router-link
          v-if="getModule().canRenderSubmodule(AssetCreationRequestsPageModule)"
          :to="vueRoutes.assetCreationRequests"
        >
          <span>{{ 'requests-page.asset-creation-title' | globalize }}</span>
        </router-link>

        <!-- eslint-disable max-len -->
        <router-link
          v-if="getModule().canRenderSubmodule(IncomingWithdrawalRequestsPageModule)"
          :to="vueRoutes.incomingWithdrawalRequests"
        >
          <span>
            {{ 'requests-page.incoming-withdrawal-title' | globalize }}
          </span>
        </router-link>
        <!-- eslint-enable max-len -->
      </template>
    </top-bar>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'

import { vueRoutes } from '@/vue-router/routes'

import { AssetCreationRequestsPageModule } from '@/vue/pages/asset-creation-requests-page'
import { AssetUpdateRequestsPageModule } from '@/vue/pages/asset-update-requests-page'
import { SaleCreationRequestsPageModule } from '@/vue/pages/sale-creation-requests-page'
import { PreIssuanceRequestsPageModule } from '@/vue/pages/pre-issuance-requests-page'
import { IncomingWithdrawalRequestsPageModule } from '@/vue/pages/incoming-withdrawal-requests-page'

export default {
  name: 'requests',
  components: {
    TopBar,
  },
  data: _ => ({
    vueRoutes,
    AssetCreationRequestsPageModule,
    AssetUpdateRequestsPageModule,
    SaleCreationRequestsPageModule,
    PreIssuanceRequestsPageModule,
    IncomingWithdrawalRequestsPageModule,
  }),
}
</script>

<style lang="scss" scoped>
</style>
