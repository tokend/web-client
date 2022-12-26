<template>
  <div class="sale-overview">
    <template v-if="isLoaded">
      <div class="sale-overview__asset">
        <asset-logo
          :asset-code="asset.code"
          :logo-url="assetLogoUrl"
        />
        <div class="sale-overview__asset-info">
          <p class="sale-overview__asset-code">
            {{ asset.code }}
          </p>
          <p class="sale-overview__asset-name">
            {{ asset.name }}
          </p>
        </div>
      </div>

      <p class="sale-overview__short-description">
        {{ sale.shortDescription }}
      </p>

      <div class="app__table sale-overview__table">
        <table>
          <tbody>
            <tr>
              <td>
                {{ 'sale-overview.name-title' | globalize }}
              </td>
              <td>
                {{ sale.name }}
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
import AssetLogo from '@/vue/common/assets/AssetLogo'
import Loader from '@/vue/common/Loader'

import { documentsManager } from '@/api'
import config from '@/config'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { formatMoney } from '@/js/helpers/money-helper'
import { formatCalendar } from '@/js/helpers/date-helpers'

export default {
  name: 'sale-overview',
  components: {
    AssetLogo,
    Loader,
  },
  props: {
    sale: {
      type: SaleRecord,
      required: true,
    },
  },
  data: _ => ({
    config,
    isLoaded: false,
    isLoadingFailed: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.assets,
    ]),
    assetLogoUrl () {
      return documentsManager.getDocumentUrlByKey(this.asset.logoKey)
    },
    asset () {
      return this.assets.find(item => item.code === this.sale.baseAsset) || {}
    },
  },
  async created () {
    try {
      await this.loadAssets()
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },
  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),
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

.sale-overview__short-description {
  margin-top: 4rem;
  font-size: 1.4rem;
  color: $col-text;
}

.sale-overview__table {
  margin-top: 2rem;
}

.sale-overview__table tr td:last-child {
  text-align: right;
}

.sale-overview__video-btn {
  color: $col-link;
  text-decoration: none;

  &:visited {
    color: $col-link;
  }
}

.sale-overview__asset {
  display: flex;
  align-items: center;
}

.sale-overview__asset-logo {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
}

.sale-overview__asset-info {
  margin-left: 1.8rem;
}

.sale-overview__asset-code {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-text;
}

.sale-overview__asset-name {
  margin-top: 0.1rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-text;
}
</style>
