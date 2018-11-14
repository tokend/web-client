<template>
  <div class="crowdfund-sale">
    <div class="crowdfund-sale-main">
      <div class="details-column md-layout-item">
        <detail-row
          :prop="i18n.sale_state()"
          :value="`${sale.state}`"
        />
        <detail-row
          :prop="i18n.sale_start_time()"
          :value="`${i18n.d(sale.startTime)}`"
        />
        <detail-row
          :prop="i18n.sale_close_time()"
          :value="`${i18n.d(sale.endTime)}`"
        />
        <detail-row
          :prop="i18n.sale_base_asset_for_hard_cap()"
          :value="`${sale.defaultQuoteAsset}`"
        />
        <detail-row
          :prop="i18n.sale_soft_cap()"
          :value="`${i18n.cc(sale.softCap)}`"
        />
        <detail-row
          :prop="i18n.sale_hard_cap()"
          :value="`${i18n.cc(sale.hardCap)}`"
        />
        <detail-row
          :prop="`${i18n.sale_base_asset_hard_cap_to_sell({
            asset:sale.baseAsset
          })}`"
          :value="`${i18n.c(sale.baseHardCap)}`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DetailRow from '../../../common/Detail.Row'
import { i18n } from 'L@/js/i18n'
export default {
  components: {
    DetailRow
  },
  props: {
    sale: { type: Object, default: () => { } }
  },
  data: _ => ({
    i18n
  }),
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
