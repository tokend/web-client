<template>
  <div class="sale-overview">
    <template v-if="isLoaded">
      <div class="sale-overview__asset">
        <h3 class="sale-overview__asset-title">
          {{ 'sale-overview.asset-title' | globalize }}
        </h3>

        <asset-details
          class="sale-overview__asset-details"
          :asset="asset"
          :show-actions="false"
        />
      </div>

      <div class="sale-overview__details">
        <h3 class="sale-overview__details-title">
          {{ 'sale-overview.details-title' | globalize }}
        </h3>

        <div class="app__table sale-overview__table">
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
                    class="sale-overview__video-btn"
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
      </div>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader :message-id="'sale-overview.loading-msg'" />
    </template>

    <template v-else>
      <p>
        {{ 'sale-overview.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import AssetDetails from '@/vue/pages/assets/AssetDetails'
import Loader from '@/vue/common/Loader'

import { Sdk } from '@/sdk'
import config from '@/config'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { SaleRecord } from '@/js/records/entities/sale.record'
import { AssetRecord } from '@/js/records/entities/asset.record'

export default {
  name: 'sale-overview',
  components: {
    AssetDetails,
    Loader,
  },
  props: {
    sale: {
      type: SaleRecord,
      required: true,
    },
  },
  data: _ => ({
    asset: {},
    config,
    isLoaded: false,
    isLoadingFailed: false,
  }),
  async created () {
    try {
      const { data } = await Sdk.horizon.assets.get(this.sale.baseAsset)
      this.asset = new AssetRecord(data)
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.sale-overview__asset-details {
  margin-top: 2rem;
}

.sale-overview__details {
  margin-top: 3.2rem;
}

.sale-overview__table {
  margin-top: 2rem;

  tr td:last-child {
    text-align: right;
  }
}

.sale-overview__video-btn {
  color: $col-link;
  text-decoration: none;

  &:visited {
    color: $col-link;
  }
}
</style>
