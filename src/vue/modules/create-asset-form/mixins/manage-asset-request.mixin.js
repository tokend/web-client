import { uploadDocuments } from '@/js/helpers/upload-documents'

import { base } from '@tokend/js-sdk'

import { api } from '@/api'
import config from '@/config'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

const NEW_CREATE_ASSET_REQUEST_ID = '0'
const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

export default {
  computed: {
    preIssuanceAssetSigner () {
      return this.advancedStepForm.isPreissuanceDisabled
        ? config.NULL_ASSET_SIGNER
        : this.advancedStepForm.preIssuanceAssetSigner
    },

    initialPreissuedAmount () {
      return this.advancedStepForm.isPreissuanceDisabled
        ? this.informationStepForm.maxIssuanceAmount
        : this.advancedStepForm.initialPreissuedAmount
    },

    assetRequestOpts () {
      const logo = this.informationStepForm.logo
      const terms = this.advancedStepForm.terms

      return {
        requestID: this.requestId || NEW_CREATE_ASSET_REQUEST_ID,
        code: this.informationStepForm.code,
        assetType: String(this.informationStepForm.assetType),
        preissuedAssetSigner: this.preIssuanceAssetSigner,
        trailingDigitsCount: config.DECIMAL_POINTS,
        initialPreissuedAmount: this.initialPreissuedAmount,
        maxIssuanceAmount: this.informationStepForm.maxIssuanceAmount,
        policies: this.informationStepForm.policies,
        creatorDetails: {
          name: this.informationStepForm.name,
          logo: logo ? logo.getDetailsForSave() : EMPTY_DOCUMENT,
          terms: terms ? terms.getDetailsForSave() : EMPTY_DOCUMENT,
        },
      }
    },
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

    async submitCreateAssetRequest () {
      const assetDocuments = [
        this.informationStepForm.logo,
        this.advancedStepForm.terms,
      ]
      await uploadDocuments(assetDocuments)
      const operation =
        base.ManageAssetBuilder.assetCreationRequest(this.assetRequestOpts)
      await api.postOperations(operation)
    },
  },
}
