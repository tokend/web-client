<template>
  <span :title="fee | feeSubtypeTranslationId | globalize">
    {{ fee | feeSubtypeTranslationId | globalize }}
  </span>
</template>

<script>
import { FeeRecord } from '@/js/records/entities/fee.record'

import { FEE_TYPES, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'

const PAYMENT_FEE_SUBTYPE_TRANSLATION_CODES = {
  [PAYMENT_FEE_SUBTYPES.outgoing]: 'fees.subtypes.outgoing',
  [PAYMENT_FEE_SUBTYPES.incoming]: 'fees.subtypes.incoming',
}

export default {
  name: 'fee-subtype-viewer',

  filters: {
    feeSubtypeTranslationId (fee) {
      const isPaymentFeeType = fee.type === FEE_TYPES.paymentFee
      const feeSubtypeTranslationId = isPaymentFeeType
        ? PAYMENT_FEE_SUBTYPE_TRANSLATION_CODES[fee.subtype]
        : 'fees.subtypes.incoming-outgoing'

      return feeSubtypeTranslationId
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
