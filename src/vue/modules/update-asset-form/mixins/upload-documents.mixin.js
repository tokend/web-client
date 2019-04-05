import Vue from 'vue'

import { api } from '../_api'

import _omit from 'lodash/omit'

import { config } from '../_config'

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
      const config = await this.createDocumentAnchorConfig(type, mimeType)

      await this.uploadFile(file, _omit(config, ['id', 'url', 'type']), mimeType)
      document.setKey(config.key)
    },

    async createDocumentAnchorConfig (documentType, mimeType) {
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

    async uploadFile (file, policy, mimeType) {
      const formData = this.createFileFormData(file, policy, mimeType)

      // TODO: posting should not be on this level of abstraction
      await Vue.http.post(config().storageURL, formData)
    },

    createFileFormData (file, policy, mimeType) {
      const formData = new FormData()

      for (const key in policy) {
        // converts camelCase policy to kebab-case
        const convertedPolicy = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        formData.append(convertedPolicy, policy[key])
      }

      const blob = new Blob([file], { type: mimeType })
      formData.append('file', blob)

      return formData
    },
  },
}
