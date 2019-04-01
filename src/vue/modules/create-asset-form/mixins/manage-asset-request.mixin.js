import config from '@/config'
import { base } from '@tokend/js-sdk'
import { DocumentUploader } from '@/js/helpers/document-uploader'
import { Sdk } from '@/sdk'

const ASSET_CREATION_REQUEST_ID = '0'
const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

export default {
  computed: {
    assetRequestOpts () {
      const requestId = this.request
        ? this.request.id
        : ASSET_CREATION_REQUEST_ID
      const logo = this.information.logo
      const terms = this.advanced.terms

      const preissuedAssetSigner = this.advanced.isPreissuanceDisabled
        ? config.NULL_ASSET_SIGNER
        : this.advanced.preissuedAssetSigner

      const initialPreissuedAmount = this.advanced.isPreissuanceDisabled
        ? this.information.maxIssuanceAmount
        : this.advanced.initialPreissuedAmount

      return {
        requestID: requestId,
        code: this.information.code,
        assetType: this.information.assetType.value,
        preissuedAssetSigner: preissuedAssetSigner,
        trailingDigitsCount: config.DECIMAL_POINTS,
        initialPreissuedAmount: initialPreissuedAmount,
        maxIssuanceAmount: this.information.maxIssuanceAmount,
        policies: this.information.policies.reduce((a, b) => (a | b), 0),
        creatorDetails: {
          name: this.information.name,
          logo: logo ? logo.getDetailsForSave() : EMPTY_DOCUMENT,
          terms: terms ? terms.getDetailsForSave() : EMPTY_DOCUMENT,
        },
      }
    },
  },

  methods: {
    async submitCreateAssetRequest () {
      await this.uploadDocuments()
      const operation =
          base.ManageAssetBuilder.assetCreationRequest(this.assetRequestOpts)
      await Sdk.horizon.transactions.submitOperations(operation)
    },

    async uploadDocuments () {
      const documents = [
        this.information.logo,
        this.advanced.terms,
      ]

      for (let document of documents) {
        if (document && !document.key) {
          await DocumentUploader.uploadDocument(document.getDetailsForUpload())
        }
      }
    },
  },
}
