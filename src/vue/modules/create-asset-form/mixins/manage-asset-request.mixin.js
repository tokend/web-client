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
        assetType: this.$getAssetTypeStringed(),
        maxIssuanceAmount: this.$getMaxIssuanceAmount(),
        preissuedAssetSigner: this.$getPreIssuanceAssetSigner(),
        initialPreissuedAmount: this.$getInitialPreIssuedAmount(),
        creatorDetails: {
          name: this.collectedCreateAssetAttributes.name,
          logo: this.$getDocumentDetailsOrEmptyDocument(logo),
          terms: this.$getDocumentDetailsOrEmptyDocument(terms),
          stellar: this.$getStellarIntegrationAttributes(),
        },
      }

      return base.ManageAssetBuilder.assetCreationRequest(opts)
    },

    $getAssetTypeStringed () {
      const assetType = this.collectedCreateAssetAttributes.isUsageRestricted
        ? this.collectedCreateAssetAttributes.assetType
        : store.getters[vuexTypes.kvAssetTypeDefault]

      return String(assetType)
    },

    $getMaxIssuanceAmount () {
      return this.collectedCreateAssetAttributes.isMaxAmountRestricted
        ? this.collectedCreateAssetAttributes.maxIssuanceAmount
        : config.MAX_AMOUNT
    },

    $getPreIssuanceAssetSigner () {
      return this.collectedCreateAssetAttributes.isPreIssuanceEnabled
        ? this.collectedCreateAssetAttributes.preIssuanceAssetSigner
        : config.NULL_ASSET_SIGNER
    },

    $getInitialPreIssuedAmount () {
      return this.collectedCreateAssetAttributes.isPreIssuanceEnabled
        ? this.collectedCreateAssetAttributes.initialPreissuedAmount
        : this.$getMaxIssuanceAmount()
    },

    $getStellarIntegrationAttributes () {
      return this.collectedCreateAssetAttributes.isStellarIntegrationEnabled
        ? {
          withdraw: this.collectedCreateAssetAttributes.stellar.withdraw,
          deposit: this.collectedCreateAssetAttributes.stellar.deposit,
          asset_type: this.collectedCreateAssetAttributes.stellar.assetType,
          asset_code: this.collectedCreateAssetAttributes.stellar.assetCode,
        }
        : {}
    },

    $getDocumentDetailsOrEmptyDocument (doc) {
      if (doc instanceof DocumentContainer) {
        return doc.getDetailsForSave()
      }

      return DocumentContainer.getEmptyDetailsForSave()
    },
  },
}
