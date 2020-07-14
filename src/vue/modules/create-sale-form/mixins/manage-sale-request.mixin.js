import ManageSaleDescriptionMixin from './manage-sale-description.mixin'
import LoadAssetPairsMixin from './load-asset-pairs.mixin'
import { base, SALE_TYPES, Document } from '@tokend/js-sdk'

import { api } from '@/api'

import { CreateSaleRequest } from '../wrappers/create-sale-request'
import { DateUtil, MathUtil } from '@/js/utils'

const NEW_CREATE_SALE_REQUEST_ID = '0'
const DEFAULT_SALE_TYPE = '0'
const DEFAULT_QUOTE_ASSET_PRICE = '1'

const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

export default {
  mixins: [ManageSaleDescriptionMixin, LoadAssetPairsMixin],
  data: _ => ({
    saleDescriptionBlobId: '',
    assetPairs: [],
  }),

  computed: {
    saleRequestOpts () {
      const saleLogo = this.shortBlurbStepForm.saleLogo

      return {
        requestID: this.requestId || NEW_CREATE_SALE_REQUEST_ID,
        saleEnumType: this.informationStepForm.type,
        saleType: DEFAULT_SALE_TYPE,
        startTime: DateUtil.toTimestamp(this.informationStepForm.startTime),
        endTime: DateUtil.toTimestamp(this.informationStepForm.endTime),
        baseAsset: this.informationStepForm.baseAsset.code,
        defaultQuoteAsset: this.informationStepForm.capAsset.code,
        softCap: this.informationStepForm.softCap,
        hardCap: this.informationStepForm.hardCap,
        requiredBaseAssetForHardCap: this.informationStepForm.assetsToSell,
        quoteAssets: this.getQuoteAssets(),
        creatorDetails: {
          name: this.informationStepForm.name,
          short_description: this.shortBlurbStepForm.shortDescription,
          description: this.saleDescriptionBlobId,
          logo: saleLogo ? saleLogo.toJSON() : EMPTY_DOCUMENT,
          youtube_video_id: this.fullDescriptionStepForm.youtubeId,
        },
        saleRules: [{
          forbids: this.informationStepForm.isWhitelisted,
        }],
      }
    },
  },

  methods: {
    async getCreateSaleRequestById (id, accountId) {
      const endpoint = `/v3/create_sale_requests/${id}`
      const { data: record } = await api.getWithSignature(endpoint, {
        filter: {
          requestor: accountId,
        },
        include: ['request_details', 'request_details.default_quote_asset'],
      })

      return new CreateSaleRequest(record)
    },

    async submitCreateSaleRequest (accountId) {
      await Document.uploadDocuments([this.shortBlurbStepForm.saleLogo])
      this.saleDescriptionBlobId = await this.createSaleDescriptionBlob(
        this.fullDescriptionStepForm.description,
        accountId
      )

      await this.createBalancesIfNotExist({
        balanceAssets: this.assets.map(asset => asset.code),
        quoteAssets: this.informationStepForm.quoteAssets,
        accountId,
      })
      this.assetPairs =
        await this.loadAssetsPairsByQuote(
          this.informationStepForm.capAsset.code
        )
      const operation =
        base.SaleRequestBuilder.createSaleCreationRequest(this.saleRequestOpts)
      await api.postOperations(operation)
    },
    getQuoteAssets () {
      const basePrise = MathUtil.divide(
        this.informationStepForm.hardCap,
        this.informationStepForm.assetsToSell
      )
      return this.informationStepForm.quoteAssets.map((item) => ({
        asset: item,
        price: this.getPrice(item, basePrise),
      }))
    },

    getPrice (assetCode, basePrise) {
      let result
      const capAsset = this.informationStepForm.capAsset.code
      if (capAsset !== assetCode) {
        if (this.informationStepForm.type === SALE_TYPES.immediate) {
          let assetPair = this.assetPairs.filter(item =>
            item.baseAndQuote === `${assetCode}/${capAsset}`
          )
          result = MathUtil.divide(basePrise, assetPair[0].price)
        } else {
          result = DEFAULT_QUOTE_ASSET_PRICE
        }
      } else {
        result = basePrise
      }
      return result
    },

    async createBalancesIfNotExist ({ balanceAssets, quoteAssets, accountId }) {
      let operations = []

      for (const asset of quoteAssets) {
        if (!balanceAssets.includes(asset)) {
          operations.push(
            base.Operation.manageBalance({
              asset: asset,
              destination: accountId,
              action: base.xdr.ManageBalanceAction.createUnique(),
            })
          )
        }
      }

      if (operations.length) {
        await api.postOperations(...operations)
      }
    },
  },
}
