<template>
  <div>
    <form
      v-if="!isAtomicSwapBidCreated"
      novalidate
      class="pay-form app__form"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.email"
            @blur="touchField('form.email')"
            name="pay-email"
            :disabled="isLoggedIn"
            :label="'pay-form.email' | globalize"
            :error-message="getFieldErrorMessage('form.email')"
          />
        </div>
      </div>

      <atomic-swap-form
        class="pay-form__atomic-swap-bid"
        @submitted="submit"
        :is-disabled="isDisabled"
        :atomic-swap="atomicSwap"
      />
    </form>

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
import FormMixin from '@/vue/mixins/form.mixin'
import AtomicSwapForm from '@/vue/forms/AtomicSwapForm'
import AddressViewer from '@/vue/common/address-viewer'
import AtomicSwapMixin from '@/vue/mixins/atomic-swap.mixin'
import { required, email } from '@validators'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { ATOMIC_SWAP_BID_TYPES } from '@/js/const/atomic-swap-bid-types.const'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'pay-form',
  components: {
    AtomicSwapForm,
    AddressViewer,
  },
  mixins: [FormMixin, AtomicSwapMixin],
  props: { atomicSwap: { type: AtomicSwapRecord, required: true } },
  data () {
    return {
      form: {
        email: '',
        amount: '',
        quoteAsset: '',
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

  validations () {
    return {
      form: {
        email: {
          required,
          email,
        },
      },
    }
  },

  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
      vuexTypes.walletEmail,
    ]),

    isAtomicSwapBidCreated () {
      return Boolean(this.atomicSwapBidDetails.address)
    },
  },

  created () {
    this.form.email = this.walletEmail
  },

  methods: {
    async submit (form) {
      if (!this.isFormValid()) return
      Object.assign(this.form, form)

      this.isDisabled = true
      try {
        const atomicSwapBid = await this.createAtomicSwapBidOperation()
        if (atomicSwapBid.type === ATOMIC_SWAP_BID_TYPES.redirect) {
          window.location.href = atomicSwapBid.payUrl
        } else {
          this.atomicSwapBidDetails = atomicSwapBid
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
  @import '~@/vue/forms/app-form';

  .pay-form__atomic-swap-bid {
    margin-top: 2.4rem;
  }
</style>
