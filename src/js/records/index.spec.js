import assetCreateRecordJSON from '@/test/mocks/asset-create'
import { MockWrapper } from '../../test/index'
import {
  RecordWrapper,
  RecordUnwrapper
} from './index'

import { AssetCreateRequestRecord } from './requests/asset-create.record'
import { AssetUpdateRequestRecord } from './requests/asset-update.record'
import { SaleRequestRecord } from './requests/sale-create.record'
import {
  UpdateSaleDetailsRequestRecord
} from './requests/update-sale-details.record'
import { UpdateKycRequestRecord } from './requests/update-kyc.record'

import assetUpdateJSON from '../../test/mocks/asset-update'
import assetCreateJSON from '../../test/mocks/asset-create'
import saleCreateJSON from '../../test/mocks/sale-create'
import updateSaleDetailsJSON from '../../test/mocks/update-sale-details'
import updateKycJSON from '../../test/mocks/update-kyc'

describe('Record wrapper', () => {
  const test = (request, constructor) => {
    const response = MockWrapper.makeHorizonData(request)
    const parsed = RecordWrapper.request(response)
    expect(parsed).to.be.instanceOf(constructor)
  }

  it('should properly define asset_create request', () => {
    test(assetCreateJSON, AssetCreateRequestRecord)
  })

  it('should properly define asset_update request', () => {
    test(assetUpdateJSON, AssetUpdateRequestRecord)
  })

  it('should properly define sale request', () => {
    test(saleCreateJSON, SaleRequestRecord)
  })

  it('should properly define update_sale_details request', () => {
    test(updateSaleDetailsJSON, UpdateSaleDetailsRequestRecord)
  })

  it('should properly define update_kyc request', () => {
    test(updateKycJSON, UpdateKycRequestRecord)
  })
})

