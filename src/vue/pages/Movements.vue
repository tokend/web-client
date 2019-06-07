<template>
  <div class="movements">
    <template v-if="getModule().canRenderSubmodule(MovementsTopBarModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(MovementsTopBarModule)"
        @asset-updated="updateAsset"
        @movements-update-required="updateList"
      />
    </template>

    <template v-if="getModule().canRenderSubmodule(MovementsTopBarReitModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(MovementsTopBarReitModule)"
        :config="movementsTopBarReitConfig"
        @asset-updated="updateAsset"
        @withdrawn="withdrawalFiatModuleWithdrawn"
        @deposited="depositFiatModuleDeposited"
        @redeemed="redeemModuleSubmitted"
      />
    </template>

    <template v-if="getModule().canRenderSubmodule(MovementsHistoryModule)">
      <submodule-importer
        v-if="true"
        :submodule="getModule().getSubmodule(MovementsHistoryModule)"
        :asset-code="asset.code"
        :key="`movements-history-state-${historyState}`"
      />

      <no-data-message
        v-else-if="isLoadFailed"
        icon-name="trending-up"
        :title="'op-pages.no-data-title' | globalize"
        :message="'op-pages.no-data-msg' | globalize"
      />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'

import config from '@/config'
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsTopBarModule } from '@modules/movements-top-bar/module'
import { MovementsTopBarReitModule } from '@modules/movements-top-bar-reit/module'

export default {
  name: 'movements-page',
  components: {
    NoDataMessage,
    SubmoduleImporter,
  },

  data: _ => ({
    MovementsHistoryModule,
    MovementsTopBarModule,
    MovementsTopBarReitModule,
    asset: {},
    isLoadFailed: false,
    movementsTopBarReitConfig: {
      horizonURL: config.HORIZON_SERVER,
      minAmount: config.MIN_AMOUNT,
      maxAmount: config.MAX_AMOUNT,
      decimalPoints: config.DECIMAL_POINTS,
    },
    historyState: 0,
  }),

  methods: {
    updateAsset (asset) {
      this.asset = asset
    },

    withdrawalFiatModuleWithdrawn () {
      this.updateList()
    },

    depositFiatModuleDeposited () {
      this.updateList()
    },

    redeemModuleSubmitted () {
      this.updateList()
    },

    updateList () {
      this.historyState++
    },
  },
}
</script>

<style lang="scss">
</style>
