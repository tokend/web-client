import Vue from 'vue'

import { api } from '../_api'

import _omit from 'lodash/omit'

export default {
  methods: {
    async uploadDocuments (documents) {
      for (const document of documents) {
        if (document && !document.key) {
          await this.uploadDocument(document)
        }
      }
    },

    async uploadDocument (document) {
      const { type, mimeType, file } = document.getDetailsForUpload()
      const config = await this.getDocumentTypeConfig(type, mimeType)

      await this.uploadFile(file, _omit(config, ['id', 'url', 'type']), mimeType)
      document.setKey(config.key)

      return document.key
    },

    async getDocumentTypeConfig (documentType, mimeType) {
      const { data: config } = await api().postWithSignature('/documents', {
        data: {
          type: documentType,
          attributes: { content_type: mimeType },
          relationships: {
            owner: {
              data: { id: this.wallet.accountId },
            },
          },
        },
      })

      return config
    },

    uploadFile (file, policy, mimeString) {
      const formData = new FormData()

      for (const key in policy) {
        // converts camelCase policy to kebab-case
        const convertedPolicy = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        formData.append(convertedPolicy, policy[key])
      }
      const blob = new Blob([file], { type: mimeString })
      formData.append('file', blob)

      // TODO: posting should not be on this lvl of abstraction
      return Vue.http.post(this.config.storageURL, formData)
    },
  },
}
