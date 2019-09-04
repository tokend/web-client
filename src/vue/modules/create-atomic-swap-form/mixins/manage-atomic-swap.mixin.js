import { MathUtil } from '@/js/utils/math.util'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { base } from '@tokend/js-sdk'
import { api } from '@/api'

export default {
  data () {
    return {
      collectedAttributes: {},
    }
  },

  computed: {
    ...mapGetters({
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),

    accountBalance () {
      return this.accountBalanceByCode(this.collectedAttributes.asset.code)
    },

    isAssetOwner () {
      return this.accountId === this.collectedAttributes.asset.owner
    },
  },

  methods: {
    collectAssetAttributes (newAttributes) {
      Object.assign(this.collectedAttributes, newAttributes)
    },

    async submitCreateAtomicSwapRequest () {
      let operations = []
      if (this.isAssetOwner && this.isAmountMoreThanBalance()) {
        const createIssuanceOperation = this.buildCreateIssuanceOperation()
        operations.push(createIssuanceOperation)
      }

      const createAtomicSwapOperation = this.buildCreateAtomicSwapOperation()
      operations.push(createAtomicSwapOperation)
      await api.postOperations(...operations)
    },

    buildCreateAtomicSwapOperation () {
      const balanceID = this.accountBalance.id
      const quoteAssets = []
      const destinations = {}

      this.collectedAttributes.quoteAssets.forEach(quoteAsset => {
        destinations[quoteAsset.asset.code] = quoteAsset.destination

        quoteAssets.push({
          price: this.collectedAttributes.price,
          asset: quoteAsset.asset.code,
        })
      })

      const operation = {
        balanceID: balanceID,
        amount: this.collectedAttributes.amount,
        quoteAssets: quoteAssets,
        creatorDetails: {
          'destination': destinations,
        },
      }
      // eslint-disable-next-line max-len
      return base.CreateAtomicSwapAskRequestBuilder.createAtomicSwapAskRequest(operation)
    },

    buildCreateIssuanceOperation () {
      const operation = base.CreateIssuanceRequestBuilder
        .createIssuanceRequest({
          asset: this.collectedAttributes.asset.code,
          amount: this.getIssuanceAmount(),
          receiver: this.accountBalance.id,
          reference: this.getReference(),
          creatorDetails: {},
        })

      return operation
    },

    getReference () {
      return btoa(Math.random())
    },

    getIssuanceAmount () {
      const availbaleBalance = this.accountBalance.balance
      const amount = this.collectedAttributes.amount
      return MathUtil.subtract(amount, availbaleBalance)
    },
  },
}
