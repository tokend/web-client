import { Former } from './Former'
import config from '@/config'
import { store, vuexTypes } from '@/vuex/index'
import { base } from '@tokend/js-sdk'
import { reqId, doc, str, num } from './op-build-helpers'
import { AssetRequest } from '@/js/records/requests/asset-request.record'
import { AssetRecord } from '@/js/records/entities/asset.record'

/**
 * Collects the attributes for asset-related operations
 * @class
 */
export class AssetFormer extends Former {
  /**
   * @constructor
   * @param {('create'|'update')} [mode]
   */
  constructor (mode) {
    super()
    this._mode = mode
    this.attrs = {
      requestId: '0',
      code: '',
      name: '',
      logo: null,
      terms: null,
      policies: 0,
      assetType: '',
      maxIssuanceAmount: '',
      preIssuanceAssetSigner: '',
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
    }
  }

  /**
   * Is the mode set to 'create'
   * @returns {boolean}
   */
  get isCreateMode () {
    return this._mode === 'create'
  }

  /**
   * Is the collected info is to update a request
   * @returns {boolean}
   */
  get isUpdateRequest () {
    const id = this.attrs.requestId
    return id && typeof id === 'string' && id !== '0'
  }

  /**
   * @param {AssetRequest} source
   */
  from (source) {
    switch (source.constructor) {
      case AssetRequest: this._fromRequest(source); break
      case AssetRecord: this._fromRecord(source); break
      default: throw ReferenceError('Unknown source type')
    }
  }

  async buildOps () {
    await this._uploadDocs()

    // const integrationFixOp = await this._buildIntegrationFixOp()

    const ops = []
    switch (this._mode) {
      case 'create': ops.push(this._buildOpCreate()); break
      case 'update': ops.push(this._buildOpUpdate()); break
      default: throw ReferenceError('Unknown mode')
    }
    return ops
  }

  _fromRequest (source) {
    if (!(source instanceof AssetRequest)) {
      throw new ReferenceError('Invalid source type')
    }
    this._mode = this._mode || 'create'
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
    this.attrs.stellarIntegration.isWithdrawable = source.stellarWithdraw
    this.attrs.stellarIntegration.isDepositable = source.stellarDeposit
    this.attrs.stellarIntegration.assetCode = source.stellarAssetCode
    this.attrs.stellarIntegration.assetType = source.stellarAssetType
    this.attrs.erc20Integration.isWithdrawable = source.erc20Withdraw
    this.attrs.erc20Integration.isDepositable = source.erc20Deposit
    this.attrs.erc20Integration.address = source.erc20Address
  }

  _fromRecord (source) {
    if (!(source instanceof AssetRecord)) {
      throw new ReferenceError('Invalid source type')
    }
    this._mode = this._mode || 'update'
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
    this.attrs.stellarIntegration.isWithdrawable = source.stellarWithdraw
    this.attrs.stellarIntegration.isDepositable = source.stellarDeposit
    this.attrs.stellarIntegration.assetCode = source.stellarAssetCode
    this.attrs.stellarIntegration.assetType = source.stellarAssetType
    this.attrs.erc20Integration.isWithdrawable = source.erc20Withdraw
    this.attrs.erc20Integration.isDepositable = source.erc20Deposit
    this.attrs.erc20Integration.address = source.erc20Address
  }

  _buildOpCreate () {
    const attrs = this.attrs

    const defaultAssetType = store.getters[vuexTypes.kvAssetTypeDefault]
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
        logo: doc(attrs.logo),
        terms: doc(attrs.terms),
        stellar: this._getStellarOpts(),
        erc20: this._getErc20Opts(),
      },
    }

    return base.ManageAssetBuilder.assetUpdateRequest(opts)
  }

  _getStellarOpts () {
    const stellarIntegration = this.attrs.stellarIntegration
    const isIntegrationEnabled =
      store.getters[vuexTypes.kvBridgesEnabled] && Boolean(
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
    const erc20Integration = this.attrs.erc20Integration
    const isIntegrationEnabled =
      store.getters[vuexTypes.kvBridgesEnabled] && Boolean(
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
