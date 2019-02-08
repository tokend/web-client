<template>
  <img
    v-if="url"
    :src="url"
    class="logo-viewer logo-viewer--image"
  >
  <p class="logo-viewer logo-viewer--abbr" v-else>
    {{ asset.code | abbreviate }}
  </p>
</template>

<script>
import { AssetRecord } from '../asset-record'

const fileStorageUrl = 'http://black.hole' // TODO: provide from the top

export default {
  name: 'asset-logo',
  props: {
    asset: {
      type: AssetRecord,
      required: true,
    },
  },
  computed: {
    url () {
      if (!this.asset.logoKey) {
        return ''
      }

      return this.asset.logoUrl(fileStorageUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.logo-viewer {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;

  &--image {
    display: block;
  }

  &--abbr {
    font-size: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $col-asset-logo-background;
    color: $col-asset-logo-text;
  }
}
</style>
