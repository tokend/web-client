import { ASSET_POLICIES } from '@tokend/js-sdk/lib/index'

import { RequestRecord } from '../request-record'

import _get from 'lodash/get'

export class AssetUpdateRequestRecord extends RequestRecord {
  constructor (record, creatorDetails) {
    super(record)

    this.assetCode = _get(record, 'details.assetUpdate.code')
    this.assetName = _get(this._record, 'details.assetUpdate.creatorDetails.name')
    this.preissuedAssetSigner = _get(
      this._record, 'details.assetUpdate.preIssuedAssetSigner'
    )
    this.maxIssuanceAmount = _get(
      this._record, 'details.assetUpdate.maxIssuanceAmount'
    )
    this.initialPreissuedAmount = _get(
      this._record, 'details.assetUpdate.initialPreissuedAmount'
    )
    this.policies = this._policies()
    this.policy = this._policy()

    this.creatorDetails = _get(this._record, 'details.assetUpdate.creatorDetails')
    this.terms = _get(this._record, 'details.assetUpdate.creatorDetails.terms')
    this.termsKey = _get(this._record, 'details.assetUpdate.creatorDetails.terms.key')
    this.termsName = _get(
      this._record, 'details.assetUpdate.creatorDetails.terms.name'
    )
    this.termsType = _get(
      this._record, 'details.assetUpdate.creatorDetails.terms.type'
    )
    this.logo = _get(this._record, 'details.assetUpdate.creatorDetails.logo')
    this.logoKey = _get(this._record, 'details.assetUpdate.creatorDetails.logo.key')
    this.logoName = _get(this._record, 'details.assetUpdate.creatorDetails.logo.name')
    this.logoType = _get(this._record, 'details.assetUpdate.creatorDetails.logo.type')
    this.externalSystemType = _get(
      this._record, 'details.assetUpdate.creatorDetails.externalSystemType'
    )

    this.attachedDetails = creatorDetails
  }

  /**
   * Converts AssetRecord to AssetUpdateRequestRecord.
   *
   * @param {AssetRecord} assetRecord AssetRecord to be converted.
   * @return {AssetUpdateRequestRecord} New AssetUpdateRequestRecord instance.
   */
  static fromAssetRecord (assetRecord) {
    return new this({
      details: {
        assetUpdate: {
          code: assetRecord.code,
          preIssuedAssetSigner: assetRecord.preissuedAssetSigner,
          maxIssuanceAmount: assetRecord.maxIssuanceAmount,
          initialPreissuedAmount: assetRecord.initialPreissuedAmount,
          policies: assetRecord.policies.map(policy => ({ value: policy })),
          creatorDetails: assetRecord.creatorDetails,
        },
      },
    })
  }

  logoUrl (storageUrl) {
    return this.logoKey ? `${storageUrl}/${this.logoKey}` : ''
  }

  termsUrl (storageUrl) {
    return this.termsKey ? `${storageUrl}/${this.termsKey}` : ''
  }

  _policies () {
    return _get(this._record, 'details.assetUpdate.policies', [])
      .map(policy => policy.value)
  }

  _policy () {
    return this._policies().reduce((s, p) => s | p, 0)
  }

  get isBaseAsset () {
    return !!(this.policy & ASSET_POLICIES.baseAsset)
  }

  get isDepositable () {
    return !!this.externalSystemType
  }

  get isIssuanceManualReviewRequired () {
    return !!(this.policy & ASSET_POLICIES.issuanceManualReviewRequired)
  }

  get isRequiresKYC () {
    return !!(this.policy & ASSET_POLICIES.requiresKyc)
  }

  get isStatsQuoteAsset () {
    return !!(this.policy & ASSET_POLICIES.statsQuoteAsset)
  }

  get isTwoStepWithdrawal () {
    return !!(this.policy & ASSET_POLICIES.twoStepWithdrawal)
  }

  get isTransferable () {
    return !!(this.policy & ASSET_POLICIES.transferable)
  }

  get isWithdrawable () {
    return !!(this.policy & ASSET_POLICIES.withdrawable)
  }
}
