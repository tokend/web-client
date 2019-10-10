import { base } from '@tokend/js-sdk'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import { api } from '@/api'
import { uploadDocuments } from '@/js/helpers/upload-documents'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'

const NEW_UPDATE_ASSET_REQUEST_ID = '0'
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
        : NEW_UPDATE_ASSET_REQUEST_ID
      const assetCode = this.request
        ? this.request.code
        : this.assetCode

      const logo = this.informationStepForm.logo
      const terms = this.advancedStepForm.terms

      return {
        requestID: requestId,
        code: assetCode,
        policies: this.informationStepForm.policies,
        creatorDetails: {
          name: this.informationStepForm.name,
          logo: logo ? logo.getDetailsForSave() : EMPTY_DOCUMENT,
          terms: terms ? terms.getDetailsForSave() : EMPTY_DOCUMENT,
          stellar: this.stellarInfo(),
          erc20: this.erc20Info(),
        },
      }
    },
  },

  methods: {
    async getUpdateAssetRequestById (id, accountId) {
      const endpoint = `/v3/update_asset_requests/${id}`
      const { data: record } = await api.getWithSignature(endpoint, {
        filter: {
          requestor: accountId,
        },
        include: ['request_details'],
      })

      return new UpdateAssetRequest(record)
    },

    async getUpdatableRequest (assetCode, accountId) {
      const pendingRequest = await this.getLatestUpdateAssetRequest(
        REQUEST_STATES.pending,
        accountId,
        assetCode
      )
      const rejectedRequest = await this.getLatestUpdateAssetRequest(
        REQUEST_STATES.rejected,
        accountId,
        assetCode
      )

      return pendingRequest || rejectedRequest
    },

    async getLatestUpdateAssetRequest (requestState, accountId, assetCode) {
      const endpoint = '/v3/update_asset_requests'
      const { data: requests } = await api.getWithSignature(endpoint, {
        page: {
          limit: 1,
          order: 'desc',
        },
        filter: {
          requestor: accountId,
          state: requestState,
          'request_details.asset': assetCode,
        },
        include: ['request_details'],
      })

      return requests.length ? new UpdateAssetRequest(requests[0]) : null
    },

    async submitUpdateAssetRequest () {
      const assetDocuments = [
        this.informationStepForm.logo,
        this.advancedStepForm.terms,
      ]
      await uploadDocuments(assetDocuments)

      const operation =
        base.ManageAssetBuilder.assetUpdateRequest(this.assetRequestOpts)
      await api.postOperations(operation)
    },

    stellarInfo () {
      return this.advancedStepForm.isStellarIntegrationEnabled
        ? {
          withdraw: this.advancedStepForm.stellar.withdraw,
          deposit: this.advancedStepForm.stellar.deposit,
          asset_type: this.advancedStepForm.stellar.assetType,
          asset_code: this.advancedStepForm.stellar.assetCode,
        }
        : {}
    },
    erc20Info () {
      return this.advancedStepForm.isErc20IntegrationEnabled
        ? {
          withdraw: this.advancedStepForm.erc20.withdraw,
          deposit: this.advancedStepForm.erc20.deposit,
          address: this.advancedStepForm.erc20.address,
        }
        : {}
    },
  },
}
