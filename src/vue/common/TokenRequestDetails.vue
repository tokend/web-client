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
      class="request-message"
      :class="`request-message--${request.state}`"
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
            {{ request.maxIssuanceAmount | formatMoney }}
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
            {{ getPropertyPresentMessage(request.isTransferable) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ 'token-request-details.requires-kyc-title' | globalize }}
          </td>
          <td>
            {{ getPropertyPresentMessage(request.isRequiresKYC) }}
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

import { globalize } from '@/vue/filters/globalize'

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
    isCanceling: false,
    ASSET_POLICIES,
    EVENTS,
  }),
  computed: {
    isAssetCreateType () {
      return this.request instanceof AssetCreateRequestRecord
    },
    requestTypeMessage () {
      switch (this.request.requestTypeI) {
        case REQUEST_TYPES.assetCreate:
          return globalize('token-request-details.asset-create-request-type')
        case REQUEST_TYPES.assetUpdate:
          return globalize('token-request-details.asset-update-request-type')
        default:
          return ''
      }
    },
    tokenTermsUrl () {
      return this.request.termsUrl(config.FILE_STORAGE)
    },
    canBeUpdated () {
      return this.request.isPending || this.request.isRejected
    },
    canBeCanceled () {
      return this.request.isPending && !this.isCanceling
    },
    requestMessageId () {
      let requestMessageId
      switch (this.request.stateI) {
        case REQUEST_STATES.pending:
          requestMessageId = 'token-request-details.pending-request-msg'
          break
        case REQUEST_STATES.approved:
          requestMessageId = 'token-request-details.approved-request-msg'
          break
        case REQUEST_STATES.rejected:
          requestMessageId = 'token-request-details.rejected-request-msg'
          break
        case REQUEST_STATES.canceled:
          requestMessageId = 'token-request-details.canceled-request-msg'
          break
        case REQUEST_STATES.permanentlyRejected:
          requestMessageId = 'token-request-details.permanently-rejected-request-msg'
          break
        default:
          requestMessageId = ''
          break
      }

      return requestMessageId
    },
    requestMessage () {
      if (this.request.isRejected || this.request.isPermanentlyRejected) {
        return globalize(this.requestMessageId, {
          reason: this.request.rejectReason,
        })
      } else {
        return globalize(this.requestMessageId)
      }
    },
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
      this.isCanceling = true
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
  &--rejected, &--canceled, &--permanently_rejected {
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
