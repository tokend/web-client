import { uploadDocuments } from '@/js/helpers/upload-documents'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { base } from '@tokend/js-sdk'

import { api } from '@/api'
import config from '@/config'

import { CreateAssetRequest } from '../wrappers/create-asset-request'
import { store, vuexTypes } from '@/vuex/index'

const NEW_CREATE_ASSET_REQUEST_ID = '0'

export default {
  data () {
    return {
      collectedCreateAssetAttributes: {},
    }
  },

  methods: {
    async getCreateAssetRequestById (id, accountId) {
      const endpoint = `/v3/create_asset_requests/${id}`
      const { data: record } = await api.getWithSignature(endpoint, {
        filter: {
          requestor: accountId,
        },
        include: ['request_details'],
      })

      return new CreateAssetRequest(record)
    },

    collectAssetAttributes (newAttributes) {
      Object.assign(this.collectedCreateAssetAttributes, newAttributes)
    },

    /**
     * Submits "create asset request" operation
     * @param {string|number} requestId - request Id
     */
    async submitCreateAssetRequest (requestId) {
      const assetDocuments = [
        this.collectedCreateAssetAttributes.logo,
        this.collectedCreateAssetAttributes.terms,
      ]
      await uploadDocuments(assetDocuments)
      const operation = this.$buildAssetCreationRequestOperation(requestId)
      await api.postOperations(operation)
    },

    $buildAssetCreationRequestOperation (requestId) {
      const logo = this.collectedCreateAssetAttributes.logo
      const terms = this.collectedCreateAssetAttributes.terms

      const opts = {
        requestID: requestId ? String(requestId) : NEW_CREATE_ASSET_REQUEST_ID,
        trailingDigitsCount: config.DECIMAL_POINTS,
        code: this.collectedCreateAssetAttributes.code,
        policies: this.collectedCreateAssetAttributes.policies,
        assetType: String(store.getters[vuexTypes.kvAssetTypeDefault]),
        maxIssuanceAmount: config.MAX_AMOUNT,
        preissuedAssetSigner: config.NULL_ASSET_SIGNER,
        initialPreissuedAmount: config.MAX_AMOUNT,
        creatorDetails: {
          name: this.collectedCreateAssetAttributes.name,
          logo: this.$getDocumentDetailsOrEmptyDocument(logo),
          terms: this.$getDocumentDetailsOrEmptyDocument(terms),
          stellar: {},
        },
      }

      return base.ManageAssetBuilder.assetCreationRequest(opts)
    },

    $getDocumentDetailsOrEmptyDocument (doc) {
      if (doc instanceof DocumentContainer) {
        return doc.getDetailsForSave()
      }

      return DocumentContainer.getEmptyDetailsForSave()
    },
  },
}
