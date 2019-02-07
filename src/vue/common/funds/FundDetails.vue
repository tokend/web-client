<template>
  <div class="fund-details">
    <template v-if="isLoaded">
      <div class="asset-details">
        <asset-logo
          :asset-code="asset.code"
          :logo-url="asset.logoUrl(config.FILE_STORAGE)"
        />
        <div class="asset-details__info">
          <p class="asset-details__code">
            {{ asset.code }}
          </p>
          <p class="asset-details__name">
            {{ asset.name }}
          </p>
        </div>
      </div>

      <div
        v-if="fund.isApproved"
        class="request-state request-state--approved"
      >
        <p class="request-state__content">
          {{ 'requests-page.approved-request-msg' | globalize }}
        </p>
      </div>

      <div
        v-else-if="fund.isPending"
        class="request-state request-state--pending"
      >
        <p class="request-state__content">
          {{ 'requests-page.pending-request-msg' | globalize }}
        </p>
      </div>

      <div
        v-else-if="fund.isRejected"
        class="request-state request-state--rejected"
      >
        <p class="request-state__content">
          <!-- eslint-disable-next-line max-len -->
          {{ 'requests-page.rejected-request-msg' | globalize({ reason: fund.rejectReason }) }}
        </p>
      </div>

      <div
        v-else-if="fund.isCanceled"
        class="request-state request-state--canceled"
      >
        <p class="request-state__content">
          {{ 'requests-page.canceled-request-msg' | globalize() }}
        </p>
      </div>

      <div
        v-else-if="fund.isPermanentlyRejected"
        class="request-state request-state--permanently-rejected"
      >
        <p class="request-state__content">
          <!-- eslint-disable-next-line max-len -->
          {{ 'requests-page.permanently-rejected-request-msg' | globalize({ reason: request.rejectReason }) }}
        </p>
      </div>

      <p class="fund-details__short-description">
        {{ fund.shortDescription }}
      </p>

      <table class="app__table fund-details__table">
        <tbody>
          <tr>
            <td>
              {{ 'fund-details.name-title' | globalize }}
            </td>
            <td>
              {{ fund.name }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'fund-details.start-time-title' | globalize }}
            </td>
            <td>
              {{ fund.startTime | formatCalendar }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'fund-details.close-time-title' | globalize }}
            </td>
            <td>
              {{ fund.endTime | formatCalendar }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'fund-details.soft-cap-title' | globalize }}
            </td>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ { value: fund.softCap, currency: fund.defaultQuoteAsset } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'fund-details.hard-cap-title' | globalize }}
            </td>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ { value: fund.hardCap, currency: fund.defaultQuoteAsset } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ 'fund-details.sell-title' | globalize({ asset: fund.baseAsset }) }}
            </td>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ { value: fund.baseHardCap, currency: fund.baseAsset } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'fund-details.video-about-fund-title' | globalize }}
            </td>
            <td>
              <a
                v-if="fund.youtubeVideoUrl"
                class="fund-details__video-btn"
                :href="fund.youtubeVideoUrl"
                target="_blank"
              >
                {{ 'fund-details.view-video-btn' | globalize }}
              </a>
              <p v-else>
                {{ 'fund-details.no-video-msg' | globalize }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="fund-details__buttons">
        <button
          v-ripple
          class="fund-details__view-btn"
          :disabled="!canBeViewed"
          @click="viewFund"
        >
          {{ 'fund-details.view-btn' | globalize }}
        </button>
        <button
          v-ripple
          class="fund-details__update-btn"
          :disabled="!canBeUpdated"
          @click="$emit(EVENTS.update)"
        >
          {{ 'fund-details.update-btn' | globalize }}
        </button>
        <button
          v-ripple
          class="fund-details__cancel-btn"
          :class="{
            'fund-details__cancel-btn--disabled': !canBeCanceled
          }"
          :disabled="!canBeCanceled"
          @click="$emit(EVENTS.cancel)"
        >
          {{ 'fund-details.cancel-btn' | globalize }}
        </button>
      </div>
    </template>
    <template v-else-if="!isLoadingFailed">
      <loader :message-id="'fund-details.loading-msg'" />
    </template>
    <template v-else>
      <p>
        {{ 'fund-details.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import AssetLogo from '@/vue/common/assets/AssetLogo'
import Loader from '@/vue/common/Loader'

import { Sdk } from '@/sdk'
import { REQUEST_TYPES } from '@tokend/js-sdk'

import { REQUEST_STATES } from '@/js/const/request-states.const'

import config from '@/config'

import { vueRoutes } from '@/vue-router/routes'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { SaleRequestRecord } from '@/js/records/requests/sale-create.record'
import { SaleRecord } from '@/js/records/entities/sale.record'
import { AssetRecord } from '@/js/records/entities/asset.record'

const EVENTS = {
  update: 'update',
  cancel: 'cancel',
}

export default {
  name: 'fund-details',
  components: {
    AssetLogo,
    Loader,
  },
  props: {
    request: {
      type: SaleRequestRecord,
      default: null,
    },
    record: {
      type: SaleRecord,
      default: null,
    },
  },
  data: _ => ({
    asset: {},
    config,
    EVENTS,
    REQUEST_STATES,
    REQUEST_TYPES,
    isLoaded: false,
    isLoadingFailed: false,
  }),
  computed: {
    fund () {
      if (this.request instanceof SaleRequestRecord) {
        return this.request
      } else if (this.record instanceof SaleRecord) {
        return this.record
      } else {
        return {}
      }
    },
    canBeUpdated () {
      return this.fund.isPending || this.fund.isRejected || this.record
    },
    canBeCanceled () {
      return this.fund.isPending
    },
    canBeViewed () {
      return this.fund.isApproved || this.record
    },
  },
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
      this.$router.push(vueRoutes.funds)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.request-state {
  min-height: 6.4rem;
  width: 100%;
  margin-top: 2rem;
  display: none;

  .request-state__content {
    padding: 2.4rem;
    font-size: 1.3rem;
    font-weight: normal;
    color: $col-primary-txt;
  }

  @mixin apply-theme ($col-msg-background) {
    background-color: $col-msg-background;
    display: block;
  }

  &--approved { @include apply-theme($col-request-approved) }
  &--pending { @include apply-theme($col-request-pending) }
  &--rejected, &--canceled, &--permanently-rejected {
    @include apply-theme($col-request-rejected)
  }
}

.fund-details__short-description {
  margin-top: 4rem;
  font-size: 1.4rem;
  color: $col-text;
}

.fund-details__table {
  margin-top: 2rem;

  tr td:last-child {
    text-align: right;
  }
}

.fund-details__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}

.fund-details__buttons {
  margin-top: 4.9rem;
  display: flex;

  .fund-details__view-btn {
    @include button-raised();

    max-width: 14.4rem;
    width: 100%;
  }

  .fund-details__update-btn {
    @include button-raised();

    margin-left: 1.2rem;
    max-width: 14.4rem;
    width: 100%;
    font-weight: bold;
    color: $col-button-flat-light-text;
    box-shadow: 0 .5rem 1.5rem 0 $col-button-flat-light-shadow;
    background-color: $col-button-flat-light-bg;
  }

  .fund-details__cancel-btn {
    @include button();

    padding-left: .1rem;
    padding-right: .1rem;
    font-weight: normal;
    margin-left: auto;

    &--disabled {
      filter: grayscale(100%);
      cursor: default;
    }
  }
}

.fund-details__video-btn {
  color: $col-link;
  text-decoration: none;

  &:visited {
    color: $col-link;
  }
}

.asset-details {
  display: flex;
  align-items: center;

  .asset-details__logo {
    width: 5rem;
    height: 5rem;
    border-radius: 50%
  }

  .asset-details__info {
    margin-left: 1.8rem;

    .asset-details__code {
      font-size: 1.8rem;
      font-weight: bold;
      color: $col-primary;
    }

    .asset-details__name {
      margin-top: .1rem;
      font-size: 1.4rem;
      line-height: 1.29;
      color: $col-primary;
    }
  }
}
</style>
