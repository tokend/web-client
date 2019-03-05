<template>
  <div class="terms-viewer">
    <a
      v-if="href"
      :href="href"
      class="terms-viewer__link"
    >
      {{ 'asset-explorer.download-terms-btn' | globalize }}
    </a>
    <p v-else>
      {{ 'asset-explorer.no-terms-msg' | globalize }}
    </p>
  </div>
</template>

<script>
import { Asset } from '../wrappers/asset'

export default {
  name: 'terms-viewer',
  props: {
    asset: {
      type: Asset,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    href () {
      return this.asset.termsUrl(this.config.storageURL)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.terms-viewer__link {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}
</style>
