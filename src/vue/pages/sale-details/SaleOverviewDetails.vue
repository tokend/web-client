<template>
  <div class="sale-overview-details app__table">
    <table>
      <tbody>
        <tr>
          <td>
            {{ 'sale-overview.type-title' | globalize }}
          </td>
          <td>
            {{ localizedSaleTypes[sale.saleType] | globalize }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'sale-overview.start-time-title' | globalize }}
          </td>
          <td>
            {{ formatCalendar(sale.startTime) }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'sale-overview.close-time-title' | globalize }}
          </td>
          <td>
            {{ formatCalendar(sale.endTime) }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'sale-overview.soft-cap-title' | globalize }}
          </td>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ formatMoney({ value: sale.softCap, currency: sale.defaultQuoteAsset }) }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'sale-overview.hard-cap-title' | globalize }}
          </td>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ formatMoney({ value: sale.hardCap, currency: sale.defaultQuoteAsset }) }}
          </td>
        </tr>

        <tr>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ 'sale-overview.asset-to-sell-title' | globalize({ asset: sale.baseAsset }) }}
          </td>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ formatMoney({ value: sale.baseHardCap, currency: sale.baseAsset }) }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'sale-overview.whitelisted-title' | globalize }}
          </td>
          <td>
            <template v-if="sale.isWhitelisted">
              {{ 'sale-overview.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'sale-overview.no-msg' | globalize }}
            </template>
          </td>
        </tr>

        <tr>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ 'sale-overview.owner-lbl' | globalize({ asset: sale.baseAsset }) }}
          </td>
          <td>
            <email-getter
              right-side
              :account-id="sale.owner"
            />
          </td>
        </tr>

        <tr>
          <td>
            {{ 'sale-overview.video-about-sale-title' | globalize }}
          </td>
          <td>
            <a
              v-if="sale.youtubeVideoUrl"
              class="sale-overview-details__video-btn"
              :href="sale.youtubeVideoUrl"
              target="_blank"
            >
              {{ 'sale-overview.view-video-btn' | globalize }}
            </a>

            <p v-else>
              {{ 'sale-overview.no-video-msg' | globalize }}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { SALE_TYPES } from '@tokend/js-sdk'
import { SaleRecord } from '@/js/records/entities/sale.record'
import { formatMoney } from '@/js/helpers/money-helper'
import { formatCalendar } from '@/js/helpers/date-helpers'
import EmailGetter from '@/vue/common/EmailGetter'

export default {
  name: 'sale-overview-details',
  components: {
    EmailGetter,
  },
  props: {
    sale: { type: SaleRecord, required: true },
  },
  computed: {
    localizedSaleTypes () {
      const keyValue = {}
      keyValue[SALE_TYPES.fixedPrice] = 'sale-overview.fixed-price'
      keyValue[SALE_TYPES.immediate] = 'sale-overview.immediate'
      return keyValue
    },
  },
  setup () {
    return {
      formatMoney,
      formatCalendar,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.sale-overview-details tr td:last-child {
  text-align: right;
}

.sale-overview-details__video-btn {
  color: $col-link;
  text-decoration: none;

  &:visited {
    color: $col-link;
  }
}
</style>
