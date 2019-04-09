import UploadDocumentsMixin from './upload-documents.mixin'
import ManageSaleDescriptionMixin from './manage-sale-description.mixin'

import { base, SALE_TYPES } from '@tokend/js-sdk'

import { api } from '../_api'
import { config } from '../_config'

import { CreateSaleRequest } from '../wrappers/create-sale-request'
import { DateUtil } from '@/js/utils'

const NEW_CREATE_SALE_REQUEST_ID = '0'
const DEFAULT_SALE_TYPE = '0'
const DEFAULT_QUOTE_ASSET_PRICE = '1'

export default {
  mixins: [UploadDocumentsMixin, ManageSaleDescriptionMixin],
  data: _ => ({
    saleDescriptionBlobId: '',
  }),

  computed: {
    saleRequestOpts () {
      return {
        requestID: this.requestId || NEW_CREATE_SALE_REQUEST_ID,
        baseAsset: this.informationStepForm.baseAsset.code,
        defaultQuoteAsset: config().DEFAULT_QUOTE_ASSET,
        startTime: DateUtil.toTimestamp(this.informationStepForm.startTime),
        endTime: DateUtil.toTimestamp(this.informationStepForm.endTime),
        softCap: this.informationStepForm.softCap,
        hardCap: this.informationStepForm.hardCap,
        creatorDetails: {
          name: this.informationStepForm.name,
          short_description: this.shortBlurbStepForm.shortDescription,
          description: this.saleDescriptionBlobId,
          logo: this.shortBlurbStepForm.saleLogo.getDetailsForSave(),
          youtube_video_id: this.fullDescriptionStepForm.youtubeId,
        },
        requiredBaseAssetForHardCap: this.informationStepForm.assetsToSell,
        quoteAssets: this.informationStepForm.quoteAssets
          .map((item) => ({
            asset: item,
            price: DEFAULT_QUOTE_ASSET_PRICE,
          })),
        saleEnumType: SALE_TYPES.fixedPrice,
        saleType: DEFAULT_SALE_TYPE,
      }
    },
  },

  methods: {
    async getCreateSaleRequestById (id) {
      const endpoint = `/v3/create_sale_requests/${id}`
      const { data: record } = await api().getWithSignature(endpoint, {
        filter: {
          requestor: this.wallet.accountId,
        },
        include: ['request_details', 'request_details.default_quote_asset'],
      })

      return new CreateSaleRequest(record)
    },

    async submitCreateSaleRequest () {
      const saleDocuments = [
        this.shortBlurbStepForm.saleLogo,
      ]
      await this.uploadDocuments(saleDocuments)
      this.saleDescriptionBlobId = await this.createSaleDescriptionBlob(
        this.fullDescriptionStepForm.description
      )

      const operation =
        base.SaleRequestBuilder.createSaleCreationRequest(this.saleRequestOpts)
      await api().postOperations(operation)
    },
  },
}
