import { api } from '../_api'

import { base } from '@tokend/js-sdk'

const ACCOUNT_ROLE_ID = '1'
const SIGNER_WEIGHT = '1000'
const SIGNER_IDENTITY = '1'

const CHANGE_ROLE_REQUEST_ID = '0'
const ACCOUNT_ROLE_TO_SET = '2'

const BLOB_TYPE = 'kyc_form'

export default {
  data: _ => ({
    documentAccountId: '',
  }),

  methods: {
    async createAccount (id) {
      const operation = base.CreateAccountBuilder.createAccount({
        destination: id,
        roleID: ACCOUNT_ROLE_ID,
        signersData: [{
          roleID: ACCOUNT_ROLE_ID,
          publicKey: this.wallet.accountId,
          weight: SIGNER_WEIGHT,
          identity: SIGNER_IDENTITY,
          details: {},
        }],
      })

      await api().postOperations(operation)

      this.documentAccountId = id
    },

    async createChangeRoleRequest (blobId) {
      const operation = base.CreateChangeRoleRequestBuilder
        .createChangeRoleRequest({
          requestID: CHANGE_ROLE_REQUEST_ID,
          destinationAccount: this.documentAccountId,
          accountRoleToSet: ACCOUNT_ROLE_TO_SET,
          creatorDetails: {
            blob_id: blobId,
          },
        })

      await api().postOperations(operation)
    },

    async createBlob (details) {
      const endpoint = `/accounts/${this.wallet.accountId}/blobs`
      const { data } = await api().postWithSignature(endpoint, {
        data: {
          type: BLOB_TYPE,
          attributes: {
            value: JSON.stringify(details),
          },
        },
      })

      return data.id
    },
  },
}
