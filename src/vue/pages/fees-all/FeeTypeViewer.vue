<template>
  <span :title="fee.type | feeTypeTranslationId | globalize">
    {{ fee.type | feeTypeTranslationId | globalize }}
  </span>
</template>

<script>
import { FeeRecord } from '@/js/records/entities/fee.record'

import { FEE_TYPES } from '@tokend/js-sdk'

const FEE_TYPE_TRANSLATION_CODES = {
  [FEE_TYPES.paymentFee]: 'fees.types.payment',
  [FEE_TYPES.offerFee]: 'fees.types.offer',
  [FEE_TYPES.withdrawalFee]: 'fees.types.withdrawal',
  [FEE_TYPES.issuanceFee]: 'fees.types.issuance',
  [FEE_TYPES.investFee]: 'fees.types.invest',
  [FEE_TYPES.capitalDeploymentFee]: 'fees.types.capital-deployment',
  [FEE_TYPES.operationFee]: 'fees.types.operation',
  [FEE_TYPES.payoutFee]: 'fees.types.payout',
}

export default {
  name: 'fee-type-viewer',

  filters: {
    feeTypeTranslationId (feeType) {
      return FEE_TYPE_TRANSLATION_CODES[feeType]
    },
  },

  props: {
    fee: {
      type: FeeRecord,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
