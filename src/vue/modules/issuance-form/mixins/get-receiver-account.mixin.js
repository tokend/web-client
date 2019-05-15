import { errors } from '@/js/errors'

import { email } from '@validators'
import { api } from '@/api'

export default {
  methods: {
    async getReceiverAccountId (receiver) {
      let accountId

      if (email(receiver)) {
        accountId = await this.getAccountIdByEmail(receiver)
      } else {
        accountId = receiver
      }

      return accountId
    },

    async getAccountIdByEmail (email) {
      const { data } = await api.get('/identities', {
        filter: { email },
        page: { limit: 1 },
      })

      if (data && data[0]) {
        return data[0].address
      } else {
        throw new errors.UserDoesntExistError()
      }
    },
  },
}
