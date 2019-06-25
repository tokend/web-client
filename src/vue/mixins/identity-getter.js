import { api } from '@/api'
import { errors } from '@/js/errors'

export default {
  methods: {
    /**
     * Fetches an account id by email
     *
     * @param {string} email
     * @param {*} defaultValue Value returned if no email found. If not set an
     * instance of `UserDoesntExistError` thrown
     */
    async getAccountIdByEmail (email, defaultValue) {
      if (typeof email !== 'string') {
        throw new Error(`getAccountIdByEmail(): 'email' arg should be a string, got ${email}`)
      }

      const { data } = await api.get('/identities', {
        filter: { email },
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

    async getAccountIdByEmailMass (emails = []) {
      // TODO: add an ability to return objects like { email: result }
      // so the user can know which emails were not found

      const accountIds = await Promise.all(
        emails.map(email => this.getAccountIdByEmail(email, null))
      )

      return accountIds.filter(item => item)
    },

    async getEmailByAccountId (accountId) {
      const { data } = await api.get('/identities', {
        filter: {
          address: accountId,
        },
        page: {
          limit: 1,
        },
      })

      if (data && data[0]) {
        return data[0].email
      } else {
        throw new errors.UserDoesntExistError()
      }
    },
  },
}
