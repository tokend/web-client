<template>
  <img
    v-if="asset.logoKey"
    class="asset-logo asset-logo__image"
    :src="asset.logoUrl(config.FILE_STORAGE)"
  >
  <p
    v-else
    class="asset-logo asset-logo__code-abbr"
  >
    {{ asset.code | abbreviate }}
  </p>
</template>

<script>
import config from '@/config'

export default {
  name: 'asset-logo',
  props: {
    asset: { type: Object, required: true },
  },
  data: _ => ({
    config,
  }),
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
