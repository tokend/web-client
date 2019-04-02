import DocumentUploaderMixin from './document-uploader.mixin'

import { base } from '@tokend/js-sdk'

import { api } from '../_api'
import config from '../_config'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

const ASSET_CREATION_REQUEST_ID = '0'
const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

export default {
  mixins: [DocumentUploaderMixin],

  computed: {
    assetRequestOpts () {
      const logo = this.information.logo
      const terms = this.advanced.terms

      const preissuedAssetSigner = this.advanced.isPreissuanceDisabled
        ? config.NULL_ASSET_SIGNER
        : this.advanced.preissuedAssetSigner

      const initialPreissuedAmount = this.advanced.isPreissuanceDisabled
        ? this.information.maxIssuanceAmount
        : this.advanced.initialPreissuedAmount

      return {
        requestID: this.requestId || ASSET_CREATION_REQUEST_ID,
        code: this.information.code,
        assetType: this.information.assetType.value,
        preissuedAssetSigner: preissuedAssetSigner,
        trailingDigitsCount: config.DECIMAL_POINTS,
        initialPreissuedAmount: initialPreissuedAmount,
        maxIssuanceAmount: this.information.maxIssuanceAmount,
        policies: this.information.policies,
        creatorDetails: {
          name: this.information.name,
          logo: logo ? logo.getDetailsForSave() : EMPTY_DOCUMENT,
          terms: terms ? terms.getDetailsForSave() : EMPTY_DOCUMENT,
        },
      }
    },
  },

  methods: {
    async getRequestById (id) {
      const endpoint = `/v3/create_asset_requests/${id}`
      const { data: record } = await api().getWithSignature(endpoint, {
        filter: {
          requestor: this.wallet.accountId,
        },
        include: ['request_details'],
      })

      return new CreateAssetRequest(record)
    },

    async submitCreateAssetRequest () {
      await this.uploadDocuments()
      const operation =
          base.ManageAssetBuilder.assetCreationRequest(this.assetRequestOpts)
      await api().postOperations(operation)
    },

    async uploadDocuments () {
      const documents = [
        this.information.logo,
        this.advanced.terms,
      ]

      for (let document of documents) {
        if (document && !document.key) {
          await this.uploadDocument(document, this.wallet.accountId)
        }
      }
    },
  },
}
