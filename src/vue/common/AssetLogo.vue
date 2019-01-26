<template>
  <img
    v-if="logoKey"
    class="asset-logo asset-logo__image"
    :src="assetLogoUrl"
  >
  <p
    v-else
    class="asset-logo asset-logo__code-abbr"
  >
    {{ assetCode | abbreviate }}
  </p>
</template>

<script>
import config from '@/config'

export default {
  name: 'asset-logo',
  props: {
    logoKey: { type: String, default: '' },
    assetCode: { type: String, required: true },
  },
  computed: {
    assetLogoUrl () {
      return `${config.FILE_STORAGE}/${this.logoKey}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.asset-logo {
  width: 5.3rem;
  height: 5.3rem;
  border-radius: 50%;
}

.asset-logo__image {
  display: block;
}

.asset-logo__code-abbr {
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-asset-logo-background;
  color: $col-asset-logo-text;
}
</style>
