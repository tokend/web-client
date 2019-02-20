import { DateUtil } from '@/js/utils'
import { REQUEST_TYPES } from '@tokend/js-sdk'

import { RequestRecord } from './request-record'
import { AssetCreateRequestRecord } from './requests/asset-create.record'
import { AssetUpdateRequestRecord } from './requests/asset-update.record'
import {
  PreIssuanceCreateRequestRecord,
} from './requests/pre-issuance-create.record'
import { SaleRequestRecord } from './requests/sale-create.record'
import { UpdateKycRequestRecord } from './requests/update-kyc.record'
import {
  UpdateSaleDetailsRequestRecord,
} from './requests/update-sale-details.record'

export class RecordWrapper {
  static request (record, details) {
    switch (record.details.requestTypeI) {
      case REQUEST_TYPES.assetCreate:
        return new AssetCreateRequestRecord(...arguments)
      case REQUEST_TYPES.assetUpdate:
        return new AssetUpdateRequestRecord(...arguments)
      case REQUEST_TYPES.preIssuanceCreate:
        return new PreIssuanceCreateRequestRecord(...arguments)
      case REQUEST_TYPES.sale:
        return new SaleRequestRecord(...arguments)
      case REQUEST_TYPES.updateKyc:
        return new UpdateKycRequestRecord(...arguments)
      case REQUEST_TYPES.updateSaleDetail:
        return new UpdateSaleDetailsRequestRecord(...arguments)
      case REQUEST_TYPES.amlAlert:
      case REQUEST_TYPES.withdraw:
      case REQUEST_TYPES.limitsUpdate:
      case REQUEST_TYPES.issuanceCreate:
      case REQUEST_TYPES.twoStepWithdrawal:
      default:
        return new RequestRecord(...arguments)
    }
  }
}

/**
 * Unwraps opts from record needed for specific operation. Helper is used
 * primarily to avoid code duplication when the same operation is being crafted
 * > 1 times so we won't need to compose the bunch of params every time we craft
 * it.
 */
export class RecordUnwrapper {
  static opts (record) {
    switch (record.constructor) {
      case SaleRequestRecord:
        return {
          requestID: record.id,
          baseAsset: record.baseAsset,
          defaultQuoteAsset: record.defaultQuoteAsset,
          startTime: DateUtil.toTimestamp(record.startTime),
          endTime: DateUtil.toTimestamp(record.endTime),
          softCap: record.softCap,
          hardCap: record.hardCap,
          saleState: record.saleState,
          baseAssetForHardCap: record.baseAssetForHardCap,
          details: {
            name: record.name,
            short_description: record.shortDescription,
            description: record.description,
            logo: record.logo,
          },
          quoteAssets: record.quoteAssets.map(asset => ({ asset, price: '1' })),
          saleType: record.saleType,
        }
      case AssetCreateRequestRecord:
        return {
          requestID: record.id,
          code: record.assetCode,
          preissuedAssetSigner: record.preissuedAssetSigner,
          maxIssuanceAmount: record.maxIssuanceAmount,
          policies: record.policy,
          initialPreissuedAmount: record.initialPreissuedAmount,
          details: {
            name: record.assetName,
            logo: {
              key: record.logoKey,
              name: record.logoName,
              type: record.logoType,
            },
            terms: {
              key: record.termsKey,
              name: record.termsName,
              type: record.termsType,
            },
          },
        }
      default:
        throw new Error('No unwrapping logic for such type of record')
    }
  }
}
