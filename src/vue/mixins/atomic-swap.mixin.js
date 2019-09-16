import { base } from '@tokend/js-sdk'
import { api } from '@/api'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import {
  CREATE_PAYMENT_METHOD_TYPE,
  CREATE_OFFER_TYPE,
} from '@/js/const/atomic-swap.const'
import { CreateAtomicSwapRecord } from '@/js/records/entities/create-atomic-swap.record'

export default {
  data () {
    return {
      atomicSwapAsk: {},
    }
  },
  computed: {
    ...mapGetters({
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
      accountId: vuexTypes.accountId,
      statsQuoteAsset: vuexTypes.statsQuoteAsset,
    }),

    accountBalance () {
      return this.accountBalanceByCode(this.atomicSwapAsk.assetCode)
    },
  },

  methods: {
    async createAtomicSwapAsk (form) {
      this.atomicSwapAsk = new CreateAtomicSwapRecord(form)
      const { _rawResponse: marketplace } = await api.getWithSignature('/integrations/marketplace/info')
      const paymentAccount = marketplace.data.attributes.payment_account
      const paymentOperation = this.getPaymentOperation(paymentAccount)
      const paymentTx = await api.getTransaction(paymentOperation)
      const atomicSwapOperation = this.buildCreateAtomicSwapOperation(paymentTx)
      await api.postWithSignature('/integrations/marketplace/offers', atomicSwapOperation)
    },

    getPaymentOperation (destinationAccountId) {
      return base
        .PaymentBuilder.payment({
          sourceBalanceId: this.accountBalance.id,
          destination: destinationAccountId,
          amount: String(this.atomicSwapAsk.amount),
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
          asset: this.atomicSwapAsk.assetCode,
        })
    },

    buildCreateAtomicSwapOperation (paymentTx) {
      const quoteAssetsKey = []
      const quoteAssets = []

      this.atomicSwapAsk.quoteAssets.forEach(quoteAsset => {
        quoteAssets.push({
          id: quoteAsset.asset.code,
          type: CREATE_PAYMENT_METHOD_TYPE,
          attributes: {
            asset: quoteAsset.asset.code,
            destination: quoteAsset.destination,
          },
        })

        quoteAssetsKey.push({
          id: quoteAsset.asset.code,
          type: CREATE_PAYMENT_METHOD_TYPE,
        })
      })

      const operation = {
        data: {
          type: CREATE_OFFER_TYPE,
          attributes: {
            payment_tx_envelope: paymentTx,
            price: this.atomicSwapAsk.price,
            price_asset: this.statsQuoteAsset.code,
            base_asset: this.atomicSwapAsk.assetCode,
          },
          relationships: {
            payment_methods: {
              data: quoteAssetsKey,
            },
          },
        },
        included: quoteAssets,
      }

      return operation
    },
  },
}
