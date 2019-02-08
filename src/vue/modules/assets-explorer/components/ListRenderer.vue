<template>
  <div class="asset-list-renderer">
    <drawer :is-shown.sync="isDetailsDrawerShown">
      <template slot="heading">
        {{ 'asset-details.title' | globalize }}
      </template>
      <asset-details :asset="selectedAsset" />
    </drawer>
    <div class="asset-list-renderer__asset-cards">
      <asset-card
        v-for="asset in assets"
        :asset="asset"
        :key="asset.code"
        @click.native="selectAsset(asset)"
      />
    </div>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'

import AssetDetails from './AssetDetails'
import AssetCard from './AssetCard'

export default {
  name: 'asset-list-renderer',
  components: {
    Drawer,
    AssetCard,
    AssetDetails,
  },
  props: {
    assets: { type: Array, default: _ => [] },
  },
  data: _ => ({
    isDetailsDrawerShown: false,
    selectedAsset: null,
  }),
  methods: {
    selectAsset (asset) {
      this.selectedAsset = asset
      this.isDetailsDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>

.asset-list-renderer__asset-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: -.75rem;
}
</style>
