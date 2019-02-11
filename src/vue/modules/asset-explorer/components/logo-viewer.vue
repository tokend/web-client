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
import { Asset } from '../wrappers/asset'
import { config } from '@/vue/modules/asset-explorer/_config'

export default {
  name: 'asset-logo',
  props: {
    asset: {
      type: Asset,
      required: true,
    },
  },
  computed: {
    url () {
      return this.asset.logoUrl(config().storageURL)
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
