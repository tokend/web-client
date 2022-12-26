<template>
  <img
    v-if="url"
    :src="url"
    class="logo-viewer logo-viewer--image"
  >
  <p
    v-else
    class="logo-viewer logo-viewer--abbr"
    :class="{ 'logo-viewer--dark' : darkMode }"
  >
    {{ abbreviate(asset.code) }}
  </p>
</template>

<script>
import { AssetRecord } from '@/js/records/entities/asset.record'

import { documentsManager } from '@/api'
import { abbreviate } from '@/js/helpers/abbreviate'

export default {
  name: 'logo-viewer',
  props: {
    asset: { type: AssetRecord, required: true },
    darkMode: { type: Boolean, default: false },
  },
  computed: {
    url () {
      return documentsManager.getDocumentUrlByKey(this.asset.logoKey)
    },
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

.logo-viewer {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;

  &--image {
    display: block;
    object-fit: contain;
  }

  &--abbr {
    font-size: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $col-asset-logo-background;
    color: $col-asset-logo-text;
  }

  &--dark {
    background: $col-asset-logo-dark-background;
    color: $col-asset-logo-dark-text;
  }
}
</style>
