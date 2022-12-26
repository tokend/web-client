<template>
  <img
    v-if="logoUrl"
    class="asset-logo-dark asset-logo-dark__image"
    :src="logoUrl"
  >
  <p
    v-else
    class="asset-logo-dark asset-logo-dark__code-abbr"
  >
    {{ abbreviate(assetCode) }}
  </p>
</template>

<script>
import { abbreviate } from '@/js/helpers/abbreviate'

export default {
  name: 'asset-logo-dark',
  props: {
    logoUrl: { type: String, required: true },
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

.asset-logo-dark {
  width: 5.3rem;
  height: 5.3rem;
}

.asset-logo-dark__image {
  display: block;
}

.asset-logo-dark__code-abbr {
  font-size: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $col-asset-logo-dark-background;
  color: $col-asset-logo-dark-text;
  line-height: 1;
}
</style>
