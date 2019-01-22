<template>
  <div class="token-request-details">
    <div class="asset-details">
      <img
        class="asset-details__logo"
        :src="tokenLogoUrl"
      >
      <div class="asset-details__info">
        <p class="asset-details__code">
          {{ requestRecord.assetCode }}
        </p>
        <p class="asset-details__name">
          {{ requestRecord.assetName }}
        </p>
      </div>
    </div>
    <div
      class="request-message"
      :class="`request-message--${request.requestState}`"
    >
      <p class="request-message__content">
        {{ requestMessage }}
      </p>
    </div>
    <table class="app__table token-request-details__table">
      <tbody>
        <tr>
          <td>
            {{ 'token-request-details.request-type-title' | globalize }}
          </td>
          <td>
            {{ requestTypeMessage }}
          </td>
        </tr>
        <tr v-if="isAssetCreateType">
          <td>
            {{ 'token-request-details.max-issuance-amount-title' | globalize }}
          </td>
          <td>
            {{ requestRecord.maxIssuanceAmount | formatMoney }}
          </td>
        </tr>
        <tr v-if="isAssetCreateType">
          <td>
            {{
              'token-request-details.initial-preissued-amount-title'
                | globalize
            }}
          </td>
          <td>
            {{ requestRecord.initialPreissuedAmount | formatMoney }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-request-details.terms-title' | globalize }}
          </td>
          <td>
            <a
              v-if="requestRecord.termsKey"
              class="token-request-details__terms"
              :href="tokenTermsUrl">
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
            {{ getPropertyPresentMessage(requestRecord.isTransferable) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-request-details.requires-kyc-title' | globalize }}
          </td>
          <td>
            {{ getPropertyPresentMessage(requestRecord.isRequiresKyc) }}
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
import { base, ASSET_POLICIES, REQUEST_TYPES } from '@tokend/js-sdk'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Sdk } from '@/sdk'
import config from '@/config'

import { AssetCreateRequestRecord } from '@/js/records/requests/asset-create.record'
import { AssetUpdateRequestRecord } from '@/js/records/requests/asset-update.record'

import { globalize } from '@/vue/filters/globalize'

const EVENTS = {
  update: 'update',
}

export default {
  name: 'token-request-details',
  props: {
    request: { type: Object, required: true },
  },
  data: _ => ({
    isRequestCanceling: false,
    requestRecord: null,
    ASSET_POLICIES,
    EVENTS,
  }),
  computed: {
    isAssetCreateType () {
      return this.requestRecord instanceof AssetCreateRequestRecord
    },
    requestTypeMessage () {
      switch (this.requestRecord.requestTypeI) {
        case REQUEST_TYPES.assetCreate:
          return globalize('token-request-details.asset-create-request-type')
        case REQUEST_TYPES.assetUpdate:
          return globalize('token-request-details.asset-update-request-type')
        default:
          return ''
      }
    },
    tokenLogoUrl () {
      if (this.requestRecord.logoKey) {
        return this.requestRecord.logoUrl(config.FILE_STORAGE)
      } else {
        return '/static/favicon.ico'
      }
    },
    tokenTermsUrl () {
      return this.requestRecord.termsUrl(config.FILE_STORAGE)
    },
    canBeUpdated () {
      return this.request.requestState === REQUEST_STATES_STR.pending ||
        this.request.requestState === REQUEST_STATES_STR.rejected
    },
    canBeCanceled () {
      return this.request.requestState === REQUEST_STATES_STR.pending ||
        !this.isRequestCanceling
    },
    requestMessageId () {
      let requestMessageId
      switch (this.request.requestState) {
        case REQUEST_STATES_STR.pending:
          requestMessageId = 'token-request-details.pending-request-msg'
          break
        case REQUEST_STATES_STR.approved:
          requestMessageId = 'token-request-details.approved-request-msg'
          break
        case REQUEST_STATES_STR.rejected:
          requestMessageId = 'token-request-details.rejected-request-msg'
          break
        case REQUEST_STATES_STR.canceled:
          requestMessageId = 'token-request-details.canceled-request-msg'
          break
        case REQUEST_STATES_STR.permanentlyRejected:
          requestMessageId = 'token-request-details.permanently-rejected-request-msg'
          break
        default:
          requestMessageId = ''
          break
      }

      return requestMessageId
    },
    requestMessage () {
      if (this.request.requestState === REQUEST_STATES_STR.rejected) {
        return globalize(this.requestMessageId, {
          reason: this.request.rejectReason,
        })
      } else {
        return globalize(this.requestMessageId)
      }
    },
  },
  created () {
    if (this.request.details.assetCreate) {
      this.requestRecord = new AssetCreateRequestRecord(this.request)
    } else {
      this.requestRecord = new AssetUpdateRequestRecord(this.request)
    }
  },
  methods: {
    getPropertyPresentMessage (prop) {
      if (prop) {
        return globalize('token-request-details.present-msg')
      } else {
        return globalize('token-request-details.absent-msg')
      }
    },
    async cancelRequest () {
      this.isRequestCanceling = true
      try {
        const operation = base.ManageAssetBuilder.cancelAssetRequest({
          requestID: this.request.id,
        })
        await Sdk.horizon.transactions.submitOperations(operation)
        this.request = Object.assign(this.request, {
          requestState: REQUEST_STATES_STR.canceled,
        })
        Bus.success('token-request-details.request-canceled-msg')
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.request-message {
  min-height: 6.4rem;
  width: 100%;
  margin-top: 2rem;
  display: none;

  .request-message__content {
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
  &--rejected, &--canceled, &--permanentlyRejected {
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
  color: #7b6eff;
  text-decoration: none;

  &:visited {
    color: #7b6eff;
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
