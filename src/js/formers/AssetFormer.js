import { Former } from './Former'
import config from '@/config'
import { base, Document } from '@tokend/js-sdk'
import { reqId, doc, str, num } from './op-build-helpers'
import { AssetRequest } from '@/js/records/requests/asset-request.record'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { keyValues } from '@/key-values'

/**
 * Collects the attributes for asset-related operations
 * @class
 * @implements {Former}
 */
export class AssetFormer extends Former {
  attrs = this.attrs || this._defaultAttrs

  get _defaultAttrs () {
    return {
      requestId: '0',
      code: '',
      name: '',
      logo: new Document(),
      terms: new Document(),
      policies: 0,
      assetType: '',
      maxIssuanceAmount: '',
      maxIssuanceAssetSigner: '',
      initialPreissuedAmount: '',
      stellarIntegration: {
        isWithdrawable: false,
        isDepositable: false,
        assetType: '',
        assetCode: '',
      },
      erc20Integration: {
        isWithdrawable: false,
        isDepositable: false,
        address: '',
      },
      externalSystemType: '',
    }
  }

  _opBuilder = this._opBuilder || this._buildOpCreate
  get isCreateOpBuilder () { return this._opBuilder === this._buildOpCreate }
  get isUpdateOpBuilder () { return this._opBuilder === this._buildOpUpdate }
  useCreateOpBuilder () { this._opBuilder = this._buildOpCreate; return this }
  useUpdateOpBuilder () { this._opBuilder = this._buildOpUpdate; return this }

  get willUpdateRequest () {
    const id = this.attrs.requestId
    return Boolean(id && typeof id === 'string' && id !== '0')
  }

  async buildOps () {
    await Document.uploadDocumentsDeep(this.attrs)
    return [this._opBuilder()]
  }

  /** @param {AssetRequest|AssetRecord} source */
  populate (source) {
    switch (source.constructor) {
      case AssetRequest: this._populateFromRequest(source); break
      case AssetRecord: this._populateFromRecord(source); break
      default: throw TypeError('Unknown source type')
    }
    return this
  }

  /** @param {AssetRequest} source */
  _populateFromRequest (source) {
    if (source.isCreateAssetRequest) this.useCreateOpBuilder()
    if (source.isUpdateAssetRequest) this.useUpdateOpBuilder()
    this.attrs = this.attrs || this._defaultAttrs
    this.attrs.requestId = source.id
    this.attrs.code = source.assetCode
    this.attrs.name = source.assetName
    this.attrs.logo = source.logo
    this.attrs.terms = source.terms
    this.attrs.policies = source.policy
    this.attrs.assetType = source.assetType
    this.attrs.maxIssuanceAmount = source.maxIssuanceAmount
    this.attrs.preIssuanceAssetSigner = source.preIssuanceAssetSigner
    this.attrs.initialPreissuedAmount = source.initialPreissuedAmount
    this.attrs.externalSystemType = source.externalSystemType

    this.attrs.stellarIntegration = this.attrs.stellarIntegration || {}
    this.attrs.stellarIntegration.isWithdrawable = source.stellarWithdraw
    this.attrs.stellarIntegration.isDepositable = source.stellarDeposit
    this.attrs.stellarIntegration.assetCode = source.stellarAssetCode
    this.attrs.stellarIntegration.assetType = source.stellarAssetType

    this.attrs.erc20Integration = this.attrs.erc20Integration || {}
    this.attrs.erc20Integration.isWithdrawable = source.erc20Withdraw
    this.attrs.erc20Integration.isDepositable = source.erc20Deposit
    this.attrs.erc20Integration.address = source.erc20Address
  }

