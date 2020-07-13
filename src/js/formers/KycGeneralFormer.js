import { Former } from './Former'
// import config from '@/config'
import { base, BLOB_TYPES } from '@tokend/js-sdk'
import { doc, str, reqId } from './op-build-helpers'
import { KycGeneralRecord } from '@/js/records/entities/kyc-general.record'
import { KycRequestRecord } from '@/js/records/requests/kyc-request.record'
import { uploadDocumentsDeep } from '@/js/helpers/upload-documents'
import { toRFC3339 } from '@/js/helpers/date-helpers'
import { createPrivateBlob } from '@/js/helpers/api-helpers'
import { store, vuexTypes } from '@/vuex'
import { isUSResidence } from '@/js/helpers/kyc-helpers'
import { keyValues } from '@/key-values'
// import { keyValues } from '@/key-values'
import get from 'lodash/get'
import { DocumentContainer } from '../helpers/DocumentContainer'
import { BlobRecord } from '@/js/records/entities/blob.record'
import { KycRecoveryRequestRecord } from '@/js/records/requests/kyc-recovery-request.record'

/**
 * Collects the attributes for kyc-general operations
 * @class
 * @implements {Former}
 */
export class KycGeneralFormer extends Former {
  _defaultAttrs = {
    requestId: '0',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    idDocType: '',
    idDocFace: DocumentContainer.fromObj(),
    idDocBack: DocumentContainer.fromObj(),
    proofOfInvestor: DocumentContainer.fromObj(),
    selfie: DocumentContainer.fromObj(),
    avatar: DocumentContainer.fromObj(),
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  }

  attrs = this.attrs || this._defaultAttrs

  /* eslint-disable max-len */
  _opBuilder = this._opBuilder || this._buildOpUpdate
  get isUpdateOpBuilder () { return this._opBuilder === this._buildOpUpdate }
  get isCreateRecoveryOpBuilder () { return this._opBuilder === this._buildOpCreateRecovery }
  get isUpdateRecoveryOpBuilder () { return this._opBuilder === this._buildOpUpdateRecovery }
  get isRecoveryOpBuilder () { return this.isCreateRecoveryOpBuilder || this.isUpdateRecoveryOpBuilder }
  useUpdateOpBuilder () { this._opBuilder = this._buildOpUpdate; return this }
  useCreateRecoveryOpBuilder () { this._opBuilder = this._buildOpCreateRecovery; return this }
  useUpdateRecoveryOpBuilder () { this._opBuilder = this._buildOpUpdateRecovery; return this }
  /* eslint-enable max-len */

  get willUpdateRequest () {
    const id = this.attrs.requestId
    return Boolean(id && typeof id === 'string' && id !== '0')
  }

  async buildOps () {
    await uploadDocumentsDeep(this.attrs)
    const op = await this._opBuilder()
    return [op]
  }

  /** @param {KycGeneralRecord|KycRequestRecord} source */
  populate (source) {
    switch (source.constructor) {
      case KycGeneralRecord:
        this._populateFromRecord(source)
        break

      case KycRequestRecord:
        if (!source.isGeneralKycRecord) {
          throw new TypeError('Unknown source.kyc type')
        }
        this._populateFromRequest(source)
        break

      case KycRecoveryRequestRecord:
        if (!source.isGeneralKycRecord) {
          throw new TypeError('Unknown source.kyc type')
        }
        this._populateFromRecoveryRequest(source)
        break

      default:
        throw new TypeError('Unknown source type')
    }
    return this
  }

  /** @param {KycGeneralRecord} source */
  _populateFromRecord (source) {
    this.useUpdateOpBuilder()
    this.attrs = this.attrs || {}
    this.attrs.requestId = '0'
    this.attrs.firstName = source.firstName
    this.attrs.lastName = source.lastName
    this.attrs.dateOfBirth = source.dateOfBirth
    this.attrs.idDocType = source.idDocType
    this.attrs.idDocFace = source.idDocFace
    this.attrs.idDocBack = source.idDocBack
    this.attrs.proofOfInvestor = source.proofOfInvestor
    this.attrs.selfie = source.selfie
    this.attrs.avatar = source.avatar

    this.attrs.address = this.attrs.address || {}
    this.attrs.address.line1 = source.address.line1
    this.attrs.address.line2 = source.address.line2
    this.attrs.address.city = source.address.city
    this.attrs.address.state = source.address.state
    this.attrs.address.postalCode = source.address.postalCode
    this.attrs.address.country = source.address.country
  }

