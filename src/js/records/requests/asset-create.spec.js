import { AssetCreateRequestRecord } from './asset-create.record'
import { ASSET_POLICIES } from '@tokend/js-sdk'
import { MockWrapper } from '../../../test/index'

import assetCreateRecordJSON from '../../../test/mocks/asset-create'

describe('AssetCreateRequestRecord', () => {
  const getRecord = (rawJSON = assetCreateRecordJSON) => {
    const sdkResponse = MockWrapper.makeHorizonData(rawJSON)
    return new AssetCreateRequestRecord(sdkResponse)
  }

  const setPolicies = (rawJSON, policies) => {
    rawJSON.details.asset_create.policies = policies
      .map(p => ({
        value: p,
        name: 'SomePolicyNameWeDoNotInterestedIn'
      }))

    return rawJSON
  }

  const setLogoKey = (rawJSON, key) => {
    rawJSON.details.asset_create.details.logo = {}
    rawJSON.details.asset_create.details.logo.key = key

    return rawJSON
  }

  const setTermsKey = (rawJSON, key) => {
    rawJSON.details.asset_create.details.terms = {}
    rawJSON.details.asset_create.details.terms.key = key

    return rawJSON
  }

  const setExternalSystemType = (rawJSON, type) => {
    rawJSON.details.asset_create.external_system_type = type

    return rawJSON
  }

  it('constructor properly parsed all the basic fields', () => {
    const record = getRecord()

    expect(record.assetName)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.details.name
      )

    expect(record.assetCode)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.code
      )

    expect(record.preissuedAssetSigner)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.pre_issued_asset_signer
      )

    expect(record.maxIssuanceAmount)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.max_issuance_amount
      )

    expect(record.initialPreissuedAmount)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.initial_preissued_amount
      )

    expect(record.externalSystemType)
      .to
      .deep
      .equal(
        assetCreateRecordJSON.details.asset_create.details.external_system_type
      )
  })

  it('constructor properly parsed the policies fields', () => {
    const expectedResult = [2, 4, 8]
    const expectedPolicyValue = 14

    const rawJSON = setPolicies(assetCreateRecordJSON, [2, 4, 8])
    const record = getRecord(rawJSON)

    expect(record.policies).to.deep.equal(expectedResult)
    expect(record.policy).to.equal(expectedPolicyValue)
  })

  it('constructor properly parsed the logo details', () => {
    const record = getRecord()

    expect(record.logo)
      .to
      .deep
      .equal(
        assetCreateRecordJSON.details.asset_create.details.logo
      )

    expect(record.logoKey)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.details.logo.key
      )

    expect(record.logoName)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.details.logo.name
      )

    expect(record.logoType)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.details.logo.type
      )
  })

  it('constructor properly parsed terms details', () => {
    const record = getRecord()

    expect(record.terms)
      .to
      .deep
      .equal(
        assetCreateRecordJSON.details.asset_create.details.terms
      )

    expect(record.termsKey)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.details.terms.key
      )

    expect(record.termsName)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.details.terms.name
      )

    expect(record.termsType)
      .to
      .equal(
        assetCreateRecordJSON.details.asset_create.details.terms.type
      )
  })

  describe('record getters return proper values', () => {
    it('isBaseAsset', () => {
      let rawJSON = setPolicies(
        assetCreateRecordJSON,
        [ASSET_POLICIES.baseAsset]
      )
      let record = getRecord(rawJSON)

      expect(record.isBaseAsset).to.equal(true)

      rawJSON = setPolicies(assetCreateRecordJSON, [])
      record = getRecord(rawJSON)

      expect(record.isBaseAsset).to.equal(false)
    })

    it('isIssuanceManualReviewRequired', () => {
      let rawJSON = setPolicies(
        assetCreateRecordJSON,
        [ASSET_POLICIES.issuanceManualReviewRequired]
      )
      let record = getRecord(rawJSON)

      expect(record.isIssuanceManualReviewRequired).to.equal(true)

      rawJSON = setPolicies(assetCreateRecordJSON, [])
      record = getRecord(rawJSON)

      expect(record.isIssuanceManualReviewRequired).to.equal(false)
    })

    it('isRequiresKYC', () => {
      let rawJSON = setPolicies(
        assetCreateRecordJSON,
        [ASSET_POLICIES.requiresKyc]
      )
      let record = getRecord(rawJSON)

      expect(record.isRequiresKYC).to.equal(true)

      rawJSON = setPolicies(assetCreateRecordJSON, [])
      record = getRecord(rawJSON)

      expect(record.isRequiresKYC).to.equal(false)
    })

    it('isStatsQuoteAsset', () => {
      let rawJSON = setPolicies(
        assetCreateRecordJSON,
        [ASSET_POLICIES.statsQuoteAsset]
      )
      let record = getRecord(rawJSON)

      expect(record.isStatsQuoteAsset).to.equal(true)

      rawJSON = setPolicies(assetCreateRecordJSON, [])
      record = getRecord(rawJSON)

      expect(record.isStatsQuoteAsset).to.equal(false)
    })

    it('isTwoStepWithdrawal', () => {
      let rawJSON = setPolicies(
        assetCreateRecordJSON,
        [ASSET_POLICIES.twoStepWithdrawal]
      )
      let record = getRecord(rawJSON)

      expect(record.isTwoStepWithdrawal).to.equal(true)

      rawJSON = setPolicies(assetCreateRecordJSON, [])
      record = getRecord(rawJSON)

      expect(record.isTwoStepWithdrawal).to.equal(false)
    })

    it('isTransferable', () => {
      let rawJSON = setPolicies(
        assetCreateRecordJSON,
        [ASSET_POLICIES.transferable]
      )
      let record = getRecord(rawJSON)

      expect(record.isTransferable).to.equal(true)

      rawJSON = setPolicies(assetCreateRecordJSON, [])
      record = getRecord(rawJSON)

      expect(record.isTransferable).to.equal(false)
    })

    it('isWithdrawable', () => {
      let rawJSON = setPolicies(
        assetCreateRecordJSON,
        [ASSET_POLICIES.withdrawable]
      )
      let record = getRecord(rawJSON)

      expect(record.isWithdrawable).to.equal(true)

      rawJSON = setPolicies(assetCreateRecordJSON, [])
      record = getRecord(rawJSON)

      expect(record.isWithdrawable).to.equal(false)
    })

    it('isDepositable', () => {
      let rawJSON = setExternalSystemType(assetCreateRecordJSON, '4')
      let record = getRecord(rawJSON)

      expect(record.isDepositable).to.equal(true)

      rawJSON = setExternalSystemType(assetCreateRecordJSON, undefined)
      record = getRecord(rawJSON)

      expect(record.isDepositable).to.equal(true)
    })
  })

  describe('record getURL functions return proper values', () => {
    const storageUrl = 'https://storage.com'

    it('logoUrl', () => {
      const key = 'fooEq112ewq134qweq41weqweqwe'
      const rawJSON = setLogoKey(assetCreateRecordJSON, key)
      const record = getRecord(rawJSON)

      expect(record.logoUrl(storageUrl)).to.equal(`${storageUrl}/${key}`)
    })

    it('termsUrl', () => {
      const key = 'barEq112ewq134qweq41weqweqwe'
      const rawJSON = setTermsKey(assetCreateRecordJSON, key)
      const record = getRecord(rawJSON)

      expect(record.termsUrl(storageUrl)).to.equal(`${storageUrl}/${key}`)
    })
  })
})
