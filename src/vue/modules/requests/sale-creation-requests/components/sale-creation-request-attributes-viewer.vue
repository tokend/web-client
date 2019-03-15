<template>
  <div class="sale-creation-request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'sale-creation-requests.max-issuance-amount-title' | globalize }}</td>
          <td>{{ request.maxIssuanceAmount | formatMoney }}</td>
        </tr>

        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'sale-creation-requests.initial-preissued-amount-title' | globalize }}</td>
          <td>{{ request.initialPreissuedAmount | formatMoney }}</td>
        </tr>

        <tr>
          <td>{{ 'sale-creation-requests.terms-title' | globalize }}</td>
          <td>
            <a
              v-if="request.termsKey"
              class="sale-creation-request-attributes-viewer__terms"
              :href="saleTermsUrl"
            >
              {{ 'sale-creation-requests.download-terms-btn' | globalize }}
            </a>

            <p v-else>
              {{ 'sale-creation-requests.no-terms-msg' | globalize }}
            </p>
          </td>
        </tr>

        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'sale-creation-requests.transferable-title' | globalize }}</td>
          <td>
            <template v-if="request.isTransferable">
              {{ 'sale-creation-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'sale-creation-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>
        <tr>
          <td>
            {{ 'sale-creation-requests.requires-kyc-title' | globalize }}
          </td>
          <td>
            <template v-if="request.saleType === kycRequiredSaleType">
              {{ 'sale-creation-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'sale-creation-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { SaleCreationRequest } from '../wrappers/sale-creation-request'

import { config } from '../_config'

export default {
  name: 'sale-creation-request-attributes-viewer',
  props: {
    request: { type: SaleCreationRequest, required: true },
    kycRequiredSaleType: { type: Number, required: true },
  },

  computed: {
    saleTermsUrl () {
      return this.request.termsUrl(config().storageURL)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.sale-creation-request-attributes-viewer {
  tr td:last-child {
    text-align: right;
  }
}

.sale-creation-request-attributes-viewer__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}
</style>
