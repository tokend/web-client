import { Collector } from './Collector'
import config from '@/config'
import { store, vuexTypes } from '@/vuex/index'
import { base } from '@tokend/js-sdk'
import { reqId, doc, str, num } from './collector-helpers'
// import { api, loadingDataViaLoop } from '@/api'
// import get from 'lodash/get'
// import { sign } from 'node_modules/tweetnacl/nacl'

/**
 * Collects the attributes for asset-related operations
 * @class
 */
export class AssetCollector extends Collector {
  /**
   * @constructor
   * @param {('create'|'update')} mode
   */
  constructor (mode) {
    super()
    this._mode = mode
  }

  async buildOps () {
    await this._uploadDocs()

    // const integrationFixOp = await this._buildIntegrationFixOp()

    const ops = []
    switch (this._mode) {
      case 'create': ops.push(this._buildOpCreate()); break
      case 'update': ops.push(this._buildOpUpdate()); break
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

  _buildOpCreate () {
    const attrs = this.attrs

    const defaultAssetType = store.getters[vuexTypes.kvAssetTypeDefault]
    const nullSigner = config.NULL_ASSET_SIGNER
    const maxIssuance = attrs.maxIssuanceAmount || config.MAX_AMOUNT
    const isStellarIntegrationEnabled =
      attrs.stellarIntegration.isWithdrawable ||
      attrs.stellarIntegration.isDepositable
    const isErc20IntegrationEnabled =
      attrs.erc20Integration.isWithdrawable ||
      attrs.erc20Integration.isDepositable

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
