<template>
  <div class="sale-short-details">
    <template v-if="isLoaded">
      <div class="sale-short-details__asset">
        <asset-logo
          :asset-code="asset.code"
          :logo-url="asset.logoUrl(config.FILE_STORAGE)"
        />
        <div class="sale-short-details__asset-info">
          <p class="sale-short-details__asset-code">
            {{ asset.code }}
          </p>
          <p class="sale-short-details__asset-name">
            {{ asset.name }}
          </p>
        </div>
      </div>

      <p class="sale-short-details__short-description">
        {{ sale.shortDescription }}
      </p>

      <div class="app__table sale-short-details__table">
        <table>
          <tbody>
            <tr>
              <td>
                {{ 'sale-short-details.name-title' | globalize }}
              </td>
              <td>
                {{ sale.name }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'sale-short-details.start-time-title' | globalize }}
              </td>
              <td>
                {{ sale.startTime | formatCalendar }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'sale-short-details.close-time-title' | globalize }}
              </td>
              <td>
                {{ sale.endTime | formatCalendar }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'sale-short-details.soft-cap-title' | globalize }}
              </td>
              <td>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: sale.softCap, currency: sale.defaultQuoteAsset } | formatMoney }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'sale-short-details.hard-cap-title' | globalize }}
              </td>
              <td>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: sale.hardCap, currency: sale.defaultQuoteAsset } | formatMoney }}
              </td>
            </tr>

            <tr>
              <td>
                <!-- eslint-disable-next-line max-len -->
                {{ 'sale-short-details.asset-to-sell-title' | globalize({ asset: sale.baseAsset }) }}
              </td>
              <td>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: sale.baseHardCap, currency: sale.baseAsset } | formatMoney }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'sale-short-details.video-about-sale-title' | globalize }}
              </td>
              <td>
                <a
                  v-if="sale.youtubeVideoUrl"
                  class="sale-short-details__video-btn"
                  :href="sale.youtubeVideoUrl"
                  target="_blank"
                >
                  {{ 'sale-short-details.view-video-btn' | globalize }}
                </a>
                <p v-else>
                  {{ 'sale-short-details.no-video-msg' | globalize }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        v-ripple
        class="sale-short-details__view-btn"
        @click="viewSale"
      >
        {{ 'sale-short-details.view-btn' | globalize }}
      </button>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader :message-id="'sale-short-details.loading-msg'" />
    </template>

    <template v-else>
      <p>
        {{ 'sale-short-details.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import AssetLogo from '@/vue/common/assets/AssetLogo'
import Loader from '@/vue/common/Loader'

import { Sdk } from '@/sdk'

import config from '@/config'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { SaleRecord } from '@/js/records/entities/sale.record'
import { AssetRecord } from '@/js/records/entities/asset.record'

export default {
  name: 'sale-short-details',
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
  methods: {
    viewSale () {
      // TODO: add the sale details route when sale details component
      // is added.
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.sale-short-details__short-description {
  margin-top: 4rem;
  font-size: 1.4rem;
  color: $col-text;
}

.sale-short-details__table {
  margin-top: 2rem;

  tr td:last-child {
    text-align: right;
  }
}

.sale-short-details__view-btn {
  @include button-raised();

  margin-top: 4.9rem;
  max-width: 14.4rem;
  width: 100%;
}

.sale-short-details__video-btn {
  color: $col-link;
  text-decoration: none;

  &:visited {
    color: $col-link;
  }
}

.sale-short-details__asset {
  display: flex;
  align-items: center;

  .sale-short-details__asset-logo {
    width: 5rem;
    height: 5rem;
    border-radius: 50%
  }

  .sale-short-details__asset-info {
    margin-left: 1.8rem;

    .sale-short-details__asset-code {
      font-size: 1.8rem;
      font-weight: bold;
      color: $col-text;
    }

    .sale-short-details__asset-name {
      margin-top: .1rem;
      font-size: 1.4rem;
      line-height: 1.29;
      color: $col-text;
    }
  }
}
</style>
