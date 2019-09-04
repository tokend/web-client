<template>
  <form
    novalidate
    class="app__form create-atomic-swap-form"
    @submit.prevent="submit()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          :value="form.asset.code"
          @input="setAssetByCode"
          name="create-atomic-swap-asset"
          :label="'create-atomic-swap-form.asset-lbl' | globalize"
          @blur="touchField('form.asset')"
          :disabled="formMixin.isDisabled"
        >
          <option
            v-for="asset in baseAtomicSwapBalancesAssets"
            :key="asset.code"
            :value="asset.code"
          >
            {{ asset.name }}
          </option>
        </select-field>
        <template v-if="form.asset.code">
          <p class="app__form-field-description">
            {{
              'create-atomic-swap-form.available-balance' | globalize({
                amount: accountBalance.balance,
                available: accountBalance.balance
              })
            }}
          </p>
        </template>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <amount-input-field
          v-model="form.amount"
          name="create-atomic-swap-amount"
          :validation-type="getValidationType"
          :label="'create-atomic-swap-form.amount-lbl' | globalize"
          :asset="form.asset"
          :disabled="formMixin.isDisabled"
          is-max-button-shown
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <amount-input-field
          v-model="form.price"
          name="create-atomic-swap-quote-asset-price"
          :label="'create-atomic-swap-form.price-lbl' | globalize({
            asset: businessStatsQuoteAsset
          })"
          :asset="businessStatsQuoteAsset"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        class="create-atomic-swap-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{ 'create-atomic-swap-form.next-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import ManageAtomicSwapMixin from '../mixins/manage-atomic-swap.mixin'
import {
  required,
} from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  submit: 'submit',
}

const VALIDATION_TYPES = {
  outgoing: 'outgoing',
  atomicSwap: 'atomicSwap',
}

export default {
  name: 'create-atomic-swap-form',
  mixins: [FormMixin, ManageAtomicSwapMixin],
  data: _ => ({
    form: {
      asset: {},
      amount: '',
      price: '',
    },
    isLoaded: false,
    isLoadFailed: false,
  }),

  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
        },
        price: {
          required,
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      baseAtomicSwapBalancesAssets: vuexTypes.baseAtomicSwapBalancesAssets,
      accountId: vuexTypes.accountId,
      businessStatsQuoteAsset: vuexTypes.businessStatsQuoteAsset,
    }),

    accountBalance () {
      return this.accountBalanceByCode(this.form.asset.code)
    },

    isAssetOwner () {
      return this.accountId === this.form.asset.owner
    },

    getValidationType () {
      return this.isAssetOwner
        ? VALIDATION_TYPES.atomicSwap
        : VALIDATION_TYPES.outgoing
    },
  },

  async created () {
    this.form.asset = this.baseAtomicSwapBalancesAssets[0] || {}
  },
  methods: {
    setAssetByCode (code) {
      this.form.asset = this.baseAtomicSwapBalancesAssets
        .find(item => item.code === code)
    },

    submit () {
      if (!this.isFormValid()) return
      this.$emit(EVENTS.submit, this.form)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.create-atomic-swap-form__amount-wrapper {
  display: flex;
}

.create-atomic-swap-form__asset-code {
  margin-left: 1rem;
  padding-top: 1.8rem;
  font-size: 1.8rem;
}
</style>
