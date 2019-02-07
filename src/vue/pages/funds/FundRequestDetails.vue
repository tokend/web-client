<template>
  <div class="fund-request-details">
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
        v-if="request.isApproved"
        class="request-state request-state--approved"
      >
        <p class="request-state__content">
          {{ 'request-messages.approved-request-msg' | globalize }}
        </p>
      </div>

      <div
        v-else-if="request.isPending"
        class="request-state request-state--pending"
      >
        <p class="request-state__content">
          {{ 'request-messages.pending-request-msg' | globalize }}
        </p>
      </div>

      <div
        v-else-if="request.isRejected"
        class="request-state request-state--rejected"
      >
        <p class="request-state__content">
          <!-- eslint-disable-next-line max-len -->
          {{ 'request-messages.rejected-request-msg' | globalize({ reason: request.rejectReason }) }}
        </p>
      </div>

      <div
        v-else-if="request.isCanceled"
        class="request-state request-state--canceled"
      >
        <p class="request-state__content">
          {{ 'request-messages.canceled-request-msg' | globalize() }}
        </p>
      </div>

      <div
        v-else-if="request.isPermanentlyRejected"
        class="request-state request-state--permanently-rejected"
      >
        <p class="request-state__content">
          <!-- eslint-disable-next-line max-len -->
          {{ 'request-messages.permanently-rejected-request-msg' | globalize({ reason: request.rejectReason }) }}
        </p>
      </div>

      <p class="fund-request-details__short-description">
        {{ request.shortDescription }}
      </p>

      <table class="app__table fund-request-details__table">
        <tbody>
          <tr>
            <td>
              {{ 'fund-request-details.name-title' | globalize }}
            </td>
            <td>
              {{ request.name }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'fund-request-details.start-time-title' | globalize }}
            </td>
            <td>
              {{ request.startTime | formatCalendar }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'fund-request-details.close-time-title' | globalize }}
            </td>
            <td>
              {{ request.endTime | formatCalendar }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'fund-request-details.soft-cap-title' | globalize }}
            </td>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ { value: request.softCap, currency: request.defaultQuoteAsset } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'fund-request-details.hard-cap-title' | globalize }}
            </td>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ { value: request.hardCap, currency: request.defaultQuoteAsset } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ 'fund-request-details.sell-title' | globalize({ asset: request.baseAsset }) }}
            </td>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ { value: request.baseAssetForHardCap, currency: request.baseAsset } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'fund-request-details.video-about-fund-title' | globalize }}
            </td>
            <td>
              <a
                v-if="request.youtubeVideoUrl"
                class="fund-request-details__video-btn"
                :href="request.youtubeVideoUrl"
                target="_blank"
              >
                {{ 'fund-request-details.view-video-btn' | globalize }}
              </a>
              <p v-else>
                {{ 'fund-request-details.no-video-msg' | globalize }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="fund-request-details__buttons">
        <button
          v-ripple
          class="fund-request-details__view-btn"
          :disabled="!canBeViewed"
          @click="viewFund"
        >
          {{ 'fund-request-details.view-btn' | globalize }}
        </button>

        <button
          v-ripple
          class="fund-request-details__update-btn"
          :disabled="!canBeUpdated"
          @click="$emit(EVENTS.updateAsk)"
        >
          {{ 'fund-request-details.update-btn' | globalize }}
        </button>

        <button
          v-ripple
          class="fund-request-details__cancel-btn"
          :class="{
            'fund-request-details__cancel-btn--disabled': !canBeCanceled
          }"
          :disabled="!canBeCanceled"
          @click="$emit(EVENTS.cancelAsk)"
        >
          {{ 'fund-request-details.cancel-btn' | globalize }}
        </button>
      </div>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader :message-id="'fund-request-details.loading-msg'" />
    </template>

    <template v-else>
      <p>
        {{ 'fund-request-details.loading-error-msg' | globalize }}
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

import { SaleRequestRecord } from '@/js/records/requests/sale-create.record'
import { AssetRecord } from '@/js/records/entities/asset.record'

const EVENTS = {
  updateAsk: 'update-ask',
  cancelAsk: 'cancel-ask',
}

export default {
  name: 'fund-request-details',
  components: {
    AssetLogo,
    Loader,
  },
  props: {
    request: {
      type: SaleRequestRecord,
      required: true,
    },
  },
  data: _ => ({
    asset: {},
    config,
    EVENTS,
    isLoaded: false,
    isLoadingFailed: false,
  }),
  computed: {
    canBeUpdated () {
      return this.request.isPending || this.request.isRejected
    },
    canBeCanceled () {
      return this.request.isPending
    },
    canBeViewed () {
      return this.request.isApproved
    },
  },
  async created () {
    try {
      const { data } = await Sdk.horizon.assets.get(this.request.baseAsset)
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

.fund-request-details__short-description {
  margin-top: 4rem;
  font-size: 1.4rem;
  color: $col-text;
}

.fund-request-details__table {
  margin-top: 2rem;

  tr td:last-child {
    text-align: right;
  }
}

.fund-request-details__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}

.fund-request-details__buttons {
  margin-top: 4.9rem;
  display: flex;

  .fund-request-details__view-btn {
    @include button-raised();

    max-width: 14.4rem;
    width: 100%;
  }

  .fund-request-details__update-btn {
    @include button-raised();

    margin-left: 1.2rem;
    max-width: 14.4rem;
    width: 100%;
    font-weight: bold;
    color: $col-button-flat-light-text;
    box-shadow: 0 .5rem 1.5rem 0 $col-button-flat-light-shadow;
    background-color: $col-button-flat-light-bg;
  }

  .fund-request-details__cancel-btn {
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

.fund-request-details__video-btn {
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
