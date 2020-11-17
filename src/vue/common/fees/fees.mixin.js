import { FEE_TYPES, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { api } from '@/api'

import FeesRenderer from './FeesRenderer.vue'

import { Fee } from './fee'
import { FeesCollection } from './fees-collection'

export default {
  components: { FeesRenderer },

  methods: {
    /**
     * @param {object} opts
     * @param {string} opts.assetCode - Fee asset code.
     * @param {string} opts.amount - Amount of asset to calculate fees.
     * @param {FeeType} opts.type - Fee XDR enum type.
     * @param {string} opts.senderAccountId - Sender account ID.
     * @param {string} [opts.recipientAccountId] - Recipient account ID
     *                                             (only for payment type).
     * @returns {FeesCollection} - Fees collection.
     */
    async calculateFees (opts) {
      const assetCode = opts.assetCode
      const masterAccountId = api.networkDetails.adminAccountId
      let fees = []

      const sourceFee = await this.calculateFee({
        accountId: opts.senderAccountId,
        type: opts.type,
        subtype: PAYMENT_FEE_SUBTYPES.outgoing,
        assetCode: assetCode,
        amount: opts.amount,
      })
      fees.push(sourceFee)

      if (opts.recipientAccountId) {
        const destinationFee = await this.calculateFee({
          accountId: opts.recipientAccountId,
          type: opts.type,
          subtype: PAYMENT_FEE_SUBTYPES.incoming,
          assetCode: assetCode,
          amount: opts.amount,
        })
        fees.push(destinationFee)
      }

      return new FeesCollection({ fees, assetCode, masterAccountId })
    },

    async calculateFee ({ accountId, type, subtype, assetCode, amount }) {
      const endpoint = `/v3/accounts/${accountId}/calculated_fees`
      const params = {
        fee_type: type,
        asset: assetCode,
        amount,
      }

      if (type === FEE_TYPES.paymentFee) {
        params.subtype = subtype
      }

      const { data: fee } = await api.get(endpoint, params)

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
