<template>
  <div class="sale-overview-details app__table">
    <table>
      <tbody>
        <tr>
          <td>
            {{ 'sale-overview.start-time-title' | globalize }}
          </td>
          <td>
            {{ sale.startTime | formatCalendar }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'sale-overview.close-time-title' | globalize }}
          </td>
          <td>
            {{ sale.endTime | formatCalendar }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'sale-overview.soft-cap-title' | globalize }}
          </td>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ { value: sale.softCap, currency: sale.defaultQuoteAsset } | formatMoney }}
          </td>
        </tr>

        <tr>
          <td>
            {{ 'sale-overview.hard-cap-title' | globalize }}
          </td>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ { value: sale.hardCap, currency: sale.defaultQuoteAsset } | formatMoney }}
          </td>
        </tr>

        <tr>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ 'sale-overview.asset-to-sell-title' | globalize({ asset: sale.baseAsset }) }}
          </td>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ { value: sale.baseHardCap, currency: sale.baseAsset } | formatMoney }}
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
import { SaleRecord } from '@/js/records/entities/sale.record'

export default {
  name: 'sale-overview-details',

  props: {
    sale: { type: SaleRecord, required: true },
  },
}
</script>

<style lang="scss" scoped>
.sale-overview-details {
  tr td:last-child {
    text-align: right;
  }
}

.sale-overview-details__video-btn {
  color: $col-link;
  text-decoration: none;

  &:visited {
    color: $col-link;
  }
}
</style>
