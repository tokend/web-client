import GetReceiverAccountMixin from './get-receiver-account.mixin'

import { base } from '@tokend/js-sdk'
import { api } from '@/api'

import { errors } from '@/js/errors'

export default {
  mixins: [GetReceiverAccountMixin],

  methods: {
    async createIssuance () {
      const receiverAccountId = await this.getReceiverAccountId(
        this.form.receiver
      )
      const receiverBalanceId = await this.getReceiverBalanceId(
        receiverAccountId,
        this.form.asset.code
      )

      if (receiverBalanceId) {
        await this.postIssuanceOperation(receiverBalanceId)
      } else {
        throw new errors.BalanceNotFoundError()
      }
    },

    async getReceiverBalanceId (receiverAccountId, assetCode) {
      const endpoint = `/v3/accounts/${receiverAccountId}`
      const { data: account } = await api.get(endpoint, {
        include: ['balances.asset'],
      })

      const balance = account.balances
        .find(item => item.asset.id === assetCode)

      return balance ? balance.id : ''
    },

    async postIssuanceOperation (receiverBalanceId) {
      const operation = base.CreateIssuanceRequestBuilder
        .createIssuanceRequest({
          asset: this.form.asset.code,
          amount: this.form.amount.toString(),
          receiver: receiverBalanceId,
          reference: this.form.reference,
          creatorDetails: {},
        })

      await api.postOperations(operation)
    },
  },
}
