<template>
  <div class="fund-details">
    <div class="asset-details">
      <asset-logo
        :asset-code="request.name"
        :logo-url="request.logoUrl(config.FILE_STORAGE)"
      />
      <div class="asset-details__info">
        <p class="asset-details__code">
          {{ request.baseAsset }}
        </p>
        <p class="asset-details__name">
          {{ request.name }}
        </p>
      </div>
    </div>

    <div
      v-if="request.isApproved"
      class="request-state request-state--approved"
    >
      <p class="request-state__content">
        {{ 'fund-details.approved-request-msg' | globalize }}
      </p>
    </div>

    <div
      v-else-if="request.isPending"
      class="request-state request-state--pending"
    >
      <p class="request-state__content">
        {{ 'fund-details.pending-request-msg' | globalize }}
      </p>
    </div>

    <div
      v-else-if="request.isRejected"
      class="request-state request-state--rejected"
    >
      <p class="request-state__content">
        <!-- eslint-disable-next-line max-len -->
        {{ 'fund-details.rejected-request-msg' | globalize({ reason: request.rejectReason }) }}
      </p>
    </div>

    <div
      v-else-if="request.isCanceled"
      class="request-state request-state--canceled"
    >
      <p class="request-state__content">
        {{ 'fund-details.canceled-request-msg' | globalize() }}
      </p>
    </div>

    <div
      v-else-if="request.isPermanentlyRejected"
      class="request-state request-state--permanently-rejected"
    >
      <p class="request-state__content">
        <!-- eslint-disable-next-line max-len -->
        {{ 'fund-details.permanently-rejected-request-msg' | globalize({ reason: request.rejectReason }) }}
      </p>
    </div>

    <table class="app__table fund-details__table">
      <tbody>
        <tr v-if="request.requestTypeI === REQUEST_TYPES.sale">
          <td>
            {{ 'fund-details.request-type-title' | globalize }}
          </td>
          <td>
            {{ 'fund-details.sale-request-type' | globalize }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'fund-details.start-time-title' | globalize }}
          </td>
          <td>
            {{ request.startTime | formatCalendar }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'fund-details.close-time-title' | globalize }}
          </td>
          <td>
            {{ request.endTime | formatCalendar }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'fund-details.soft-cap-title' | globalize }}
          </td>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ { value: request.softCap, currency: request.defaultQuoteAsset } | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'fund-details.hard-cap-title' | globalize }}
          </td>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ { value: request.hardCap, currency: request.defaultQuoteAsset } | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ 'fund-details.sell-title' | globalize({ asset: request.baseAsset }) }}
          </td>
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ { value: request.baseAssetForHardCap, currency: request.baseAsset } | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'fund-details.video-about-fund-title' | globalize }}
          </td>
          <td>
            <a
              v-if="request.youtubeVideoId"
              class="asset-request-details__terms"
              :href="fundVideoUrl"
              target="_blank"
            >
              {{ 'asset-request-details.download-terms-btn' | globalize }}
            </a>
            <p v-else>
              {{ 'asset-request-details.no-video-msg' | globalize }}
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="fund-details__buttons">
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
  </div>
</template>

<script>
import AssetLogo from '@/vue/common/assets/AssetLogo'

import { REQUEST_TYPES } from '@tokend/js-sdk'

import { REQUEST_STATES } from '@/js/const/request-states.const'

import config from '@/config'

import { SaleRequestRecord } from '@/js/records/requests/sale-create.record'
import { SaleRecord } from '@/js/records/entities/sale.record'

const EVENTS = {
  update: 'update',
  cancel: 'cancel',
}

export default {
  name: 'fund-details',
  components: {
    AssetLogo,
  },
  props: {
    request: {
      type: [SaleRecord, SaleRequestRecord],
      required: true,
    },
  },
  data: _ => ({
    config,
    EVENTS,
    REQUEST_STATES,
    REQUEST_TYPES,
  }),
  computed: {
    fundVideoUrl () {
      return `https://www.youtube.com/watch?v=${this.request.youtubeVideoUrl}`
    },
    canBeUpdated () {
      return this.request.isPending || this.request.isRejected
    },
    canBeCanceled () {
      return this.request.isPending
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

  button + button {
    margin-left: auto;
  }
}

.fund-details__update-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.fund-details__cancel-btn {
  @include button();

  padding-left: .1rem;
  padding-right: .1rem;
  margin-bottom: 2rem;
  font-weight: normal;

  &--disabled {
    filter: grayscale(100%);
    cursor: default;
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
