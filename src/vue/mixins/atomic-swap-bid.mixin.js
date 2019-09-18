import { api } from '@/api'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import { ATOMIC_SWAP_REQUEST_TYPES } from '@/js/const/atomic-swap.const'
import { AtomicSwapBidRecord } from '@/js/records/entities/atomic-swap-bid.record'

export default {
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isLoggedIn: vuexTypes.isLoggedIn,
    }),
  },

  methods: {
    // eslint-disable-next-line max-len
    async createAtomicSwapBidOperation (amount, paymentMethodId, atomicSwapAskId, email) {
      const atomicSwapBidOperation = this.buildCreateAtomicSwapBidOperation(
        amount,
        paymentMethodId,
        atomicSwapAskId,
        email
      )
      const { data } = await api.post(
        '/integrations/marketplace/buy',
        atomicSwapBidOperation
      )
      return new AtomicSwapBidRecord(data)
    },

    // eslint-disable-next-line max-len
    buildCreateAtomicSwapBidOperation (amount, paymentMethodId, atomicSwapAskId, email) {
      return {
        data: {
          type: ATOMIC_SWAP_REQUEST_TYPES.createBuyRequest,
          attributes: {
            amount: amount,
            offer_id: Number(atomicSwapAskId),
            payment_method_id: Number(paymentMethodId),
            ...(this.isLoggedIn
              ? { sender_account_id: this.accountId }
              : { sender_email: email }
            ),
          },
        },
      }
    },
  },
}
