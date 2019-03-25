<template>
  <div class="request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'create-asset-requests.max-issuance-amount-title' | globalize }}</td>
          <td>{{ request.maxIssuanceAmount | formatMoney }}</td>
        </tr>

        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'create-asset-requests.initial-preissued-amount-title' | globalize }}</td>
          <td>{{ request.initialPreissuedAmount | formatMoney }}</td>
        </tr>

        <tr>
          <td>{{ 'create-asset-requests.terms-title' | globalize }}</td>
          <td>
            <a
              v-if="request.termsKey"
              class="request-attributes-viewer__terms"
              :href="assetTermsUrl"
            >
              {{ 'create-asset-requests.download-terms-btn' | globalize }}
            </a>

            <p v-else>
              {{ 'create-asset-requests.no-terms-msg' | globalize }}
            </p>
          </td>
        </tr>

        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'create-asset-requests.transferable-title' | globalize }}</td>
          <td>
            <template v-if="request.isTransferable">
              {{ 'create-asset-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'create-asset-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ 'create-asset-requests.requires-kyc-title' | globalize }}
          </td>
          <td>
            <template v-if="request.assetType === kycRequiredAssetType">
              {{ 'create-asset-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'create-asset-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { CreateAssetRequest } from '../wrappers/create-asset-request'

import { config } from '../_config'

export default {
  name: 'request-attributes-viewer',
  props: {
    request: { type: CreateAssetRequest, required: true },
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

.request-attributes-viewer {
  tr td:last-child {
    text-align: right;
  }
}

.request-attributes-viewer__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}
</style>
