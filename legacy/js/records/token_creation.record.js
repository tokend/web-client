import config from '../../../src/config'
import _get from 'lodash/get'
import { RequestRecord } from './request.record'

export class TokenCreationRecord extends RequestRecord {
  constructor (record, attachedDetails = {}) {
    super(record)
    this._record = record

    this.tokenName =
      _get(this._record, 'details.asset_create.details.name') ||
      _get(this._record, 'details.asset_update.details.name') ||
      _get(this._record, 'details.name')

    this.tokenCode =
      _get(this._record, 'details.asset_create.code') ||
      _get(this._record, 'details.asset_update.code') ||
      record.code

    this.preissuedAssetSigner =
      _get(this._record, 'details.asset_create.pre_issued_asset_signer') ||
      record.preissued_asset_signer

    this.maxIssuanceAmount =
      _get(this._record, 'details.asset_create.max_issuance_amount') ||
      record.max_issuance_amount

    this.initialPreissuedAmount =
      _get(this._record, 'details.asset_create.initial_preissued_amount') ||
      record.issued

    this.policies = this._getPolicies()

    this.terms =
      _get(this._record, 'details.asset_create.details.terms') ||
      _get(this._record, 'details.asset_update.details.terms') ||
      _get(this._record, 'details.terms')

    this.termsUrl = this._getTermsUrl()

    this.logo = _get(this._record, 'details.asset_create.details.logo') ||
      _get(this._record, 'details.asset_update.details.logo') ||
      _get(this._record, 'details.logo')

    this.logoUrl = this._getLogoUrl()

    this.details = _get(this._record, 'details')

    this.attachedDetails = attachedDetails

    this.externalSystemType = _get(record, 'details.external_system_type')
  }

  get logoURL () {
    const key = _get(this._record, 'details.asset_create.details.logo.key') ||
      _get(this._record, 'details.asset_update.details.logo.key') ||
      _get(this._record, 'details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getTermsUrl () {
    const key = _get(this._record, 'details.asset_create.details.terms.key') ||
      _get(this._record, 'details.asset_update.details.terms.key') ||
      _get(this._record, 'details.terms.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getLogoUrl () {
    const key = _get(this._record, 'details.asset_create.details.logo.key') ||
      _get(this._record, 'details.asset_update.details.logo.key') ||
      _get(this._record, 'details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getPolicies () {
    const policies = _get(this._record, 'details.asset_create.policies') ||
      _get(this._record, 'details.asset_update.policies') ||
      this._record.policies
    return (policies || []).map(policy => policy.value)
  }

  attachDetails (details) {
    this.attachedDetails = { ...this.attached, ...details }
  }
}
