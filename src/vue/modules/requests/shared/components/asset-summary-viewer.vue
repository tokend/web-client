<template>
  <div class="asset-summary-viewer">
    <asset-logo-viewer
      class="asset-summary-viewer__logo"
      :asset-code="asset.code || request.assetCode"
      :logo-url="assetLogoUrl"
    />

    <div class="asset-summary-viewer__info">
      <p class="asset-summary-viewer__code">
        {{ asset.code || request.assetCode }}
      </p>
      <p class="asset-summary-viewer__name">
        {{ asset.name || request.assetName }}
      </p>
    </div>
  </div>
</template>

<script>
import AssetLogoViewer from '../../shared/components/asset-logo-viewer'

export default {
  name: 'asset-summary-viewer',
  components: {
    AssetLogoViewer,
  },

  props: {
    config: { type: Object, required: true },
    request: { type: Object, default: _ => ({}) },
    asset: { type: Object, default: _ => ({}) },
  },

  computed: {
    assetLogoUrl () {
      const asset = this.asset.logoUrl ? this.asset : this.request
      return asset.logoUrl(this.config.storageURL)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.asset-summary-viewer {
  display: flex;
  align-items: center;

  .asset-summary-viewer__logo {
    width: 5rem;
    height: 5rem;
    border-radius: 50%
  }

  .asset-summary-viewer__info {
    margin-left: 1.8rem;

    .asset-summary-viewer__code {
      font-size: 1.8rem;
      font-weight: bold;
      color: $col-primary;
    }

    .asset-summary-viewer__name {
      margin-top: .1rem;
      font-size: 1.4rem;
      line-height: 1.29;
      color: $col-primary;
    }
  }
}
</style>
