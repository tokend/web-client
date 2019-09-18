import AtomicSwapAskMixin from '@/vue/mixins/atomic-swap-ask.mixin'
import { uploadDocuments } from '@/js/helpers/upload-documents'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { base, ASSET_PAIR_POLICIES } from '@tokend/js-sdk'

import { api } from '@/api'
import config from '@/config'

import { CreateAssetRequest } from '../wrappers/create-asset-request'
import { mapGetters, mapActions } from 'vuex'
import { store, vuexTypes } from '@/vuex/index'

const NEW_CREATE_ASSET_REQUEST_ID = '0'

export default {
  mixins: [AtomicSwapAskMixin],
  data () {
    return {
      collectedAttributes: {},
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.businessStatsQuoteAsset,
      vuexTypes.accountId,
    ]),
  },

  methods: {
    ...mapActions([
      vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    ]),

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
      Object.assign(this.collectedAttributes, newAttributes)
    },

    /**
     * Submits "create asset request" operation
     * @param {string|number} requestId - request Id
     */
    async submitCreateAssetRequest (requestId) {
      const assetDocuments = [
        this.collectedAttributes.logo,
        this.collectedAttributes.terms,
      ]
      await uploadDocuments(assetDocuments)

      await api.postOperations(
        this.$buildAssetCreationRequestOperation(requestId),
        this.$buildPairCreationRequestOperation(),
      )

      await this.LOAD_ACCOUNT_BALANCES_DETAILS()
      await api.postOperations(
        this.$buildIssuanceCreationOperation()
      )

      if (this.collectedAttributes.isSellable) {
        await this.createAtomicSwapAsk(
          this.collectedAttributes.code,
          this.collectedAttributes.amountToSell,
          this.collectedAttributes.price,
          this.collectedAttributes.quoteAssets,
        )
      }
    },

    $buildAssetCreationRequestOperation (requestId) {
      const logo = this.collectedAttributes.logo
      const terms = this.collectedAttributes.terms

      const opts = {
        requestID: requestId ? String(requestId) : NEW_CREATE_ASSET_REQUEST_ID,
        trailingDigitsCount: config.DECIMAL_POINTS,
        code: this.collectedAttributes.code,
        policies: this.collectedAttributes.policies,
        assetType: String(store.getters[vuexTypes.kvAssetTypeDefault]),
        maxIssuanceAmount: config.MAX_AMOUNT,
        preissuedAssetSigner: config.NULL_ASSET_SIGNER,
        initialPreissuedAmount: config.MAX_AMOUNT,
        creatorDetails: {
          name: this.collectedAttributes.name,
          logo: this.$getDocumentDetailsOrEmptyDocument(logo),
          terms: this.$getDocumentDetailsOrEmptyDocument(terms),
          stellar: {},
          description: this.collectedAttributes.description,
        },
      }

      return base.ManageAssetBuilder.assetCreationRequest(opts)
    },

    $buildPairCreationRequestOperation () {
      const opts = {
        base: this.collectedAttributes.code,
        quote: this.businessStatsQuoteAsset,
        action: base.xdr.ManageAssetPairAction.create(),
        policies: +ASSET_PAIR_POLICIES.currentPriceRestriction,
        physicalPrice: '' + this.collectedAttributes.price,
        physicalPriceCorrection: '1',
        maxPriceStep: '1',
      }

      return base.Operation.manageAssetPair(opts)
    },

    $buildIssuanceCreationOperation () {
      const balance = this.accountBalanceByCode(this.collectedAttributes.code)

      const operation = base.CreateIssuanceRequestBuilder
        .createIssuanceRequest({
          asset: this.collectedAttributes.code,
          amount: config.MAX_AMOUNT,
          receiver: balance.id,
          reference: btoa(Math.random()),
          creatorDetails: {},
        })

      return operation
    },

    $getDocumentDetailsOrEmptyDocument (doc) {
      if (doc instanceof DocumentContainer) {
        return doc.getDetailsForSave()
      }

      return DocumentContainer.getEmptyDetailsForSave()
    },
  },
}
