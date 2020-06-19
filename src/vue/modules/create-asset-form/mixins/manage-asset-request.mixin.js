import { uploadDocuments } from '@/js/helpers/upload-documents'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { base } from '@tokend/js-sdk'

import { api } from '@/api'
import config from '@/config'

// import { CreateAssetRequest } from '../wrappers/create-asset-request'
import { store, vuexTypes } from '@/vuex/index'
import { mapGetters } from 'vuex'

const NEW_CREATE_ASSET_REQUEST_ID = '0'

const DEFAULT_SIGNER_ATTRS = Object.freeze({
  weight: 1000,
  identity: 1,
})

export default {
  data () {
    return {
      collectedCreateAssetAttributes: {},
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.kvIssuanceSignerRoleId,
      vuexTypes.accountId,
      vuexTypes.assets,
      vuexTypes.assetsByOwner,
    ]),
    isStellarOrErc20IntegrationEnable () {
      return this.assetsByOwner(this.accountId)
        .reduce((isUsedIntegration, item) => {
          return isUsedIntegration ||
           item.isUseStellarIntegration ||
           item.isUseErc20Integration
        }, false)
    },
    $needAddSigner () {
      return !this.isStellarOrErc20IntegrationEnable &&
        (this.collectedCreateAssetAttributes.isStellarIntegrationEnabled ||
          this.collectedCreateAssetAttributes.isErc20IntegrationEnabled)
    },

    $nedDeleteSigner () {
      return !this.isStellarOrErc20IntegrationEnable &&
        (!this.collectedCreateAssetAttributes.isStellarIntegrationEnabled ||
          !this.collectedCreateAssetAttributes.isErc20IntegrationEnabled)
    },
  },
  methods: {
    // async getCreateAssetRequestById (id, accountId) {
    //   const endpoint = `/v3/create_asset_requests/${id}`
    //   const { data: record } = await api.getWithSignature(endpoint, {
    //     filter: {
    //       requestor: accountId,
    //     },
    //     include: ['request_details'],
    //   })

    //   return new CreateAssetRequest(record)
    // },

    // collectAssetAttributes (newAttributes) {
    //   Object.assign(this.collectedCreateAssetAttributes, newAttributes)
    // },

    /**
     * Submits "create asset request" operation
     * @param {string|number} requestId - request Id
     */
    async submitCreateAssetRequest (requestId) {
      const isHaveSignerMasterAccountId = await this.$checkSigner()
      const operations = []
      if (this.$needAddSigner && !isHaveSignerMasterAccountId) {
        operations.push(this.$buildCreateSignerOperation())
      } else if (this.$nedDeleteSigner && isHaveSignerMasterAccountId) {
        operations.push(this.$buildDeleteSignerOperation())
      }
      const assetDocuments = [
        this.collectedCreateAssetAttributes.logo,
        this.collectedCreateAssetAttributes.terms,
      ]
      await uploadDocuments(assetDocuments)
      operations.push(this.$buildAssetCreationRequestOperation(requestId))
      await api.postOperations(...operations)
    },

    $buildCreateSignerOperation () {
      const opts = {
        ...DEFAULT_SIGNER_ATTRS,
        publicKey: api.networkDetails.masterAccountId,
        roleID: String(this.kvIssuanceSignerRoleId),
        details: {},
      }
      return base.ManageSignerBuilder.createSigner(opts)
    },

    $buildDeleteSignerOperation () {
      const opts = {
        ...DEFAULT_SIGNER_ATTRS,
        publicKey: api.networkDetails.masterAccountId,
        roleID: String(this.kvIssuanceSignerRoleId),
        details: {},
      }
      return base.ManageSignerBuilder.deleteSigner(opts)
    },

    $buildAssetCreationRequestOperation (requestId) {
      const logo = this.collectedCreateAssetAttributes.logo
      const terms = this.collectedCreateAssetAttributes.terms

      const opts = {
        requestID: requestId ? String(requestId) : NEW_CREATE_ASSET_REQUEST_ID,
        trailingDigitsCount: config.DECIMAL_POINTS,
        code: this.collectedCreateAssetAttributes.code,
        policies: this.collectedCreateAssetAttributes.policies,
        assetType: this.$getAssetTypeStringed(),
        maxIssuanceAmount: this.$getMaxIssuanceAmount(),
        preissuedAssetSigner: this.$getPreIssuanceAssetSigner(),
        initialPreissuedAmount: this.$getInitialPreIssuedAmount(),
        creatorDetails: {
          name: this.collectedCreateAssetAttributes.name,
          logo: this.$getDocumentDetailsOrEmptyDocument(logo),
          terms: this.$getDocumentDetailsOrEmptyDocument(terms),
          stellar: this.$getStellarIntegrationAttributes(),
          erc20: this.$getErc20IntegrationAttributes(),
        },
      }

      return base.ManageAssetBuilder.assetCreationRequest(opts)
    },

    $getAssetTypeStringed () {
      const assetType = this.collectedCreateAssetAttributes.isUsageRestricted
        ? this.collectedCreateAssetAttributes.assetType
        : store.getters[vuexTypes.kvAssetTypeDefault]

      return String(assetType)
    },

    $getMaxIssuanceAmount () {
      return this.collectedCreateAssetAttributes.isMaxAmountRestricted
        ? this.collectedCreateAssetAttributes.maxIssuanceAmount
        : config.MAX_AMOUNT
    },

    $getPreIssuanceAssetSigner () {
      return this.collectedCreateAssetAttributes.isPreIssuanceEnabled
        ? this.collectedCreateAssetAttributes.preIssuanceAssetSigner
        : config.NULL_ASSET_SIGNER
    },

    $getInitialPreIssuedAmount () {
      return this.collectedCreateAssetAttributes.isPreIssuanceEnabled
        ? this.collectedCreateAssetAttributes.initialPreissuedAmount
        : this.$getMaxIssuanceAmount()
    },

    $getStellarIntegrationAttributes () {
      return this.collectedCreateAssetAttributes.isStellarIntegrationEnabled
        ? {
          withdraw: this.collectedCreateAssetAttributes.stellar.withdraw,
          deposit: this.collectedCreateAssetAttributes.stellar.deposit,
          asset_type: this.collectedCreateAssetAttributes.stellar.assetType,
          asset_code: this.collectedCreateAssetAttributes.stellar.assetCode,
        }
        : {}
    },

    $getErc20IntegrationAttributes () {
      return this.collectedCreateAssetAttributes.isErc20IntegrationEnabled
        ? {
          withdraw: this.collectedCreateAssetAttributes.erc20.withdraw,
          deposit: this.collectedCreateAssetAttributes.erc20.deposit,
          address: this.collectedCreateAssetAttributes.erc20.address,
        }
        : {}
    },

    $getDocumentDetailsOrEmptyDocument (doc) {
      if (doc instanceof DocumentContainer) {
        return doc.getDetailsForSave()
      }

      return DocumentContainer.getEmptyDetailsForSave()
    },

    async $checkSigner () {
      const endpoint = `/v3/accounts/${this.accountId}/signers`
      const { data } = await api.get(endpoint)
      return Boolean(data.find(item =>
        (item.id === api.networkDetails.masterAccountId) &&
        (+item.role.id === this.kvIssuanceSignerRoleId)
      )
      )
    },
  },
}
