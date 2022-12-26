<template>
  <img
    v-if="logoUrl"
    class="asset-logo asset-logo__image"
    :src="logoUrl"
  >
  <p
    v-else
    class="asset-logo asset-logo__code-abbr"
  >
    {{ abbreviate(assetCode) }}
  </p>
</template>

<script>
import { abbreviate } from '@/js/helpers/abbreviate'

export default {
  name: 'asset-logo',
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
  line-height: 1;
}
</style>
