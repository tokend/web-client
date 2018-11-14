import { recordResponses } from './test/records.mocks'
import { TokenRecord } from './token.record'
import config from '../../../src/config'

describe('record.token', () => {
  const details = {
    someDetails: 'someDetails'
  }

  let tokenRecord
  let baseTokenRecord
  let requiresKycTokenRecord
  let hasLogoTokenRecord
  beforeEach(() => {
    tokenRecord = new TokenRecord(recordResponses.token)
    baseTokenRecord = new TokenRecord(recordResponses.tokenBase)
    requiresKycTokenRecord = new TokenRecord(recordResponses.tokenRequiresKYC)
    hasLogoTokenRecord = new TokenRecord(recordResponses.tokenWithLogo)
  })

  it('should properly parse code field', () => {
    expect(tokenRecord.code).to.equal(recordResponses.token.code)
  })
  it('should properly parse owner field', () => {
    expect(tokenRecord.owner).to.equal(recordResponses.token.owner)
  })
  it('should properly parse available field', () => {
    expect(tokenRecord.available).to.equal(recordResponses.token.available_for_issuance)
  })
  it('should properly parse name field', () => {
    expect(tokenRecord.name).to.equal(recordResponses.token.details.name)
  })
  it('should properly parse signer field', () => {
    expect(tokenRecord.signer).to.equal(recordResponses.token.preissued_asset_signer)
  })
  it('should properly parse max field', () => {
    expect(tokenRecord.max).to.equal(recordResponses.token.max_issuance_amount)
  })
  it('should properly parse issued field', () => {
    expect(tokenRecord.issued).to.equal(recordResponses.token.issued)
  })
  it('should properly parse policy field', () => {
    expect(tokenRecord.policy).to.equal(recordResponses.token.policy)
  })
  it('should properly parse policies field', () => {
    expect(tokenRecord.policies).to.deep.equal([8, 16])
  })
  it('getter requiresKYC should return false to asset which doesn\'t require KYC', () => {
    expect(tokenRecord.requiresKYC).to.equal(false)
  })
  it('getter requiresKYC should return true to asset which requires KYC', () => {
    expect(requiresKycTokenRecord.requiresKYC).to.equal(true)
  })
  it('getter isWalletToken should return false to not base asset', () => {
    expect(tokenRecord.isWalletToken).to.equal(false)
  })
  it('getter isWalletToken should return true to base asset', () => {
    expect(baseTokenRecord.isWalletToken).to.equal(true)
  })
  it('getter logoURL should return correct url to token with logo URL', () => {
    expect(hasLogoTokenRecord.logoURL).to.equal(`${config.FILE_STORAGE}/${recordResponses.tokenWithLogo.details.logo.key}`)
  })
  it('getter logoURL should return empty string to token without logo URL', () => {
    expect(tokenRecord.logoURL).to.equal('')
  })
  it('should attach details provided in constructor', () => {
    const tokenRecordWithDetails = new TokenRecord(recordResponses.token, details)
    expect(tokenRecordWithDetails.attachedDetails).to.deep.equal(details)
  })
  it('should attach provided details with attachDetails() call', () => {
    tokenRecord.attachDetails(details)
    expect(tokenRecord.attachedDetails).to.deep.equal(details)
  })
})
