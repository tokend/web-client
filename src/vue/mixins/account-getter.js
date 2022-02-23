import { api } from '@/api'
import { errors } from '@/js/errors'
import { base } from '@tokend/js-sdk'

export default {
  methods: {
    /**
     * Fetches first balance ID by account ID and asset code.
     *
     * @param {string} accountId A valid account ID
     * @param {string} assetCode A valid asset code
     * @param {*} [defaultValue] Value returned if no balance id found. If not
     * set an instance of `BalanceNotFoundError` thrown
     */
    async getBalanceId (accountId, assetCode, defaultValue) {
      if (!base.Keypair.isValidPublicKey(accountId)) {
        throw new TypeError(`getBalanceId(): 'accountId' should be a valid account id, got ${accountId}`)
      }

      if (!base.Operation.isValidAsset(assetCode)) {
        throw new TypeError(`getBalanceId(): 'assetCode' should be a valid asset code, got ${assetCode}`)
      }

      const { data: account } = await api.get(`/v3/accounts/${accountId}`, {
        include: ['balances.asset'],
      })

      const balance = account.balances
        .find(item => item.asset.id === assetCode)

      if (balance) {
        return balance.id
      } else if (defaultValue !== undefined) {
        return defaultValue
      } else {
        throw new errors.BalanceNotFoundError()
      }
    },

    /**
     * Fetches an array of balance IDs. If no balance ID found for a provided
     * account ID, the result will not contain this entry.
     *
     * @param {string[]} accountIds
     * @param {string} assetCode A valid asset code
     * @returns {string[]} array of account IDs
     */
    async getBalanceIdMass (accountIds = [], assetCode) {
      // TODO: add an ability to return objects like { accountId: result }
      // so the user can know which emails were not found

      const balanceIds = await Promise.all(
        accountIds.map(accId => this.getBalanceId(accId, assetCode, null)),
      )

      return balanceIds.filter(item => item)
    },
  },
}
