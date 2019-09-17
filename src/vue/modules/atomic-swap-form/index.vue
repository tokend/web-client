<template>
  <div>
    <div
      class="atomic-swap__asset-description"
      v-if="assetByCode(atomicSwap.baseAsset).description"
    >
      <p
        class="atomic-swap__asset-description-lbl"
      >
        {{ 'atomic-swap-form.asset-description-lbl' | globalize }}:
      </p>
      <p>{{ assetByCode(atomicSwap.baseAsset).description }}</p>
    </div>
    <atomic-swap-form
      v-if="!isAtomicSwapBidCreated"
      :atomic-swap="atomicSwap"
      :is-disabled="isDisabled"
      @submitted="handleAtomicSwapFormSubmitted"
      @select-asset="selectQuoteAsset"
    />
    <address-viewer
      v-else
      :asset-code="assetByCode(form.quoteAsset).code"
      :amount="atomicSwapBidDetails.amount"
      :address="atomicSwapBidDetails.address"
      :end-time="atomicSwapBidDetails.endTime"
    />
  </div>
</template>

<script>
import AtomicSwapForm from '@/vue/forms/AtomicSwapForm'
import FormMixin from '@/vue/mixins/form.mixin'
import AddressViewer from '@/vue/common/address-viewer'
import AtomicSwapMixin from '@/vue/mixins/atomic-swap.mixin'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
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
    AtomicSwapForm,
    AddressViewer,
  },
  mixins: [FormMixin, AtomicSwapMixin],
  props: {
    atomicSwap: {
      type: AtomicSwapRecord,
      required: true,
    },
  },
  data () {
    return {
      form: {
        amount: '',
        quoteAsset: '',
        paymentMethodId: '',
      },
      isDisabled: false,
      selectedQuoteAsset: {},
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
        const atomicSwapBid = await this.createAtomicSwapBidOperation()
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

    selectQuoteAsset (code) {
      this.selectedQuoteAsset = this.assetByCode(code)
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
