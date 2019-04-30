import {
  PAYMENT_FEE_SUBTYPES,
} from '@tokend/js-sdk'
import {
  FeesRecord,
  CoupledFeesRecord,
} from './fees.record'
import Fees from './FeesViewer.vue'
import { Api } from '@/api'
import { Sdk } from '@/sdk'

export default {
  components: {
    Fees,
  },
  methods: {
    async getFeeAssetById (assetCode) {
      const asset = await Api.api.get(
        `/v3/assets/${assetCode}`
      )
      return asset.data
    },
    async calculateFees (opts) {
      const masterAccountId = Sdk.networkDetails.adminAccountId
      const asset = await this.getFeeAssetById(opts.assetCode)
      const recipientFees = await this.calculateRecipientFees({
        accountId: opts.recipientAccountId,
        type: opts.type,
        assetCode: opts.assetCode,
        amount: opts.amount,
      })
      recipientFees.assetCode = opts.assetCode
      recipientFees.type = opts.type
      const senderFees = await this.calculateSenderFees({
        accountId: opts.senderAccountId,
        type: opts.type,
        assetCode: opts.assetCode,
        amount: opts.amount,
      })
      senderFees.assetCode = opts.assetCode
      senderFees.type = opts.type
      const coupledFeesRecord = new CoupledFeesRecord({
        destination: recipientFees,
        source: senderFees,
        assetCode: opts.assetCode,
      })
      coupledFeesRecord.setIsAnyExternalFee = {
        feeType: opts.type,
        masterAccountId: masterAccountId,
        asset: asset,
      }
      return coupledFeesRecord
    },

    async calculateSenderFees ({ accountId, type, assetCode, amount }) {
      const result = await Api.api.get(
        `/v3/accounts/${accountId}/calculated_fees`,
        {
          asset: assetCode,
          fee_type: type,
          amount: amount,
          subtype: PAYMENT_FEE_SUBTYPES.outgoing,
        }
      )
      return new FeesRecord(result.data)
    },

    async calculateRecipientFees ({ accountId, type, assetCode, amount }) {
      const result = await Api.api.get(
        `/v3/accounts/${accountId}/calculated_fees`,
        {
          asset: assetCode,
          fee_type: type,
          subtype: PAYMENT_FEE_SUBTYPES.incoming,
          amount: amount,
        }
      )
      return new FeesRecord(result.data)
    },
  },
}