describe('Record unwrapper opts() method should return proper data', () => {
  describe('AssetCreateRequestRecord opts are being unwrapped properly', () => {
    let opts

    const getOpts = (rawJSON) => {
      const sdkResponse = MockWrapper.makeHorizonData(rawJSON)
      const record = new AssetCreateRequestRecord(sdkResponse)

      return RecordUnwrapper.opts(record)
    }

    const setPolicies = (rawJSON, policies) => {
      rawJSON.details.asset_create.policies = policies
        .map(p => ({
          value: p,
          name: 'SomePolicyNameWeDoNotInterestedIn'
        }))

      return rawJSON
    }

    beforeEach(() => {
      opts = getOpts(assetCreateJSON)
    })

    it('requestID', () => {
      expect(opts.requestID)
        .to
        .equal(
          assetCreateRecordJSON.id
        )
    })

    it('code', () => {
      expect(opts.code)
        .to
        .equal(
          assetCreateRecordJSON.details.asset_create.code
        )
    })

    it('initialPreissuedAmount', () => {
      expect(opts.initialPreissuedAmount)
        .to
        .equal(
          assetCreateJSON.details.asset_create.initial_preissued_amount
        )
    })

    it('preissuedAssetSigner', () => {
      expect(opts.preissuedAssetSigner)
        .to
        .equal(
          assetCreateJSON.details.asset_create.pre_issued_asset_signer
        )
    })

    it('maxIssuanceAmount', () => {
      expect(opts.maxIssuanceAmount)
        .to
        .equal(
          assetCreateJSON.details.asset_create.max_issuance_amount
        )
    })

    it('name', () => {
      expect(opts.details.name)
        .to
        .equal(
          assetCreateJSON.details.asset_create.details.name
        )
    })

    it('policies', () => {
      const expectedPolicy = 7

      const rawJSON = setPolicies(assetCreateJSON, [1, 2, 4])
      const opts = getOpts(rawJSON)

      expect(opts.policies).to.equal(expectedPolicy)
    })

    it('logo', () => {
      expect(opts.details.logo.key)
        .to
        .equal(
          assetCreateJSON.details.asset_create.details.logo.key
        )

      expect(opts.details.logo.type)
        .to
        .equal(
          assetCreateJSON.details.asset_create.details.logo.type
        )

      expect(opts.details.logo.name)
        .to
        .equal(
          assetCreateJSON.details.asset_create.details.logo.name
        )
    })

    it('terms', () => {
      expect(opts.details.terms.key)
        .to
        .equal(
          assetCreateJSON.details.asset_create.details.terms.key
        )

      expect(opts.details.terms.type)
        .to
        .equal(
          assetCreateJSON.details.asset_create.details.terms.type
        )

      expect(opts.details.terms.name)
        .to
        .equal(
          assetCreateJSON.details.asset_create.details.terms.name
        )
    })
  })

  describe('SaleCreateRequestRecord opts are being unwrapped properly', () => {
    let opts

    const getOpts = (rawJSON) => {
      const sdkResponse = MockWrapper.makeHorizonData(rawJSON)
      const record = new SaleRequestRecord(sdkResponse)

      return RecordUnwrapper.opts(record)
    }

    const setStartTime = (rawJSON, time) => {
      rawJSON.details.sale.start_time = time

      return rawJSON
    }

    const setEndTime = (rawJSON, time) => {
      rawJSON.details.sale.end_time = time

      return rawJSON
    }

    const setSaleType = (rawJSON, type) => {
      rawJSON.details.sale.sale_type = type

      return rawJSON
    }

    const setQuoteAssets = (rawJSON, assets) => {
      rawJSON.details.sale.quote_assets = assets

      return rawJSON
    }

    beforeEach(() => {
      opts = getOpts(saleCreateJSON)
    })

    it('requestID', () => {
      expect(opts.requestID)
        .to
        .equal(saleCreateJSON.id)
    })

    it('baseAsset', () => {
      expect(opts.baseAsset)
        .to
        .equal(saleCreateJSON.details.sale.base_asset)
    })

    it('defaultQuoteAsset', () => {
      expect(opts.defaultQuoteAsset)
        .to
        .equal(saleCreateJSON.details.sale.default_quote_asset)
    })

    it('startTime', () => {
      const time = '2018-06-19T21:00:00Z'
      const expectedResult = '1529442000'
      const rawJSON = setStartTime(saleCreateJSON, time)
      const opts = getOpts(rawJSON)

      expect(opts.startTime).to.equal(expectedResult)
    })

    it('endTime', () => {
      const time = '2018-06-29T21:00:00Z'
      const expectedResult = '1530306000'

      const rawJSON = setEndTime(saleCreateJSON, time)
      const opts = getOpts(rawJSON)

      expect(opts.endTime).to.equal(expectedResult)
    })

    it('softCap', () => {
      expect(opts.softCap)
        .to
        .equal(saleCreateJSON.details.sale.soft_cap)
    })

    it('hardCap', () => {
      expect(opts.hardCap)
        .to
        .equal(saleCreateJSON.details.sale.hard_cap)
    })

    it('baseAssetForHardCap', () => {
      expect(opts.baseAssetForHardCap)
        .to
        .equal(saleCreateJSON.details.sale.base_asset_for_hard_cap)
    })

    it('saleStaten', () => {
      expect(opts.saleState)
        .to
        .equal(saleCreateJSON.details.sale.state.value)
    })

    it('details.name', () => {
      expect(opts.details.name)
        .to
        .equal(saleCreateJSON.details.sale.details.name)
    })

    it('details.short_description', () => {
      expect(opts.details.short_description)
        .to
        .equal(saleCreateJSON.details.sale.details.short_description)
    })

    it('details.description', () => {
      expect(opts.details.description)
        .to
        .equal(saleCreateJSON.details.sale.details.description)
    })

    it('quoteAssets', () => {
      const quoteAssets = [
        { quote_asset: 'ETH', price: '1.000000' },
        { quote_asset: 'DAI', price: '1.000000' }
      ]

      const expectedResult = [
        { asset: 'ETH', price: '1' },
        { asset: 'DAI', price: '1' }
      ]

      const rawJSON = setQuoteAssets(saleCreateJSON, quoteAssets)
      const opts = getOpts(rawJSON)

      expect(opts.quoteAssets)
        .to
        .deep
        .equal(expectedResult)
    })

    it('saleType', () => {
      const value = { name: 'fixed_price', value: 3 }
      const expectedResult = 3

      const rawJSON = setSaleType(saleCreateJSON, value)
      const opts = getOpts(rawJSON)

      expect(opts.saleType).to.equal(expectedResult)
    })

    it('logo', () => {
      expect(opts.details.logo.key)
        .to
        .equal(saleCreateJSON.details.sale.details.logo.key)

      expect(opts.details.logo.type)
        .to
        .equal(saleCreateJSON.details.sale.details.logo.type)

      expect(opts.details.logo.name)
        .to
        .equal(saleCreateJSON.details.sale.details.logo.name)
    })
  })
})
