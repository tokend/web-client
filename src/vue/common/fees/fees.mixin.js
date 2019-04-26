import { PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { FeesRecord } from '@/js/records/entities/fees.record'
import Fees from './Fees'
import { Api } from '@/api'

export default {
  components: {
    Fees,
  },
  methods: {
    requestUrl (accountId) {
      const requestUrl = `v3/accounts/${accountId}/calculated_fees`
      return requestUrl
    },
    async calculateFees (opts) {
      const [senderFees, recipientFees] = await Promise.all([
        Api.api.get(
          this.requestUrl(opts.senderId),
          {
            asset: opts.asset.code,
            fee_type: opts.type,
            subtype: PAYMENT_FEE_SUBTYPES.outgoing,
            amount: opts.amount,
          }),
        Api.api.get(
          this.requestUrl(opts.recipientId),
          {
            asset: opts.asset.code,
            fee_type: opts.type,
            subtype: PAYMENT_FEE_SUBTYPES.incoming,
            amount: opts.amount,
          }),
      ])
      const fees = {
        source: senderFees,
        destination: recipientFees,
        type: opts.type,
        asset: opts.asset,
      }
      return new FeesRecord(fees)
    },
  },
}
