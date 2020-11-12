import { BLOB_TYPES } from '@tokend/js-sdk'
import { api } from '@/api'

export default {
  methods: {
    async createSaleDescriptionBlob (description, accountId) {
      const { data: blob } = await api.postWithSignature('/blobs', {
        data: {
          type: BLOB_TYPES.saleOverview,
          attributes: {
            value: JSON.stringify(description),
          },
          relationships: {
            owner: {
              data: { id: accountId },
            },
          },
        },
      })

      return blob.id
    },

    async getSaleDescription (blobId, accountId) {
      try {
        const endpoint = `/accounts/${accountId}/blobs/${blobId}`
        const { data: blob } = await api.getWithSignature(endpoint)

        return JSON.parse(blob.value)
      } catch {
        return ''
      }
    },
  },
}
