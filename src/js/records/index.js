import { REQUEST_TYPES } from '@tokend/js-sdk'

import { RequestRecord } from './request-record'
import { AssetCreateRequestRecord } from './requests/asset-create.record'
import { AssetUpdateRequestRecord } from './requests/asset-update.record'

export class RecordWrapper {
  static request (record, details) {
    switch (record.details.requestTypeI) {
      case REQUEST_TYPES.createAsset:
        return new AssetCreateRequestRecord(...arguments)
      case REQUEST_TYPES.updateAsset:
        return new AssetUpdateRequestRecord(...arguments)
      case REQUEST_TYPES.createAmlAlert:
      case REQUEST_TYPES.createWithdraw:
      case REQUEST_TYPES.updateLimit:
      case REQUEST_TYPES.createIssuance:
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
