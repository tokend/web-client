import { base } from '@tokend/js-sdk'
import { api } from '@/api'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { ATOMIC_SWAP_REQUEST_TYPES } from '@/js/const/atomic-swap.const'

export default {
  computed: {
    ...mapGetters({
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
      accountId: vuexTypes.accountId,
      statsQuoteAsset: vuexTypes.statsQuoteAsset,
    }),
  },

  methods: {
    async createAtomicSwapAsk (baseAssetCode, amount, price, quoteAssets) {
      const { _rawResponse: marketplace } = await api.getWithSignature('/integrations/marketplace/info')
      const paymentAccount = marketplace.data.attributes.payment_account
      const paymentOperation = this.getPaymentOperation(
        paymentAccount,
        amount,
        baseAssetCode
      )
      const paymentTx = await api.getTransaction(paymentOperation)
      // eslint-disable-next-line max-len
      const atomicSwapAskOperation = this.buildCreateAtomicSwapAskOperation(
        paymentTx,
        baseAssetCode,
        price,
        quoteAssets
      )
      await api.postWithSignature('/integrations/marketplace/offers', atomicSwapAskOperation)
    },

    getPaymentOperation (destinationAccountId, amount, baseAssetCode) {
      return base
        .PaymentBuilder.payment({
          sourceBalanceId: this.accountBalanceId(baseAssetCode),
          destination: destinationAccountId,
          amount: String(amount),
          feeData: {
            sourceFee: {
              percent: '0',
              fixed: '0',
            },
            destinationFee: {
              percent: '0',
              fixed: '0',
            },
            sourcePaysForDest: false,
          },
          subject: '',
          asset: baseAssetCode,
        })
    },

    // eslint-disable-next-line max-len
    buildCreateAtomicSwapAskOperation (paymentTx, baseAssetCode, price, quoteAssets) {
      const paymentQuoteAssets = quoteAssets.map(quoteAsset => {
        return {
          id: quoteAsset.asset.code,
          type: ATOMIC_SWAP_REQUEST_TYPES.createPaymentMethod,
          attributes: {
            asset: quoteAsset.asset.code,
            destination: quoteAsset.destination,
          },
        }
      })

      // eslint-disable-next-line max-len
      const quoteAssetsKey = quoteAssets.map(quoteAsset => {
        return {
          id: quoteAsset.asset.code,
          type: ATOMIC_SWAP_REQUEST_TYPES.createPaymentMethod,
        }
      })

      const operation = {
        data: {
          type: ATOMIC_SWAP_REQUEST_TYPES.createOffer,
          attributes: {
            payment_tx_envelope: paymentTx,
            price: price,
            price_asset: this.statsQuoteAsset.code,
            base_asset: baseAssetCode,
          },
          relationships: {
            payment_methods: {
              data: quoteAssetsKey,
            },
          },
        },
        included: paymentQuoteAssets,
      }

      return operation
    },

    accountBalanceId (assetCode) {
      return this.accountBalanceByCode(assetCode).id
    },
  },
}
