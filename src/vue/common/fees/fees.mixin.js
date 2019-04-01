import { PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import Fees from './Fees'
import { Api } from '@/api'

export default {
  components: {
    Fees,
  },
  methods: {
    async calculateFees (opts) {
      const requestUrl = `v3/accounts/${opts.accountId}/calculated_fees`
      const [senderFees, recipientFees] = await Promise.all([
        Api.api.get(
          requestUrl,
          {
            asset: opts.assetCode,
            fee_type: opts.type,
            subtype: PAYMENT_FEE_SUBTYPES.outgoing,
            amount: opts.amount,
          }),
        Api.api.get(
          requestUrl,
          {
            asset: opts.assetCode,
            fee_type: opts.type,
            subtype: PAYMENT_FEE_SUBTYPES.incoming,
            amount: opts.amount,
          }),
      ])
      return {
        source: senderFees,
        destination: recipientFees,
        type: opts.type,
      }
    },
  },
}
