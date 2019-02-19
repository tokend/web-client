<template>
  <tbody>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.source-fixed-fee-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ sourceFixedFee | formatMoney }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.source-calculated-percent-fee-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ sourceCalculatedPercentFee | formatMoney }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.destination-fixed-fee-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ destinationFixedFee | formatMoney }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{
          'movements-history.destination-calculated-percent-fee-lbl' | globalize
        }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ destinationCalculatedPercentFee | formatMoney }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.source-pays-for-destination-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ operationDetails.sourcePayForDestination }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.subject-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ operationDetails.subject }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.from-account-id-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ operationDetails.fromAccountId | cropAddress }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.to-account-id-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ operationDetails.toAccountId | cropAddress }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.from-balance-id-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ operationDetails.fromBalanceId | cropAddress }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.to-balance-id-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ operationDetails.toBalanceId | cropAddress }}
      </td>
    </tr>
  </tbody>
</template>

<script>
import { PaymentOp } from '../../wrappers/operation-details/payment'

export default {
  props: {
    operationDetails: {
      type: PaymentOp,
      required: true,
    },
  },
  computed: {
    sourceFixedFee () {
      return {
        currency: this.operationDetails.assetCode,
        value: this.operationDetails.sourceFixedFee,
      }
    },
    sourceCalculatedPercentFee () {
      return {
        currency: this.operationDetails.assetCode,
        value: this.operationDetails.sourceCalculatedPercentFee,
      }
    },
    destinationFixedFee () {
      return {
        currency: this.operationDetails.assetCode,
        value: this.operationDetails.destinationFixedFee,
      }
    },
    destinationCalculatedPercentFee () {
      return {
        currency: this.operationDetails.assetCode,
        value: this.operationDetails.destinationCalculatedPercentFee,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../../scss/attributes-viewer';
</style>
