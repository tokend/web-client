<template>
  <div class="token-request-details">
    <div class="asset-details">
      <token-logo
        :logo-key="request.logoKey"
        :token-code="request.assetCode"
      />
      <div class="asset-details__info">
        <p class="asset-details__code">
          {{ request.assetCode }}
        </p>
        <p class="asset-details__name">
          {{ request.assetName }}
        </p>
      </div>
    </div>
    <div
      v-if="request.stateI === REQUEST_STATES.approved"
      class="request-state request-state--approved"
    >
      <p class="request-state__content">
        {{ 'token-request-details.approved-request-msg' | globalize }}
      </p>
    </div>
    <div
      v-else-if="request.stateI === REQUEST_STATES.pending"
      class="request-state request-state--pending"
    >
      <p class="request-state__content">
        {{ 'token-request-details.pending-request-msg' | globalize }}
      </p>
    </div>
    <div
      v-else-if="request.stateI === REQUEST_STATES.rejected"
      class="request-state request-state--rejected"
    >
      <p class="request-state__content">
        <!-- eslint-disable-next-line max-len -->
        {{ 'token-request-details.rejected-request-msg' | globalize({ reason: request.rejectReason }) }}
      </p>
    </div>
    <div
      v-else-if="request.stateI === REQUEST_STATES.canceled"
      class="request-state request-state--canceled"
    >
      <p class="request-state__content">
        {{ 'token-request-details.canceled-request-msg' | globalize() }}
      </p>
    </div>
    <div
      v-else-if="request.stateI === REQUEST_STATES.permanentlyRejected"
      class="request-state request-state--permanently-rejected"
    >
      <p class="request-state__content">
        <!-- eslint-disable-next-line max-len -->
        {{ 'token-request-details.permanently-rejected-request-msg' | globalize({ reason: request.rejectReason }) }}
      </p>
    </div>
    <table class="app__table token-request-details__table">
      <tbody>
        <tr>
          <td>
            {{ 'token-request-details.request-type-title' | globalize }}
          </td>
          <td>
            <template v-if="isAssetCreationType">
              <!-- eslint-disable-next-line max-len -->
              {{ 'token-request-details.asset-create-request-type' | globalize }}
            </template>
            <template v-else>
              <!-- eslint-disable-next-line max-len -->
              {{ 'token-request-details.asset-update-request-type' | globalize }}
            </template>
          </td>
        </tr>
        <tr v-if="isAssetCreationType">
          <td>
            {{ 'token-request-details.max-issuance-amount-title' | globalize }}
          </td>
          <td>
            {{ request.maxIssuanceAmount | formatMoney }}
          </td>
        </tr>
        <tr v-if="isAssetCreationType">
          <td>
            <!-- eslint-disable-next-line max-len -->
            {{ 'token-request-details.initial-preissued-amount-title' | globalize }}
          </td>
          <td>
            {{ request.initialPreissuedAmount | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-request-details.terms-title' | globalize }}
          </td>
          <td>
            <a
              v-if="request.termsKey"
              class="token-request-details__terms"
              :href="tokenTermsUrl"
            >
              {{ 'token-request-details.download-terms-btn' | globalize }}
            </a>
            <p v-else>
              {{ 'token-request-details.no-terms-msg' | globalize }}
            </p>
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-request-details.transferable-title' | globalize }}
          </td>
          <td>
            <template v-if="request.isTransferable">
              {{ 'token-request-details.present-msg' | globalize }}
            </template>
            <template v-else>
              {{ 'token-request-details.absent-msg' | globalize }}
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-request-details.requires-kyc-title' | globalize }}
          </td>
          <td>
            <template v-if="request.isRequiresKYC">
              {{ 'token-request-details.present-msg' | globalize }}
            </template>
            <template v-else>
              {{ 'token-request-details.absent-msg' | globalize }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="token-request-details__buttons">
      <button
        v-ripple
        class="token-request-details__update-btn"
        :disabled="!canBeUpdated"
        @click="$emit(EVENTS.update)"
      >
        {{ 'token-request-details.update-btn' | globalize }}
      </button>
      <button
        v-ripple
        class="token-request-details__cancel-btn"
        :class="{
          'token-request-details__cancel-btn--disabled': !canBeCanceled
        }"
        :disabled="!canBeCanceled"
        @click="cancelRequest"
      >
        {{ 'token-request-details.cancel-btn' | globalize }}
      </button>
    </div>
  </div>
</template>

<script>
import TokenLogo from '@/vue/common/TokenLogo'

import { base, ASSET_POLICIES, REQUEST_TYPES } from '@tokend/js-sdk'

import { REQUEST_STATES } from '@/js/const/request-states.const'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Sdk } from '@/sdk'
import config from '@/config'

import { AssetCreateRequestRecord } from '@/js/records/requests/asset-create.record'

const EVENTS = {
  update: 'update',
}

export default {
  name: 'token-request-details',
  components: {
    TokenLogo,
  },
  props: {
    request: { type: Object, required: true },
  },
  data: _ => ({
    isCanceled: false,
    ASSET_POLICIES,
    EVENTS,
    REQUEST_STATES,
    REQUEST_TYPES,
  }),
  computed: {
    isAssetCreationType () {
      return this.request instanceof AssetCreateRequestRecord
    },
    tokenTermsUrl () {
      return this.request.termsUrl(config.FILE_STORAGE)
    },
    canBeUpdated () {
      return this.request.isPending || this.request.isRejected
    },
    canBeCanceled () {
      return this.request.isPending && !this.isCanceled
    },
  },
  methods: {
    async cancelRequest () {
      this.isCanceled = true
      try {
        const operation = base.ManageAssetBuilder.cancelAssetRequest({
          requestID: this.request.id,
        })
        await Sdk.horizon.transactions.submitOperations(operation)
        this.request = Object.assign(this.request, {
          stateI: REQUEST_STATES.canceled,
        })
        Bus.success('token-request-details.request-canceled-msg')
      } catch (e) {
        this.isCanceled = false
        ErrorHandler.process(e)
      }
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

.token-request-details__table {
  margin-top: 2rem;

  tr td:last-child {
    text-align: right;
  }
}

.token-request-details__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}

.token-request-details__buttons {
  margin-top: 4.9rem;
  display: flex;

  button + button {
    margin-left: auto;
  }
}

.token-request-details__update-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}

.token-request-details__cancel-btn {
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
