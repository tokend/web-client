import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { getAccountIdByIdentifier } from '@/js/helpers/identity-helper'

import AccountGetterMixin from './account-getter'

export default {
  mixins: [AccountGetterMixin],

  computed: {
    ...mapGetters([
      vuexTypes.emailByAccountId,
    ]),
  },
  methods: {
    ...mapActions([
      vuexTypes.LOAD_IDENTITIES_BY_ACCOUNT_ID,
    ]),
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
        emails.map(email => this.getAccountIdByIdentifier(email, null))
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
      const accId = await this.getAccountIdByIdentifier(email, defaultValue)
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
      if (this.emailByAccountId(accountId)) {
        return this.emailByAccountId(accountId)
      } else {
        await this.LOAD_IDENTITIES_BY_ACCOUNT_ID(accountId)
        return this.emailByAccountId(accountId)
      }
    },

    getAccountIdByIdentifier,
  },
}
