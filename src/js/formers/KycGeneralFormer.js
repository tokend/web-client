import { Former } from './Former'
// import config from '@/config'
import { base, BLOB_TYPES } from '@tokend/js-sdk'
import { doc, str, reqId } from './op-build-helpers'
// import { AssetRequest } from '@/js/records/requests/asset-request.record'
// import { AssetRecord } from '@/js/records/entities/asset.record'
import { uploadDocumentsDeep } from '@/js/helpers/upload-documents'
import { toRFC3339 } from '@/js/helpers/date-helpers'
// import { str, doc } from './op-build-helpers'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { createPrivateBlob } from '@/js/helpers/blob-helpers'
import { store, vuexTypes } from '@/vuex'
import { isUSResidence } from '@/js/helpers/is-us-residence'
import { keyValues } from '@/key-values'
// import { keyValues } from '@/key-values'
import get from 'lodash/get'

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
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    idDocType: '',
    idDocBack: null, // DocumentContainer
    idDocFace: null, // DocumentContainer
    proofOfInvestor: null, // DocumentContainer
    selfie: null, // DocumentContainer
    avatar: null, // DocumentContainer
  }

  attrs = this.attrs || this._defaultAttrs

  _opBuilder = this._opBuilder || this._buildOpCreate
  get isCreateOpBuilder () { return this._opBuilder === this._buildOpCreate }
  get isUpdateOpBuilder () { return this._opBuilder === this._buildOpUpdate }
  get isCreateRecoveryOpBuilder () {
    return this._opBuilder === this._buildOpCreateRecovery
  }
  get isUpdateRecoveryOpBuilder () {
    return this._opBuilder === this._buildOpUpdateRecovery
  }
  useCreateOpBuilder () { this._opBuilder = this._buildOpCreate; return this }
  useUpdateOpBuilder () { this._opBuilder = this._buildOpUpdate; return this }
  useCreateRecoveryOpBuilder () {
    this._opBuilder = this._buildOpCreateRecovery
    return this
  }
  useUpdateRecoveryOpBuilder () {
    this._opBuilder = this._buildOpUpdateRecovery
    return this
  }

  get willUpdateRequest () {
    const id = this.attrs.requestId
    return Boolean(id && typeof id === 'string' && id !== '0')
  }

  async buildOps () {
    await uploadDocumentsDeep(this.attrs)
    const op = await this._opBuilder()
    return [op]
  }

  // /** @param {AssetRequest|AssetRecord} source */
  // populate (source) {
  //   switch (source.constructor) {
  //     case AssetRequest: this._populateFromRequest(source); break
  //     case AssetRecord: this._populateFromRecord(source); break
  //     default: throw ReferenceError('Unknown source type')
  //   }
  //   return this
  // }

  // /** @param {AssetRequest} source */
  // _populateFromRequest (source) {
  //   if (source.isCreateAssetRequest) this.useCreateOpBuilder()
  //   if (source.isUpdateAssetRequest) this.useUpdateOpBuilder()
  //   this.attrs.requestId = source.id
  //   this.attrs.code = source.assetCode
  //   this.attrs.name = source.assetName
  //   this.attrs.logo = source.logo
  //   this.attrs.terms = source.terms
  //   this.attrs.policies = source.policy
  //   this.attrs.assetType = source.assetType
  //   this.attrs.maxIssuanceAmount = source.maxIssuanceAmount
  //   this.attrs.preIssuanceAssetSigner = source.preIssuanceAssetSigner
  //   this.attrs.initialPreissuedAmount = source.initialPreissuedAmount

  //   this.attrs.stellarIntegration = {}
  //   this.attrs.stellarIntegration.isWithdrawable = source.stellarWithdraw
  //   this.attrs.stellarIntegration.isDepositable = source.stellarDeposit
  //   this.attrs.stellarIntegration.assetCode = source.stellarAssetCode
  //   this.attrs.stellarIntegration.assetType = source.stellarAssetType

  //   this.attrs.erc20Integration = {}
  //   this.attrs.erc20Integration.isWithdrawable = source.erc20Withdraw
  //   this.attrs.erc20Integration.isDepositable = source.erc20Deposit
  //   this.attrs.erc20Integration.address = source.erc20Address
  // }

  // /** @param {AssetRecord} source */
  // _populateFromRecord (source) {
  //   this.useUpdateOpBuilder()
  //   this.attrs.requestId = '0'
  //   this.attrs.code = source.code
  //   this.attrs.name = source.name
  //   this.attrs.logo = source.logo
  //   this.attrs.terms = source.terms
  //   this.attrs.policies = source.policy
  //   this.attrs.assetType = source.assetType
  //   this.attrs.maxIssuanceAmount = source.maxIssuanceAmount
  //   this.attrs.preIssuanceAssetSigner = source.preissuedAssetSigner
  //   this.attrs.initialPreissuedAmount = source.initialPreissuedAmount

  //   this.attrs.stellarIntegration = {}
  //   this.attrs.stellarIntegration.isWithdrawable = source.stellarWithdraw
  //   this.attrs.stellarIntegration.isDepositable = source.stellarDeposit
  //   this.attrs.stellarIntegration.assetCode = source.stellarAssetCode
  //   this.attrs.stellarIntegration.assetType = source.stellarAssetType

  //   this.attrs.erc20Integration = {}
  //   this.attrs.erc20Integration.isWithdrawable = source.erc20Withdraw
  //   this.attrs.erc20Integration.isDepositable = source.erc20Deposit
  //   this.attrs.erc20Integration.address = source.erc20Address
  // }

  async _buildOpCreate () {
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

    console.log(blob.valueAsObject)

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
        [DOCUMENT_TYPES.kycIdDocument]: {
          type: str(attrs.idDocType),
          face: doc(attrs.idDocFace),
          back: doc(attrs.idDocBack),
        },
        [DOCUMENT_TYPES.kycProofOfInvestor]: doc(attrs.kycProofOfInvestor),
        [DOCUMENT_TYPES.kycSelfie]: doc(attrs.selfie),
        [DOCUMENT_TYPES.kycAvatar]: doc(attrs.avatar),
      },
    })
    return createPrivateBlob(BLOB_TYPES.kycGeneral, blobValue)
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

  //   return base.ManageAssetBuilder.assetCreationRequest(opts)
  // }

  // _buildOpUpdate () {
  //   const attrs = this.attrs

  //   const opts = {
  //     requestID: reqId(attrs.requestId),
  //     code: str(attrs.code),
  //     policies: num(attrs.policies),
  //     creatorDetails: {
  //       name: str(attrs.name),
  //       logo: doc(attrs.logo),
  //       terms: doc(attrs.terms),
  //       stellar: this._getStellarOpts(),
  //       erc20: this._getErc20Opts(),
  //     },
  //   }

  //   return base.ManageAssetBuilder.assetUpdateRequest(opts)
  // }
}
