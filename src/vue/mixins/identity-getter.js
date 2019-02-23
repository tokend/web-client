import { Api } from '@/api'
import { errors } from '@/js/errors'

export default {
  methods: {
    async getAccountIdByEmail (email) {
      const { data } = await Api.getWithSignature('identities', {
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
      const { data } = await Api.getWithSignature(`identities/${accountId}`)

      return data.email
    },
  },
}
