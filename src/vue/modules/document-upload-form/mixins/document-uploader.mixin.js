import Vue from 'vue'

import { config } from '../_config'
import { api } from '../_api'

export default {
  methods: {
    async uploadDocument (document, accountId) {
      const { type, mimeType, file } = document.getDetailsForUpload()
      const { data: config } = await api().postWithSignature(
        `/accounts/${accountId}/documents`,
        {
          data: {
            type,
            attributes: { content_type: mimeType },
          },
        }
      )

      await this.uploadFile(file, config, mimeType)
      document.setKey(config.key)

      return document.key
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
      return Vue.http.post(config().storageURL, formData)
    },
  },
}
