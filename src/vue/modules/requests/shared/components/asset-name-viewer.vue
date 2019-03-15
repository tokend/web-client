<template>
  <div class="asset-name-viewer">
    <asset-logo-viewer
      class="asset-name-viewer__logo"
      :asset-code="request.assetCode"
      :logo-url="request.logoUrl(config.storageURL)"
    />

    <div class="asset-name-viewer__info">
      <p class="asset-name-viewer__code">
        {{ request.assetCode }}
      </p>
      <p class="asset-name-viewer__name">
        {{ request.assetName }}
      </p>
    </div>
  </div>
</template>

<script>
import AssetLogoViewer from '../../shared/components/asset-logo-viewer'

export default {
  name: 'asset-name-viwer',
  components: {
    AssetLogoViewer,
  },

  props: {
    config: { type: Object, required: true },
    request: { type: Object, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.asset-name-viewer {
  display: flex;
  align-items: center;

  .asset-name-viewer__logo {
    width: 5rem;
    height: 5rem;
    border-radius: 50%
  }

  .asset-name-viewer__info {
    margin-left: 1.8rem;

    .asset-name-viewer__code {
      font-size: 1.8rem;
      font-weight: bold;
      color: $col-primary;
    }

    .asset-name-viewer__name {
      margin-top: .1rem;
      font-size: 1.4rem;
      line-height: 1.29;
      color: $col-primary;
    }
  }
}
</style>
