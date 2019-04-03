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
    preissuedAssetSigner () {
      return this.advanced.isPreissuanceDisabled
        ? config.NULL_ASSET_SIGNER
        : this.advanced.preissuedAssetSigner
    },

    initialPreissuedAmount () {
      return this.advanced.isPreissuanceDisabled
        ? this.information.maxIssuanceAmount
        : this.advanced.initialPreissuedAmount
    },

    assetRequestOpts () {
      const logo = this.information.logo
      const terms = this.advanced.terms

      return {
        requestID: this.requestId || ASSET_CREATION_REQUEST_ID,
        code: this.information.code,
        assetType: String(this.information.assetType.value),
        preissuedAssetSigner: this.preissuedAssetSigner,
        trailingDigitsCount: config.DECIMAL_POINTS,
        initialPreissuedAmount: this.initialPreissuedAmount,
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
    async getCreateAssetRequestById (id) {
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
      const assetDocuments = [
        this.information.logo,
        this.advanced.terms,
      ]
      await this.uploadDocuments(assetDocuments)

      const operation =
          base.ManageAssetBuilder.assetCreationRequest(this.assetRequestOpts)
      await api().postOperations(operation)
    },
  },
}
