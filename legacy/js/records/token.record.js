import { ASSET_POLICIES } from '../const/xdr.const'
import { xdr } from 'tokend-js-sdk'
import config from '../../../src/config'
import get from 'lodash/get'

export class TokenRecord {
  constructor (record, attachedDetails = {}) {
    this._record = record

    this.code = record.code
    this.owner = record.owner
    this.available = record.available_for_issuance
    this.name = record.details.name
    this.signer = record.preissued_asset_signer
    this.max = record.max_issuance_amount
    this.issued = record.issued
    this.policy = record.policy
    this.policies = this._getPolicies()
    this.terms = this._getTerms()
    this.termsUrl = this._getTermsUrl()
    this.logo = this._getLogo()
    this.logoUrl = this._getLogoUrl()
    this.externalSystemType = get(record, 'details.external_system_type')

    this.attachedDetails = attachedDetails
  }

  get logoURL () {
    const key = get(this._record, 'details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  get requiresKYC () {
    return this._record.policies &&
           this._record.policies.map(policy => policy.value)
             .indexOf(xdr.AssetPolicy.requiresKyc().value) !== -1
  }

  get isTransferable () {
    return this._record.policies &&
           this._record.policies.map(policy => policy.value)
             .indexOf(xdr.AssetPolicy.transferable().value) !== -1
  }

  get isWalletToken () {
    return !!(this.policy & ASSET_POLICIES.baseAsset)
  }

  get isWithdrawable () {
    return this._record.policies &&
           this._record.policies.map(policy => policy.value)
             .indexOf(xdr.AssetPolicy.withdrawable().value) !== -1
  }

  get isDepositable () {
    return !!this.externalSystemType
  }

  _getTerms () {
    return get(this._record, 'details.terms')
  }

  _getTermsUrl () {
    const key = get(this._record, 'details.terms.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getLogo () {
    return get(this._record, 'details.logo')
  }

  _getLogoUrl () {
    const key = get(this._record, 'details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getPolicies () {
    return this._record.policies
      ? this._record.policies.map(policy => policy.value)
      : []
  }

  attachDetails (details) {
    this.attachedDetails = { ...this.attached, ...details }
  }
}
