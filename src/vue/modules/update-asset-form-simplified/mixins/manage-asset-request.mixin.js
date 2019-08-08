import { base, ASSET_PAIR_POLICIES } from '@tokend/js-sdk'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import { api } from '@/api'
import { uploadDocuments } from '@/js/helpers/upload-documents'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/index'
import { amountToPrecision } from '@/js/helpers/amount'

const NEW_UPDATE_ASSET_REQUEST_ID = '0'

export default {
  data () {
    return {
      collectedAttributes: {},
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.statsQuoteAsset,
    ]),
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

    async submitUpdateAssetRequest (requestId) {
      const assetDocuments = [
        this.collectedAttributes.logo,
        this.collectedAttributes.terms,
      ]
      await uploadDocuments(assetDocuments)

      await api.postOperations(
        this.$buildAssetUpdateRequestOperation(requestId),
        this.$buildPairUpdateRequestOperation()
      )
    },

    $buildAssetUpdateRequestOperation (requestId) {
      const logo = this.collectedAttributes.logo
      const terms = this.collectedAttributes.terms

      const opts = {
        requestID: requestId ? String(requestId) : NEW_UPDATE_ASSET_REQUEST_ID,
        code: this.collectedAttributes.code,
        policies: this.collectedAttributes.policies,
        creatorDetails: {
          name: this.collectedAttributes.name,
          logo: this.$getDocumentDetailsOrEmptyDocument(logo),
          terms: this.$getDocumentDetailsOrEmptyDocument(terms),
          description: this.collectedAttributes.description,
          stellar: {},
        },
      }

      return base.ManageAssetBuilder.assetUpdateRequest(opts)
    },

    collectAssetAttributes (newAttributes) {
      Object.assign(this.collectedAttributes, newAttributes)
    },

    $getDocumentDetailsOrEmptyDocument (doc) {
      if (doc instanceof DocumentContainer) {
        return doc.getDetailsForSave()
      }

      return DocumentContainer.getEmptyDetailsForSave()
    },

    async getAssetPairPrice (assetCode) {
      const endpoint = `/v3/asset_pairs/${assetCode}:${this.statsQuoteAsset.code}`
      const { data } = await api.getWithSignature(endpoint)
      return amountToPrecision(data.price, this.statsQuoteAsset.trailingDigits)
    },

    $buildPairUpdateRequestOperation () {
      let action
      if (this.isNeedCreateAssetPair) {
        action = base.xdr.ManageAssetPairAction.create()
      } else {
        action = base.xdr.ManageAssetPairAction.updatePrice()
      }
      const opts = {
        base: this.collectedAttributes.code,
        quote: this.statsQuoteAsset.code,
        action: action,
        policies: +ASSET_PAIR_POLICIES.currentPriceRestriction,
        physicalPrice: '' + this.collectedAttributes.price,
        physicalPriceCorrection: '1',
        maxPriceStep: '1',
      }

      return base.Operation.manageAssetPair(opts)
    },
  },
}
