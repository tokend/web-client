<template>
  <div class="movements">
    <template v-if="getModule().canRenderSubmodule(MovementsTopBarModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(MovementsTopBarModule)"
        @asset-updated="updateAsset"
        @movements-update-required="emitUpdateList('movements:updateList')"
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

import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { MovementsTopBarModule } from '@modules/movements-top-bar/module'
import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'movements-page',
  components: {
    NoDataMessage,
    SubmoduleImporter,
  },

  mixins: [UpdateList],

  data: _ => ({
    MovementsHistoryModule,
    MovementsTopBarModule,
    asset: {},
    isLoadFailed: false,
    historyState: 0,
  }),

  created () {
    this.listenUpdateList('movements:updateList', this.updateMovementsHistoryList)
  },

  beforeDestroy () {
    this.resetUpdateListEvent('movements:updateList')
  },

  methods: {
    updateAsset (asset) {
      this.asset = asset
    },

    updateMovementsHistoryList () {
      this.historyState++
    },
  },
}
</script>

<style lang="scss">
</style>
