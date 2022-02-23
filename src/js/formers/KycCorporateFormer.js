import { Former } from './Former'
import { base, BLOB_TYPES, Document } from '@tokend/js-sdk'
import { doc, str, reqId } from './op-build-helpers'
import { KycCorporateRecord } from '@/js/records/entities/kyc-corporate.record'
import { KycRequestRecord } from '@/js/records/requests/kyc-request.record'
import { KycRecoveryRequestRecord } from '@/js/records/requests/kyc-recovery-request.record'
import { BlobRecord } from '@/js/records/entities/blob.record'
import { createPrivateBlob, getCurrentAccId } from '@/js/helpers/api-helpers'
import { buildKycRecoveryOp } from '@/js/helpers/kyc-helpers'
import { keyValues } from '@/key-values'

/**
 * Collects the attributes for kyc-corporate operations
 * @class
 * @implements {Former}
 */
export class KycCorporateFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      requestId: '0',
      name: '',
      company: '',
      headquarters: '',
      industry: '',
      teamSize: 0,
      website: '',
      avatar: new Document(),
    }
  }

  /* eslint-disable max-len */
  _opBuilder = this._opBuilder || this._buildOpUpdate
  get isUpdateOpBuilder () { return this._opBuilder === this._buildOpUpdate }
  get isRecoveryOpBuilder () { return this._opBuilder === this._buildOpRecovery }
  useUpdateOpBuilder () { this._opBuilder = this._buildOpUpdate; return this }
  useRecoveryOpBuilder () { this._opBuilder = this._buildOpRecovery; return this }
  /* eslint-enable max-len */

  get willUpdateRequest () {
    const id = this.attrs.requestId
    return Boolean(id && typeof id === 'string' && id !== '0')
  }

  async buildOps () {
    await Document.uploadDocumentsDeep(this.attrs)
    const op = await this._opBuilder()
    return [op]
  }

  // eslint-disable-next-line max-len
  /** @param {KycCorporateRecord|KycRequestRecord|KycRecoveryRequestRecord} source */
  populate (source) {
    switch (source.constructor) {
    case KycCorporateRecord:
      this._populateFromRecord(source)
      break

    case KycRequestRecord:
      this._populateFromRequest(source)
      break

    case KycRecoveryRequestRecord:
      this._populateFromRecoveryRequest(source)
      break

    default:
      throw new TypeError('Unknown source type')
    }
    return this
  }

  /** @param {KycCorporateRecord} source */
  _populateFromRecord (source) {
    this.useUpdateOpBuilder()
    this.attrs = this.attrs || this._defaultAttrs
    this.attrs.requestId = '0'
    this.attrs.name = source.name
    this.attrs.company = source.company
    this.attrs.headquarters = source.headquarters
    this.attrs.industry = source.industry
    this.attrs.teamSize = source.teamSize
    this.attrs.website = source.website
    this.attrs.avatar = source.avatar
  }

  /** @param {KycRequestRecord|KycRecoveryRequestRecord} source */
  _populateFromRequest (source) {
    if (source.isCorporateKycRecord) {
      this._populateFromRecord(source.kyc)
    }

    this.attrs = this.attrs || this._defaultAttrs
    this.attrs.requestId = source.updatableId
  }

  /** @param {KycRecoveryRequestRecord} source */
  _populateFromRecoveryRequest (source) {
    this._populateFromRequest(source)
    this.useRecoveryOpBuilder()
  }

  async _buildOpUpdate () {
    const blob = await this._createBlob()

    const opts = {
      requestID: reqId(this.attrs.requestId),
      destinationAccount: getCurrentAccId(),
      accountRoleToSet: str(keyValues.corporateRoleId),
      creatorDetails: { blob_id: blob.id },
    }

    return base.CreateChangeRoleRequestBuilder.createChangeRoleRequest(opts)
  }

  async _buildOpRecovery () {
    const blob = await this._createBlob()
    const requestId = this.attrs.requestId
    return buildKycRecoveryOp({ requestId, blobId: blob.id })
  }

  async _createBlob () {
    const attrs = this.attrs

    const blobValue = JSON.stringify({
      name: str(attrs.name),
      company: str(attrs.company),
      headquarters: str(attrs.headquarters),
      industry: str(attrs.industry),
      team_size: str(attrs.teamSize),
      homepage: str(attrs.website),
      documents: {
        kyc_avatar: doc(attrs.avatar),
      },
    })
    const blob = await createPrivateBlob(BLOB_TYPES.kycCorporate, blobValue)
    return new BlobRecord(blob)
  }
}
