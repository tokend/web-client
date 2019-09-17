<template>
  <div>
    <div
      class="atomic-swap__asset-description"
      v-if="assetByCode(atomicSwapAsk.baseAsset).description"
    >
      <p
        class="atomic-swap__asset-description-lbl"
      >
        {{ 'buy-atomic-swap-form.asset-description-lbl' | globalize }}:
      </p>
      <p>{{ assetByCode(atomicSwapAsk.baseAsset).description }}</p>
    </div>
    <buy-atomic-swap-form
      v-if="!isAtomicSwapBidCreated"
      :atomic-swap-ask="atomicSwapAsk"
      :is-disabled="isDisabled"
      @submitted="handleAtomicSwapFormSubmitted"
    />
    <address-viewer
      v-else
      :asset-code="form.quoteAssetCode"
      :amount="atomicSwapBidDetails.amount"
      :address="atomicSwapBidDetails.address"
      :end-time="atomicSwapBidDetails.endTime"
    />
  </div>
</template>

<script>
import BuyAtomicSwapForm from '@/vue/forms/BuyAtomicSwapForm'
import FormMixin from '@/vue/mixins/form.mixin'
import AddressViewer from '@/vue/common/address-viewer'
import AtomicSwapBidMixin from '@/vue/mixins/atomic-swap-bid.mixin'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

import { ATOMIC_SWAP_BID_TYPES } from '@/js/const/atomic-swap-bid-types.const'

const EVENTS = {
  updateList: 'update-list',
}

export default {
  name: 'atomic-swap',
  components: {
    BuyAtomicSwapForm,
    AddressViewer,
  },
  mixins: [FormMixin, AtomicSwapBidMixin],
  props: {
    atomicSwapAsk: {
      type: AtomicSwapAskRecord,
      required: true,
    },
  },
  data () {
    return {
      form: {
        amount: '',
        quoteAssetCode: '',
        paymentMethodId: '',
      },
      isDisabled: false,
      atomicSwapBidDetails: {
        address: '',
        endTime: -1,
        amount: '',
      },
    }
  },
  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),

    isAtomicSwapBidCreated () {
      return Boolean(this.atomicSwapBidDetails.address)
    },
  },
  methods: {
    async handleAtomicSwapFormSubmitted (form) {
      if (!this.isFormValid()) return
      Object.assign(this.form, form)

      this.isDisabled = true
      try {
        // eslint-disable-next-line max-len
        const atomicSwapBid = await this.createAtomicSwapBidOperation(
          this.form.amount,
          this.form.paymentMethodId,
          this.atomicSwapAsk.id
        )
        if (atomicSwapBid.type === ATOMIC_SWAP_BID_TYPES.redirect) {
          window.location.href = atomicSwapBid.payUrl
        } else {
          this.atomicSwapBidDetails = atomicSwapBid
          this.$emit(EVENTS.updateList)
        }
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isDisabled = false
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@/scss/variables';

  .atomic-swap__asset-description {
    margin-bottom: 2.4rem;
  }

  .atomic-swap__asset-description-lbl {
    font-size: 1.2rem;
    color: $col-primary-inactive;
  }
</style>
