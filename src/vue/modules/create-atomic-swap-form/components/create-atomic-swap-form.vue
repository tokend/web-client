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
            asset: statsQuoteAsset.code
          })"
          :asset="statsQuoteAsset.code"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <atomic-swap-quote-assets-form
      :is-disabled.sync="formMixin.isDisabled"
      @submit="setQuoteAssets($event) || submit()"
    />
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import AtomicSwapQuoteAssetsForm from '@/vue/forms/AtomicSwapQuoteAssetsForm'
import {
  required,
} from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { api } from '@/api'
import { base } from '@tokend/js-sdk'
import { MathUtil } from '@/js/utils/math.util'

const EVENTS = {
  createdAtomicSwap: 'created-atomic-swap',
}

const VALIDATION_TYPES = {
  outgoing: 'outgoing',
  atomicSwap: 'atomicSwap',
}

export default {
  name: 'create-atomic-swap-form',
  components: {
    AtomicSwapQuoteAssetsForm,
  },
  mixins: [FormMixin],
  data: _ => ({
    form: {
      asset: {},
      amount: '',
      price: '',
      quoteAssets: [],
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
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
      accountId: vuexTypes.accountId,
      statsQuoteAsset: vuexTypes.statsQuoteAsset,
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

    async submit () {
      if (!this.isFormValid()) return
      let operations = []
      this.disableForm()

      try {
        if (this.isAssetOwner && this.isAmountMoreThanBalance()) {
          const createIssuanceOperation = this.buildCreateIssuanceOperation()
          operations.push(createIssuanceOperation)
        }

        const createAtomicSwapOperation = this.buildCreateAtomicSwapOperation()
        operations.push(createAtomicSwapOperation)
        await api.postOperations(...operations)

        Bus.success('create-atomic-swap-form.created-atomic-swap-msg')
        this.$emit(EVENTS.createdAtomicSwap)
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.enableForm()
    },

    buildCreateAtomicSwapOperation () {
      const balanceID = this.accountBalanceByCode(this.form.asset.code).id
      const quoteAssets = []
      const destinations = {}

      this.form.quoteAssets.forEach(quoteAsset => {
        destinations[quoteAsset.asset.code] = quoteAsset.destination
        quoteAssets.push({
          price: this.form.price,
          asset: quoteAsset.asset.code,
        })
      })

      const operation = {
        balanceID: balanceID,
        amount: this.form.amount,
        quoteAssets: quoteAssets,
        creatorDetails: {
          destination: destinations,
        },
      }
      // eslint-disable-next-line max-len
      return base.CreateAtomicSwapAskRequestBuilder.createAtomicSwapAskRequest(operation)
    },

    buildCreateIssuanceOperation () {
      const operation = base.CreateIssuanceRequestBuilder
        .createIssuanceRequest({
          asset: this.form.asset.code,
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
      const amount = this.form.amount
      return MathUtil.subtract(amount, availbaleBalance)
    },

    isAmountMoreThanBalance () {
      return MathUtil.compare(this.form.amount, this.accountBalance.balance) > 0
    },

    setQuoteAssets (form) {
      this.form.quoteAssets = form.quoteAssets
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
