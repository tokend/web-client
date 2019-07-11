<template>
  <div class="register-of-shares">
    <template
      v-if="getModule().canRenderSubmodule(MovementsTopBarModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(MovementsTopBarModule)"
        @asset-updated="updateAsset"
        @movements-update-required="updateList"
      />
    </template>

    <template v-if="getModule().canRenderSubmodule(MovementsHistoryModule)">
      <submodule-importer
        v-if="asset.code"
        :submodule="getModule().getSubmodule(MovementsHistoryModule)"
        :asset-code="asset.code"
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
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'

import { MovementsTopBarModule } from '@modules/movements-top-bar/module'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'

export default {
  name: 'register-of-shares-page',
  components: {
    SubmoduleImporter,
    NoDataMessage,
    Loader,
  },

  data: _ => ({
    MovementsTopBarModule,
    MovementsHistoryModule,
    asset: {},
    historyState: 0,
    isLoadFailed: false,
  }),

  methods: {
    updateAsset (asset) {
      this.asset = asset
    },

    // MovementsHistoryModule uses these 3 methods below
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
