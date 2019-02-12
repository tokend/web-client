<template>
  <div class="card-list-renderer">
    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'asset-explorer.drawer-title' | globalize }}
      </template>
      <asset-attributes-viewer :asset="selectedAsset" />
    </drawer>
    <div class="card-list-renderer__inner">
      <template v-for="asset in assets">
        <card-viewer
          :asset="asset"
          :key="asset.code"
          @click="selectAsset(asset)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'

import AssetAttributesViewer from './asset-attributes-viewer'
import CardViewer from './card-viewer'

export default {
  name: 'card-list-renderer',
  components: {
    Drawer,
    CardViewer,
    AssetAttributesViewer,
  },
  props: {
    assets: { type: Array, default: _ => [] },
  },
  data: _ => ({
    isDrawerShown: false,
    selectedAsset: null,
  }),
  methods: {
    selectAsset (asset) {
      this.selectedAsset = asset
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
.card-list-renderer__inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -.75rem;
}
</style>
