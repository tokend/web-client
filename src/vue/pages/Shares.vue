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

    <movements-history-module
      v-if="asset.code"
      :asset-code="asset.code"
      :key="`movements-history-state-${historyState}`"
    />

    <no-data-message
      v-else-if="!asset.code"
      icon-name="trending-up"
      :title="'op-pages.no-data-title' | globalize"
      :message="'op-pages.no-data-msg' | globalize"
    />

    <loader
      v-else
      message-id="op-pages.assets-loading-msg"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import Loader from '@/vue/common/Loader'

import { MovementsTopBarModule } from '@modules/movements-top-bar/module'
import MovementsHistoryModule from '@/vue/modules/movements-history/index'

export default {
  name: 'register-of-shares-page',
  components: {
    SubmoduleImporter,
    NoDataMessage,
    Loader,
    MovementsHistoryModule,
  },

  data: _ => ({
    MovementsTopBarModule,
    asset: {},
    historyState: 0,
  }),

  methods: {
    updateAsset (asset) {
      this.asset = asset
    },

    updateList () {
      this.historyState++
    },
  },
}
</script>
