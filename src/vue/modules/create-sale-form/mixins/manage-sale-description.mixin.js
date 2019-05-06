import { BLOB_TYPES } from '@tokend/js-sdk'
import { api } from '../_api'

export default {
  methods: {
    async createSaleDescriptionBlob (description) {
      const { data: blob } = await api().postWithSignature('/blobs', {
        data: {
          type: BLOB_TYPES.fundOverview,
          attributes: {
            value: JSON.stringify(description),
          },
          relationships: {
            owner: {
              data: { id: this.wallet.accountId },
            },
          },
        },
      })

      return blob.id
    },

    async getSaleDescription (blobId) {
      try {
        const endpoint = `/accounts/${this.wallet.accountId}/blobs/${blobId}`
        const { data: blob } = await api().getWithSignature(endpoint)

        return JSON.parse(blob.value)
      } catch {
        return ''
      }
    },
  },
}
