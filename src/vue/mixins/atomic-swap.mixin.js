import { base } from '@tokend/js-sdk'
import { api } from '@/api'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { ATOMIC_SWAP_REQUEST_TYPES } from '@/js/const/atomic-swap.const'
import { CreateAtomicSwapRecord } from '@/js/records/entities/create-atomic-swap.record'
import { AtomicSwapBidRecord } from '@/js/records/entities/atomic-swap-bid.record'

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
      isLoggedIn: vuexTypes.isLoggedIn,
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
          type: ATOMIC_SWAP_REQUEST_TYPES.createPaymentMethod,
          attributes: {
            asset: quoteAsset.asset.code,
            destination: quoteAsset.destination,
          },
        })

        quoteAssetsKey.push({
          id: quoteAsset.asset.code,
          type: ATOMIC_SWAP_REQUEST_TYPES.createPaymentMethod,
        })
      })

      const operation = {
        data: {
          type: ATOMIC_SWAP_REQUEST_TYPES.createOffer,
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

    async createAtomicSwapBidOperation () {
      const { data } = await api.post(
        '/integrations/marketplace/buy',
        this.buildCreateAtomicSwapBidOperation()
      )
      return new AtomicSwapBidRecord(data)
    },

    buildCreateAtomicSwapBidOperation () {
      return {
        data: {
          type: ATOMIC_SWAP_REQUEST_TYPES.createBuyRequest,
          attributes: {
            amount: this.form.amount,
            offer_id: Number(this.atomicSwap.id),
            payment_method_id: Number(this.form.paymentMethodId),
            ...(this.isLoggedIn
              ? { sender_account_id: this.accountId }
              : { sender_email: this.form.email }
            ),
          },
        },
      }
    },
  },
}
