import Vue from 'vue'

import { api } from '@/api'

import _omit from 'lodash/omit'

import config from '@/config'

export default {
  methods: {
    async uploadDocuments (documents, accountId) {
      for (const document of documents) {
        if (document && !document.key) {
          await this.uploadDocument(document, accountId)
        }
      }
    },

    async uploadDocument (document, accountId) {
      const { type, mimeType, file } = document.getDetailsForUpload()
      const config = await this.createDocumentAnchorConfig(
        type,
        mimeType,
        accountId
      )

      await this.uploadFile(file, _omit(config, ['id', 'url', 'type']), mimeType)
      document.setKey(config.key)
    },

    async createDocumentAnchorConfig (documentType, mimeType, accountId) {
      const { data: config } = await api.postWithSignature('/documents', {
        data: {
          type: documentType,
          attributes: { content_type: mimeType },
          relationships: {
            owner: {
              data: { id: accountId },
            },
          },
        },
      })

      return config
    },

    async uploadFile (file, policy, mimeType) {
      const formData = this.createFileFormData(file, policy, mimeType)

      // TODO: posting should not be on this level of abstraction
      await Vue.http.post(config.FILE_STORAGE, formData)
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