  /** @param {KycRequestRecord} source */
  _populateFromRequest (source) {
    this._populateFromRecord(source.kyc)
    const isUpdatable = source.isPending || source.isRejected
    this.attrs.requestId = isUpdatable ? source.id : '0'
  }

  /** @param {KycRecoveryRequestRecord} source */
  _populateFromRecoveryRequest (source) {
    this._populateFromRecord(source.kyc)

    const isUpdatable = source.isPending || source.isRejected
    if (isUpdatable) {
      this.attrs.requestId = source.id
      this.useUpdateRecoveryOpBuilder()
    } else {
      this.attrs.requestId = '0'
      this.useCreateRecoveryOpBuilder()
    }
  }

  async _buildOpUpdate () {
    const attrs = this.attrs

    const blob = await this._createBlob()
    const accountId = this._getAccountId()
    const roleToSet = this._getAccountRoleToSet()

    const opts = {
      requestID: reqId(attrs.requestId),
      destinationAccount: str(accountId),
      accountRoleToSet: str(roleToSet),
      creatorDetails: { blob_id: blob.id },
    }

    return base.CreateChangeRoleRequestBuilder.createChangeRoleRequest(opts)
  }

  async _buildOpCreateRecovery () {
    const opts = await this._createRecoveryOpts()
    return base.CreateKYCRecoveryRequestBuilder.create(opts)
  }

  async _buildOpUpdateRecovery () {
    const opts = await this._createRecoveryOpts()
    const requestId = reqId(this.attrs.requestId)
    return base.CreateKYCRecoveryRequestBuilder.update(opts, requestId)
  }

  async _createBlob () {
    const attrs = this.attrs
    const address = attrs.address || {}

    const blobValue = JSON.stringify({
      first_name: str(attrs.firstName),
      last_name: str(attrs.lastName),
      date_of_birth: toRFC3339(attrs.dateOfBirth),
      address: {
        line_1: str(address.line1),
        line_2: str(address.line2),
        city: str(address.city),
        country: str(address.country),
        state: str(address.state),
        postal_code: str(address.postalCode),
      },
      documents: {
        kyc_id_document: {
          type: str(attrs.idDocType),
          face: doc(attrs.idDocFace),
          back: doc(attrs.idDocBack),
        },
        kyc_proof_investor: doc(attrs.proofOfInvestor),
        kyc_selfie: doc(attrs.selfie),
        kyc_avatar: doc(attrs.avatar),
      },
    })
    const blob = await createPrivateBlob(BLOB_TYPES.kycGeneral, blobValue)
    return new BlobRecord(blob)
  }

  async _createRecoveryOpts () {
    const blob = await this._createBlob()
    const accountId = this._getAccountId()
    const walletPublicKey = this._getWalletPublicKey()
    const defaultSignerOpts = {
      publicKey: str(walletPublicKey),
      roleID: str(keyValues.defaultSignerRoleId),
      weight: '1000',
      identity: '1',
      details: {},
    }

    const opts = {
      targetAccount: str(accountId),
      signers: [
        defaultSignerOpts,
        // TODO: issuance signer?
        // TODO: recovery signer?
      ],
      creatorDetails: { blob_id: blob.id },
    }
    return opts
  }

  _getAccountRoleToSet () {
    const isUsResident = isUSResidence(get, this.attrs, 'address.country')
    const isAccredited = Boolean(this.attrs.proofOfInvestor)
    switch (true) {
      case isUsResident && isAccredited:
        return keyValues.usAccreditedRoleId
      case isUsResident && !isAccredited:
        return keyValues.usVerifiedRoleId
      default:
        return keyValues.generalRoleId
    }
  }

  _getAccountId () {
    return store.getters[vuexTypes.accountId] // TODO: get rid of store
  }

  _getWalletPublicKey () {
    return store.getters[vuexTypes.walletPublicKey] // TODO: get rid of store
  }
}
