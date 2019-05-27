import { FEE_TYPES, PAYMENT_FEE_SUBTYPES } from '@tokend/js-sdk'
import { api } from '@/api'

import FeesRenderer from './FeesRenderer.vue'

import { Fee } from './fee'
import { FeesCollection } from './fees-collection'
import { AssetRecord } from '@/js/records/entities/asset.record'

export default {
  components: { FeesRenderer },

  methods: {
    async getAssetByCode (assetCode) {
      const { data: asset } = await api.get(`/v3/assets/${assetCode}`)
      return new AssetRecord(asset)
    },

    async calculateFees (opts) {
      const asset = await this.getAssetByCode(opts.assetCode)
      const masterAccountId = api.networkDetails.adminAccountId
      let fees = []

      const sourceFee = await this.calculateFee({
        accountId: opts.senderAccountId,
        type: opts.type,
        subtype: PAYMENT_FEE_SUBTYPES.outgoing,
        assetCode: opts.assetCode,
        amount: opts.amount,
      })
      fees.push(sourceFee)

      if (opts.recipientAccountId) {
        const destinationFee = await this.calculateFee({
          accountId: opts.recipientAccountId,
          type: opts.type,
          subtype: PAYMENT_FEE_SUBTYPES.incoming,
          assetCode: opts.assetCode,
          amount: opts.amount,
        })
        fees.push(destinationFee)
      }

      return new FeesCollection({ fees, asset, masterAccountId })
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
