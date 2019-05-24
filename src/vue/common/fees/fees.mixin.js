import { PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { api } from '@/api'

import FeesRenderer from './FeesRenderer.vue'

import { Fee } from './fee'
import { FeesCollection } from './fees-collection'

export default {
  components: { FeesRenderer },

  methods: {
    async calculateFees (opts) {
      const masterAccountId = api.networkDetails.adminAccountId

      const sourceFee = await this.calculateFee({
        accountId: opts.senderAccountId,
        type: opts.type,
        subtype: PAYMENT_FEE_SUBTYPES.outgoing,
        assetCode: opts.asset.code,
        amount: opts.amount,
      })

      const destinationFee = await this.calculateFee({
        accountId: opts.recipientAccountId,
        type: opts.type,
        subtype: PAYMENT_FEE_SUBTYPES.incoming,
        assetCode: opts.asset.code,
        amount: opts.amount,
      })

      return new FeesCollection({
        fees: [sourceFee, destinationFee],
        asset: opts.asset,
        masterAccountId,
      })
    },

    async calculateFee ({ accountId, type, subtype, assetCode, amount }) {
      const { data: fee } = await api.get(
        `/v3/accounts/${accountId}/calculated_fees`,
        {
          fee_type: type,
          subtype,
          asset: assetCode,
          amount,
        }
      )

      return new Fee({
        type,
        subtype,
        assetCode,
        amount,
        fixed: fee.fixed,
        calculatedPercent: fee.calculatedPercent,
      })
    },
  },
}
