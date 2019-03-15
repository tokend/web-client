<template>
  <div class="asset-creation-request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'asset-creation-requests.max-issuance-amount-title' | globalize }}</td>
          <td>{{ request.maxIssuanceAmount | formatMoney }}</td>
        </tr>

        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'asset-creation-requests.initial-preissued-amount-title' | globalize }}</td>
          <td>{{ request.initialPreissuedAmount | formatMoney }}</td>
        </tr>

        <tr>
          <td>{{ 'asset-creation-requests.terms-title' | globalize }}</td>
          <td>
            <a
              v-if="request.termsKey"
              class="asset-creation-request-attributes-viewer__terms"
              :href="assetTermsUrl"
            >
              {{ 'asset-creation-requests.download-terms-btn' | globalize }}
            </a>

            <p v-else>
              {{ 'asset-creation-requests.no-terms-msg' | globalize }}
            </p>
          </td>
        </tr>

        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'asset-creation-requests.transferable-title' | globalize }}</td>
          <td>
            <template v-if="request.isTransferable">
              {{ 'asset-creation-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'asset-creation-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ 'asset-creation-requests.requires-kyc-title' | globalize }}
          </td>
          <td>
            <template v-if="request.assetType === kycRequiredAssetType">
              {{ 'asset-creation-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'asset-creation-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { AssetCreationRequest } from '../wrappers/asset-creation-request'

import { config } from '../_config'

export default {
  name: 'asset-creation-request-attributes-viewer',
  props: {
    request: { type: AssetCreationRequest, required: true },
    kycRequiredAssetType: { type: Number, required: true },
  },

  computed: {
    assetTermsUrl () {
      return this.request.termsUrl(config().storageURL)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.asset-creation-request-attributes-viewer {
  tr td:last-child {
    text-align: right;
  }
}

.asset-creation-request-attributes-viewer__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}
</style>
