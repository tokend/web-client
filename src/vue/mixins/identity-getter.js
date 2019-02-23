import { Api } from '@/api'
import { errors } from '@/js/errors'
import { Sdk } from '@/sdk'

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
      if (accountId === Sdk.networkDetails.adminAccountId) {
        // TODO: Move to translations
        return 'Master'
      } else {
        const { data } = await Api.getWithSignature(`identities/${accountId}`)
        return data.email
      }
    },
  },
}
