import { api } from '@/api'
import { errors } from '@/js/errors'
import AccountGetterMixin from './account-getter'

export default {
  mixins: [AccountGetterMixin],

  methods: {
    /**
     * Fetches an account id by email
     *
     * @param {string} email
     * @param {*} [defaultValue] Value returned if no email found. If not set an
     * instance of `UserDoesntExistError` thrown
     */
    async getAccountIdByEmail (email, defaultValue) {
      if (typeof email !== 'string') {
        throw new TypeError(`getAccountIdByEmail(): 'email' arg should be a string, got ${email}`)
      }

      const { data } = await api.get('/identities', {
        filter: { email: email.toLowerCase() },
        page: { limit: 1 },
      })

      if (data && data[0]) {
        return data[0].address
      } else if (defaultValue !== undefined) {
        return defaultValue
      } else {
        throw new errors.UserDoesntExistError()
      }
    },

    /**
     * Fetches an array of account IDs. If no account ID found for a provided
     * email, the result will not contain this entry.
     *
     * @param {string[]} emails
     * @returns {string[]} array of account IDs
     */
    async getAccountIdByEmailMass (emails = []) {
      // TODO: add an ability to return objects like { email: result }
      // so the user can know which emails were not found

      const accountIds = await Promise.all(
        emails.map(email => this.getAccountIdByEmail(email, null))
      )

      return accountIds.filter(item => item)
    },

    /**
     * Fetches first balance ID of asset code of account with the provided email
     *
     * @param {string} email
     * @param {string} assetCode A valid asset code
     * @param {*} [defaultValue] Value returned if no balance ID found.
     * If not set an instance of `BalanceNotFoundError` or
     * `UserDoesntExistError` thrown
     */
    async getBalanceIdByEmail (email, assetCode, defaultValue) {
      const accId = await this.getAccountIdByEmail(email, defaultValue)
      const balId = await this.getBalanceId(accId, assetCode, defaultValue)
      return balId
    },

    /**
     * Fetches an array of balance IDs. If no balance ID found for a provided
     * email, the result will not contain this entry.
     *
     * @param {string[]} emails
     * @param {string} assetCode A valid asset code
     * @returns {string[]} array of account IDs
     */
    async getBalanceIdByEmailMass (emails, assetCode) {
      const accIds = await this.getAccountIdByEmailMass(emails)
      const balIds = await this.getBalanceIdMass(accIds, assetCode)
      return balIds
    },

    async getEmailByAccountId (accountId) {
      const { data } = await api.get('/identities', {
        filter: { address: accountId },
        page: { limit: 1 },
      })

      if (data && data[0]) {
        return data[0].email
      } else {
        throw new errors.UserDoesntExistError()
      }
    },

    async getPhoneByAccountId (accountId) {
      const { data } = await api.get('/identities', {
        filter: { address: accountId },
        page: { limit: 1 },
      })

      if (data && data[0]) {
        return data[0].phoneNumber
      } else {
        throw new errors.UserDoesntExistError()
      }
    },
  },
}
