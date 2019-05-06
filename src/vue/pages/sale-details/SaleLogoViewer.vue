<template>
  <div class="sale-logo-viewer">
    <img
      class="sale-logo-viewer__img"
      :src="sale.logoUrl(config.FILE_STORAGE)"
    >
  </div>
</template>

<script>
import { SaleRecord } from '@/js/records/entities/sale.record'

import config from '@/config'

export default {
  name: 'sale-logo-viewer',

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    config,
  }),
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.sale-logo-viewer {
  background-color: $col-sale-details-logo-bg;
  position: relative;
  height: 36rem;
  width: 100%;

  @include respond-to($x-medium) {
    height: 24rem;
  }
}

.sale-logo-viewer__img {
  position: absolute;
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
