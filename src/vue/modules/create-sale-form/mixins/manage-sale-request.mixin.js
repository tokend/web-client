import UploadDocumentsMixin from './upload-documents.mixin'
import ManageSaleDescriptionMixin from './manage-sale-description.mixin'

import { base, SALE_TYPES } from '@tokend/js-sdk'

import { api } from '@/api'
import { config } from '../_config'

import { CreateSaleRequest } from '../wrappers/create-sale-request'
import { DateUtil } from '@/js/utils'

const NEW_CREATE_SALE_REQUEST_ID = '0'
const DEFAULT_SALE_TYPE = '0'
const DEFAULT_QUOTE_ASSET_PRICE = '1'

const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

export default {
  mixins: [UploadDocumentsMixin, ManageSaleDescriptionMixin],
  data: _ => ({
    saleDescriptionBlobId: '',
  }),

  computed: {
    saleRequestOpts () {
      const saleLogo = this.shortBlurbStepForm.saleLogo

      return {
        requestID: this.requestId || NEW_CREATE_SALE_REQUEST_ID,
        saleEnumType: SALE_TYPES.fixedPrice,
        saleType: DEFAULT_SALE_TYPE,
        startTime: DateUtil.toTimestamp(this.informationStepForm.startTime),
        endTime: DateUtil.toTimestamp(this.informationStepForm.endTime),
        baseAsset: this.informationStepForm.baseAsset.code,
        defaultQuoteAsset: config().DEFAULT_QUOTE_ASSET,
        softCap: this.informationStepForm.softCap,
        hardCap: this.informationStepForm.hardCap,
        requiredBaseAssetForHardCap: this.informationStepForm.assetsToSell,
        quoteAssets: this.informationStepForm.quoteAssets
          .map((item) => ({
            asset: item,
            price: DEFAULT_QUOTE_ASSET_PRICE,
          })),
        creatorDetails: {
          name: this.informationStepForm.name,
          short_description: this.shortBlurbStepForm.shortDescription,
          description: this.saleDescriptionBlobId,
          logo: saleLogo ? saleLogo.getDetailsForSave() : EMPTY_DOCUMENT,
          youtube_video_id: this.fullDescriptionStepForm.youtubeId,
        },
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
