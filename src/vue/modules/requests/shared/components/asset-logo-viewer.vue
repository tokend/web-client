<template>
  <img
    v-if="assetLogoUrl"
    class="asset-logo-viewer asset-logo-viewer__image"
    :src="assetLogoUrl"
  >
  <p
    v-else
    class="asset-logo-viewer asset-logo-viewer__code-abbr"
  >
    {{ abbreviate(assetCode) }}
  </p>
</template>

<script>
import { abbreviate } from '@/js/helpers/abbreviate'

export default {
  name: 'asset-logo-viewer',
  props: {
    assetLogoUrl: { type: String, default: '' },
    assetCode: { type: String, required: true },
  },
  setup () {
    return {
      abbreviate,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.asset-logo-viewer {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
}

.asset-logo-viewer__image {
  display: block;
}

.asset-logo-viewer__code-abbr {
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-asset-logo-background;
  color: $col-asset-logo-text;
  line-height: 1;
}
</style>
