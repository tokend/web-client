import { Api } from '@/api'
import { errors } from '@/js/errors'

export default {
  methods: {
    async getAccountIdByEmail (email) {
      const { data } = await Api.api.get('/identities', {
        filter: {
          email: email,
        },
        page: {
          limit: 1,
        },
      })

      if (data && data[0]) {
        return data[0].id
      } else {
        throw new errors.UserDoesntExistError()
      }
    },
    async getEmailByAccountId (accountId) {
      const { data } = await Api.api.get('/identities', {
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
