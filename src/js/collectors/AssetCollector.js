import { Collector } from './Collector'
import config from '@/config'
import { store, vuexTypes } from '@/vuex/index'
import { base } from '@tokend/js-sdk'
import { reqId, doc, str, num } from './op-build-helpers'
import { AssetRequest } from '@/js/records/requests/asset-request.record'

/**
 * Collects the attributes for asset-related operations
 * @class
 */
export class AssetCollector extends Collector {
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
   * @param {AssetRequest} source
   */
  from (source) {
    switch (source.constructor) {
      case AssetRequest: this._fromRequest(source); break
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

  // async _buildIntegrationFixOp () {
  //   const owner = store.getters[vuexTypes.accountId]

  //   const response = await api.get(`/v3/assets`, {
  //     page: { limit: 100 },
  //     filter: { owner },
  //   })
  //   const ownedAssets = await loadingDataViaLoop(response)
  //   const hasIntegratedAssets = ownedAssets.some(el =>
  //     get(el, 'details.stellar.withdraw') ||
  //     get(el, 'details.stellar.deposit') ||
  //     get(el, 'details.erc20.withdraw') ||
  //     get(el, 'details.erc20.deposit')
  //   )

  //   const issuanceSignerRoleId =
  //     store.getters[vuexTypes.kvIssuanceSignerRoleId]
  //   const { signers } = await api.get(`/v3/accounts/${owner}/signers`)
  //   const isIssuanceSignerExist = signers.some(el =>
  //     el.id === api.networkDetails.masterAccountId &&
  //     (+el.role.id === +issuanceSignerRoleId)
  //   )

  //   const willIntegrate =
  //     this.attrs.stellarIntegration.isWithdrawable ||
  //     this.attrs.stellarIntegration.isDepositable ||
  //     this.attrs.erc20Integration.isWithdrawable ||
  //     this.attrs.erc20Integration.isDepositable
  //   const needIssuanceSigner = !hasIntegratedAssets &&
  //      !isIssuanceSignerExist && willIntegrate
  //   const needRemoveIssuanceSigner = !hasIntegratedAssets && !willIntegrate
  // } TODO: to account creation

  _fromRequest (source) {
    if (!(source instanceof AssetRequest)) return
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

  _buildOpCreate () {
    const attrs = this.attrs

    const defaultAssetType = store.getters[vuexTypes.kvAssetTypeDefault]
    const nullSigner = config.NULL_ASSET_SIGNER
    const maxIssuance = attrs.maxIssuanceAmount || config.MAX_AMOUNT
    const isStellarIntegrationEnabled =
      attrs.stellarIntegration.isWithdrawable ||
      attrs.stellarIntegration.isDepositable ||
      attrs.stellarIntegration.assetType ||
      attrs.stellarIntegration.assetCode
    const isErc20IntegrationEnabled =
      attrs.erc20Integration.isWithdrawable ||
      attrs.erc20Integration.isDepositable ||
      attrs.erc20Integration.address

    const opts = {
      requestID: reqId(attrs.requestId),
      trailingDigitsCount: num(config.DECIMAL_POINTS),
      code: str(attrs.code),
      policies: num(attrs.policies),
      assetType: str(attrs.assetType || defaultAssetType),
      maxIssuanceAmount: str(maxIssuance),
      preissuedAssetSigner: str(attrs.preIssuanceAssetSigner || nullSigner),
      initialPreissuedAmount: str(attrs.initialPreissuedAmount || maxIssuance),
      creatorDetails: {
        name: str(attrs.name),
        logo: doc(attrs.logo),
        terms: doc(attrs.terms),
        stellar: isStellarIntegrationEnabled ? {
          withdraw: Boolean(attrs.stellarIntegration.isWithdrawable),
          deposit: Boolean(attrs.stellarIntegration.isDepositable),
          asset_type: str(attrs.stellarIntegration.assetType),
          asset_code: str(attrs.stellarIntegration.assetCode),
        } : {},
        erc20: isErc20IntegrationEnabled ? {
          withdraw: Boolean(attrs.erc20Integration.isWithdrawable),
          deposit: Boolean(attrs.erc20Integration.isDepositable),
          address: str(attrs.erc20Integration.address),
        } : {},
      },
    }

    return base.ManageAssetBuilder.assetCreationRequest(opts)
  }

  _buildOpUpdate () {
    // TODO
  }
}
