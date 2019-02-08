<template>
  <div class="terms-viewer">
    <a
      v-if="href"
      :href="href"
      class="terms-viewer__link"
    >
      {{ 'asset-details.download-terms-btn' | globalize }}
    </a>
    <p v-else>
      {{ 'asset-details.no-terms-msg' | globalize }}
    </p>
  </div>
</template>

<script>
import { AssetRecord } from '../asset-record'

const fileStorageUrl = 'http://black.hole' // TODO: provide from the top

export default {
  name: 'terms-viewer',
  props: {
    asset: {
      type: AssetRecord,
      required: true,
    },
  },
  computed: {
    href () {
      if (!this.asset.termsKey) {
        return ''
      }
      return this.asset.termsUrl(fileStorageUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.asset-details__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}
</style>
