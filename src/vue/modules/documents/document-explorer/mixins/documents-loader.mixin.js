
import { Document } from '../wrappers/document'
import { ChangeRoleRequest } from '../wrappers/change-role-request'

import { api } from '@/api'
import moment from 'moment'

export default {
  methods: {
    async loadPublicKeyEntries (accountId) {
      const endpoint = `/v3/public_key_entries/${accountId}`
      const { data } = await api.getWithSignature(endpoint)

      return data.accounts.filter(item => item.id !== accountId)
    },

    async getDocumentsByAccountIds (accounts) {
      const documents = []

      await Promise.all(accounts.map(async account => {
        const changeRoleRequest = await this.getChangeRoleRequest(account.id)
        if (!changeRoleRequest) {
          // The doc is broken and we should skip it
          return
        }

        const blob = await this.getBlobById(
          changeRoleRequest.blobId,
          account.id
        )

        documents.push(new Document(account.id, changeRoleRequest, blob))
      }))

      return documents
        .slice()
        .sort(
          (a, b) => moment(a.createdAt).isBefore(moment(b.createdAt))
            ? 1
            : -1
        )
    },

    async getChangeRoleRequest (accountId) {
      const limit = 1
      const order = 'desc'
      const endpoint = '/v3/change_role_requests'

      const { data } = await api.getWithSignature(endpoint, {
        filter: {
          requestor: accountId,
        },
        page: {
          limit,
          order,
        },
        include: ['request_details'],
      })

      if (!data[0]) {
        return null
      }

      return new ChangeRoleRequest(data[0])
    },

    async getBlobById (blobId, accountId) {
      const endpoint = `/accounts/${accountId}/blobs/${blobId}`
      const { data: blob } = await api.getWithSignature(endpoint)

      return blob
    },
  },
}
