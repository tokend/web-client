<template>
  <div class="fund-short-details">
    <template v-if="isLoaded">
      <div class="fund-short-details__asset">
        <asset-logo
          :asset-code="asset.code"
          :logo-url="asset.logoUrl(config.FILE_STORAGE)"
        />
        <div class="fund-short-details__asset-info">
          <p class="fund-short-details__asset-code">
            {{ asset.code }}
          </p>
          <p class="fund-short-details__asset-name">
            {{ asset.name }}
          </p>
        </div>
      </div>

      <p class="fund-short-details__short-description">
        {{ fund.shortDescription }}
      </p>

      <div class="app__table fund-short-details__table">
        <table>
          <tbody>
            <tr>
              <td>
                {{ 'fund-short-details.name-title' | globalize }}
              </td>
              <td>
                {{ fund.name }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'fund-short-details.start-time-title' | globalize }}
              </td>
              <td>
                {{ fund.startTime | formatCalendar }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'fund-short-details.close-time-title' | globalize }}
              </td>
              <td>
                {{ fund.endTime | formatCalendar }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'fund-short-details.soft-cap-title' | globalize }}
              </td>
              <td>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: fund.softCap, currency: fund.defaultQuoteAsset } | formatMoney }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'fund-short-details.hard-cap-title' | globalize }}
              </td>
              <td>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: fund.hardCap, currency: fund.defaultQuoteAsset } | formatMoney }}
              </td>
            </tr>

            <tr>
              <td>
                <!-- eslint-disable-next-line max-len -->
                {{ 'fund-short-details.asset-to-sell-title' | globalize({ asset: fund.baseAsset }) }}
              </td>
              <td>
                <!-- eslint-disable-next-line max-len -->
                {{ { value: fund.baseHardCap, currency: fund.baseAsset } | formatMoney }}
              </td>
            </tr>

            <tr>
              <td>
                {{ 'fund-short-details.video-about-fund-title' | globalize }}
              </td>
              <td>
                <a
                  v-if="fund.youtubeVideoUrl"
                  class="fund-short-details__video-btn"
                  :href="fund.youtubeVideoUrl"
                  target="_blank"
                >
                  {{ 'fund-short-details.view-video-btn' | globalize }}
                </a>
                <p v-else>
                  {{ 'fund-short-details.no-video-msg' | globalize }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        v-ripple
        class="fund-short-details__view-btn"
        @click="viewFund"
      >
        {{ 'fund-short-details.view-btn' | globalize }}
      </button>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader :message-id="'fund-short-details.loading-msg'" />
    </template>

    <template v-else>
      <p>
        {{ 'fund-short-details.loading-error-msg' | globalize }}
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
  name: 'fund-short-details',
  components: {
    AssetLogo,
    Loader,
  },
  props: {
    fund: {
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
      const { data } = await Sdk.horizon.assets.get(this.fund.baseAsset)
      this.asset = new AssetRecord(data)
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },
  methods: {
    viewFund () {
      // TODO: add the fund details route when fund details component
      // is added.
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.fund-short-details__short-description {
  margin-top: 4rem;
  font-size: 1.4rem;
  color: $col-text;
}

.fund-short-details__table {
  margin-top: 2rem;

  tr td:last-child {
    text-align: right;
  }
}

.fund-short-details__view-btn {
  @include button-raised();

  margin-top: 4.9rem;
  max-width: 14.4rem;
  width: 100%;
}

.fund-short-details__video-btn {
  color: $col-link;
  text-decoration: none;

  &:visited {
    color: $col-link;
  }
}

.fund-short-details__asset {
  display: flex;
  align-items: center;

  .fund-short-details__asset-logo {
    width: 5rem;
    height: 5rem;
    border-radius: 50%
  }

  .fund-short-details__asset-info {
    margin-left: 1.8rem;

    .fund-short-details__asset-code {
      font-size: 1.8rem;
      font-weight: bold;
      color: $col-text;
    }

    .fund-short-details__asset-name {
      margin-top: .1rem;
      font-size: 1.4rem;
      line-height: 1.29;
      color: $col-text;
    }
  }
}
</style>
