import { MockWrapper } from '../../test/index'
import {
  RecordWrapper,
  RecordUnwrapper,
} from './index'

import { AssetCreateRequestRecord } from './requests/asset-create.record'
import { AssetUpdateRequestRecord } from './requests/asset-update.record'

import assetUpdateJSON from '../../test/mocks/asset-update'
import assetCreateJSON from '../../test/mocks/asset-create'

describe('Record wrapper', () => {
  const test = (request, constructor) => {
    const response = MockWrapper.makeHorizonData(request)
    const parsed = RecordWrapper.request(response)
    expect(parsed).to.be.instanceOf(constructor)
  }

  it('should properly define create_asset request', () => {
    test(assetCreateJSON, AssetCreateRequestRecord)
  })

  it('should properly define asset_update request', () => {
    test(assetUpdateJSON, AssetUpdateRequestRecord)
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
      rawJSON.details.create_asset.policies = policies
        .map(p => ({
          value: p,
          name: 'SomePolicyNameWeDoNotInterestedIn',
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
          assetCreateJSON.id
        )
    })

    it('code', () => {
      expect(opts.code)
        .to
        .equal(
          assetCreateJSON.details.create_asset.code
        )
    })

    it('initialPreissuedAmount', () => {
      expect(opts.initialPreissuedAmount)
        .to
        .equal(
          assetCreateJSON.details.create_asset.initial_preissued_amount
        )
    })

    it('preissuedAssetSigner', () => {
      expect(opts.preissuedAssetSigner)
        .to
        .equal(
          assetCreateJSON.details.create_asset.pre_issued_asset_signer
        )
    })

    it('maxIssuanceAmount', () => {
      expect(opts.maxIssuanceAmount)
        .to
        .equal(
          assetCreateJSON.details.create_asset.max_issuance_amount
        )
    })

    it('name', () => {
      expect(opts.details.name)
        .to
        .equal(
          assetCreateJSON.details.create_asset.details.name
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
          assetCreateJSON.details.create_asset.details.logo.key
        )

      expect(opts.details.logo.type)
        .to
        .equal(
          assetCreateJSON.details.create_asset.details.logo.type
        )

      expect(opts.details.logo.name)
        .to
        .equal(
          assetCreateJSON.details.create_asset.details.logo.name
        )
    })

    it('terms', () => {
      expect(opts.details.terms.key)
        .to
        .equal(
          assetCreateJSON.details.create_asset.details.terms.key
        )

      expect(opts.details.terms.type)
        .to
        .equal(
          assetCreateJSON.details.create_asset.details.terms.type
        )

      expect(opts.details.terms.name)
        .to
        .equal(
          assetCreateJSON.details.create_asset.details.terms.name
        )
    })
  })
})
