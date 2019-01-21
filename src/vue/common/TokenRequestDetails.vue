<template>
  <div class="token-request-details">
    <div class="asset-details">
      <img
        v-if="requestRecord.logoKey"
        class="asset-details__logo"
        :src="tokenLogoUrl"
      >
      <img
        v-else
        class="asset-details__logo"
        src="/static/favicon.ico"
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
      >
        {{ 'token-request-details.update-btn' | globalize }}
      </button>
      <button
        v-ripple
        class="token-request-details__cancel-btn"
      >
        {{ 'token-request-details.cancel-btn' | globalize }}
      </button>
    </div>
  </div>
</template>

<script>
import { ASSET_POLICIES, REQUEST_TYPES } from '@tokend/js-sdk'

import config from '@/config'

import { AssetCreateRequestRecord } from '@/js/records/requests/asset-create.record'
import { AssetUpdateRequestRecord } from '@/js/records/requests/asset-update.record'

import { globalize } from '@/vue/filters/globalize'

export default {
  name: 'token-request-details',
  props: {
    request: { type: Object, required: true },
  },
  data: _ => ({
    requestRecord: null,
    ASSET_POLICIES,
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
      return this.requestRecord.logoUrl(config.FILE_STORAGE)
    },
    tokenTermsUrl () {
      return this.requestRecord.termsUrl(config.FILE_STORAGE)
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
    showRequestDetails (request) {
      this.selectedRequest = request
      this.isDetailsDrawerShown = true
    },
    getPropertyPresentMessage (prop) {
      if (prop) {
        return globalize('token-request-details.present-msg')
      } else {
        return globalize('token-request-details.absent-msg')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.token-request-details__table {
  margin-top: 4rem;

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