  /** @param {AssetRecord} source */
  _populateFromRecord (source) {
    this.useUpdateOpBuilder()
    this.attrs = this.attrs || this._defaultAttrs
    this.attrs.requestId = '0'
    this.attrs.code = source.code
    this.attrs.name = source.name
    this.attrs.logo = source.logo
    this.attrs.terms = source.terms
    this.attrs.policies = source.policy
    this.attrs.assetType = source.assetType
    this.attrs.maxIssuanceAmount = source.maxIssuanceAmount
    this.attrs.preIssuanceAssetSigner = source.preissuedAssetSigner
    this.attrs.initialPreissuedAmount = source.initialPreissuedAmount
    this.attrs.externalSystemType = source.externalSystemType

    this.attrs.stellarIntegration = this.attrs.stellarIntegration || {}
    this.attrs.stellarIntegration.isWithdrawable = source.stellarWithdraw
    this.attrs.stellarIntegration.isDepositable = source.stellarDeposit
    this.attrs.stellarIntegration.assetCode = source.stellarAssetCode
    this.attrs.stellarIntegration.assetType = source.stellarAssetType

    this.attrs.erc20Integration = this.attrs.erc20Integration || {}
    this.attrs.erc20Integration.isWithdrawable = source.erc20Withdraw
    this.attrs.erc20Integration.isDepositable = source.erc20Deposit
    this.attrs.erc20Integration.address = source.erc20Address
  }

  _buildOpCreate () {
    const attrs = this.attrs

    const defaultAssetType = keyValues.assetTypeDefault
    const nullSigner = config.NULL_ASSET_SIGNER
    const maxIssuance = attrs.maxIssuanceAmount || config.MAX_AMOUNT

    const opts = {
      requestID: reqId(attrs.requestId),
      code: str(attrs.code),
      policies: num(attrs.policies),
      trailingDigitsCount: num(config.DECIMAL_POINTS),
      assetType: str(attrs.assetType || defaultAssetType),
      maxIssuanceAmount: str(maxIssuance),
      preissuedAssetSigner: str(attrs.preIssuanceAssetSigner || nullSigner),
      initialPreissuedAmount: str(attrs.initialPreissuedAmount || maxIssuance),
      creatorDetails: {
        name: str(attrs.name),
        external_system_type: str(attrs.externalSystemType),
        logo: doc(attrs.logo),
        terms: doc(attrs.terms),
        stellar: this._getStellarOpts(),
        erc20: this._getErc20Opts(),
      },
    }

    return base.ManageAssetBuilder.assetCreationRequest(opts)
  }

  _buildOpUpdate () {
    const attrs = this.attrs

    const opts = {
      requestID: reqId(attrs.requestId),
      code: str(attrs.code),
      policies: num(attrs.policies),
      creatorDetails: {
        name: str(attrs.name),
        external_system_type: str(attrs.externalSystemType),
        logo: doc(attrs.logo),
        terms: doc(attrs.terms),
        stellar: this._getStellarOpts(),
        erc20: this._getErc20Opts(),
      },
    }

    return base.ManageAssetBuilder.assetUpdateRequest(opts)
  }

  _getStellarOpts () {
    const stellarIntegration = this.attrs.stellarIntegration || {}
    const isIntegrationEnabled =
      keyValues.bridgesEnabled > 0 && Boolean(
        stellarIntegration.isWithdrawable ||
        stellarIntegration.isDepositable ||
        stellarIntegration.assetType ||
        stellarIntegration.assetCode
      )

    return isIntegrationEnabled ? {
      withdraw: Boolean(stellarIntegration.isWithdrawable),
      deposit: Boolean(stellarIntegration.isDepositable),
      asset_type: str(stellarIntegration.assetType),
      asset_code: str(stellarIntegration.assetCode),
    } : {}
  }

  _getErc20Opts () {
    const erc20Integration = this.attrs.erc20Integration || {}
    const isIntegrationEnabled =
      keyValues.bridgesEnabled > 0 && Boolean(
        erc20Integration.isWithdrawable ||
        erc20Integration.isDepositable ||
        erc20Integration.address
      )

    return isIntegrationEnabled ? {
      withdraw: Boolean(erc20Integration.isWithdrawable),
      deposit: Boolean(erc20Integration.isDepositable),
      address: str(erc20Integration.address),
    } : {}
  }
}
