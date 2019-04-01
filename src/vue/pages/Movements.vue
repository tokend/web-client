<template>
  <div class="movements">
    <template v-if="getModule().canRenderSubmodule(MovementsTopBarModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(MovementsTopBarModule)"
        :wallet="wallet"
        :config="movementsTopBarConfig"
        @asset-updated="updateAsset"
      />
    </template>

    <template v-if="getModule().canRenderSubmodule(MovementsTopBarReitModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(MovementsTopBarReitModule)"
        :wallet="wallet"
        :config="movementsTopBarReitConfig"
        @asset-updated="updateAsset"
        @withdrawn="withdrawalFiatModuleWithdrawn"
        @deposited="depositFiatModuleDeposited"
        @redeemed="redeemModuleSubmitted"
      />
    </template>

    <template v-if="getModule().canRenderSubmodule(MovementsHistoryModule)">
      <submodule-importer
        v-if="asset.code"
        :submodule="getModule().getSubmodule(MovementsHistoryModule)"
        :asset-code="asset.code"
        :wallet="wallet"
        :config="movementsHistoryConfig"
        :key="`movements-history-state-${historyState}`"
      >
        <loader
          slot="loader"
          message-id="op-pages.assets-loading-msg"
        />
      </submodule-importer>

      <no-data-message
        v-else-if="isLoadFailed"
        icon-name="trending-up"
        :title="'op-pages.no-data-title' | globalize"
        :message="'op-pages.no-data-msg' | globalize"
      />

      <loader
        v-else
        message-id="op-pages.assets-loading-msg"
      />
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'

import config from '@/config'
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsTopBarModule } from '@modules/movements-top-bar/module'
import { MovementsTopBarReitModule } from '@modules/movements-top-bar-reit/module'

export default {
  name: 'movements-page',
  components: {
    Loader,
    NoDataMessage,
    SubmoduleImporter,
  },

  data: _ => ({
    MovementsHistoryModule,
    MovementsTopBarModule,
    MovementsTopBarReitModule,
    asset: {},
    isLoadFailed: false,
    movementsHistoryConfig: {
      horizonURL: config.HORIZON_SERVER,
    },
    movementsTopBarConfig: {
      horizonURL: config.HORIZON_SERVER,
    },
    movementsTopBarReitConfig: {
      horizonURL: config.HORIZON_SERVER,
      minAmount: config.MIN_AMOUNT,
      maxAmount: config.MAX_AMOUNT,
      decimalPoints: config.DECIMAL_POINTS,
    },
    historyState: 0,
  }),

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },

  methods: {
    updateAsset (asset) {
      this.asset = asset
    },

    withdrawalFiatModuleWithdrawn () {
      this.historyState++
    },

    depositFiatModuleDeposited () {
      this.historyState++
    },
    redeemModuleSubmitted () {
      this.historyState++
    },
  },
}
</script>

<style lang="scss">
</style>
