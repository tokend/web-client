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

    <div
      class="create-atomic-swap-form__quote-asset-wrp"
      v-for="(quoteAsset, index) in form.quoteAssets"
      :key="index"
    >
      <div class="create-atomic-swap-form__quote-asset">
        <div class="create-atomic-swap-form__quote-assets-subheading-wrp">
          <!-- eslint-disable-next-line max-len -->
          <h3 class="app__form-subheading create-atomic-swap-form__quote-assets-subheading">
            {{ 'create-atomic-swap-form.quote-assets-subheading' |
              globalize({number: index + 1})
            }}
          </h3>

          <button
            v-if="canDeleteQuoteAsset(index + 1)"
            type="button"
            class="create-atomic-swap-form__delete-quote-asset-btn"
            @click="deleteQuoteAsset(index)"
            :disabled="formMixin.isDisabled"
          >
            <!-- eslint-disable-next-line max-len -->
            <i class="mdi mdi-minus-circle-outline create-atomic-swap-form__delete-quote-asset-icon" />
          </button>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <!-- eslint-disable max-len -->
            <select-field
              :value="form.quoteAssets[index].asset.code"
              @input="setQuoteAssetByCode($event, index)"
              name="create-atomic-swap-asset"
              :label="'create-atomic-swap-form.asset-lbl' | globalize"
              @blur="touchField(`form.quoteAssets[${index}].asset`)"
              :error-message="getFieldErrorMessage(`form.quoteAssets[${index}].asset`)"
              :disabled="formMixin.isDisabled"
            >
              <option
                v-for="asset in quoteAtomicSwapAssets"
                :key="asset.code"
                :value="asset.code"
              >
                {{ asset.name }}
              </option>
            </select-field>
            <!-- eslint-enable max-len -->
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <div class="app__form-row">
              <div class="app__form-field">
                <!-- eslint-disable max-len -->
                <input-field
                  white-autofill
                  v-model="form.quoteAssets[index].address"
                  :name="'create-atomic-swap-quote-asset-address'"
                  :label="'create-atomic-swap-form.address-lbl' | globalize"
                  :disabled="formMixin.isDisabled"
                />
                <!-- eslint-enable max-len -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="create-atomic-swap-form__add-quote-asset-wrp"
        v-if="canAddQuoteAsset(index + 1)"
      >
        <p class="create-atomic-swap-form__add-quote-asset">
          <button
            class="create-atomic-swap-form__add-quote-asset-btn"
            type="button"
            @click="addQuoteAsset(index)"
            :disabled="formMixin.isDisabled"
          >
            {{ 'create-atomic-swap-form.add-quote-asset-btn' | globalize }}
          </button>
        </p>
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        class="create-atomic-swap-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{ 'create-atomic-swap-form.create-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import {
  required,
  selectedSameAssetCode,
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
  mixins: [FormMixin],
  data: _ => ({
    form: {
      asset: {},
      amount: '',
      price: '',
      quoteAssets: [{ price: '', asset: {}, address: '' }],
    },
    isLoaded: false,
    isLoadFailed: false,
    isFormSubmitting: false,
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
        quoteAssets: {
          $each: {
            asset: {
              required,
              selectedSameAssetCode: asset => {
                /* eslint-disable max-len */
                const selectedAssets = this.getSelectedAssetsByAssetCode(asset.code)
                return selectedSameAssetCode(selectedAssets)
                /* eslint-enable max-len */
              },
            },
          },
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      baseAtomicSwapBalancesAssets: vuexTypes.baseAtomicSwapBalancesAssets,
      quoteAtomicSwapAssets: vuexTypes.quoteAtomicSwapAssets,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
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
    this.form.quoteAssets[0].asset = this.quoteAtomicSwapAssets[0] || {}
  },
  methods: {
    getSelectedAssetsByAssetCode (assetCode) {
      const selectedAssetsCode = []
      this.form.quoteAssets.forEach(quoteAsset => {
        if (quoteAsset.asset.code === assetCode) {
          selectedAssetsCode.push(quoteAsset.asset.code)
        }
      })
      return selectedAssetsCode
    },

    setAssetByCode (code) {
      this.form.asset = this.baseAtomicSwapBalancesAssets
        .find(item => item.code === code)
    },

    setQuoteAssetByCode (code, index) {
      this.form.quoteAssets[index].asset = this.quoteAtomicSwapAssets
        .find(item => item.code === code)
    },

    async submit () {
      if (!this.isFormValid()) return
      this.isFormSubmitting = true
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
      this.isFormSubmitting = false
      this.hideConfirmation()
    },

    addQuoteAsset () {
      this.form.quoteAssets.push({
        address: '',
        asset: this.quoteAtomicSwapAssets[0],
      })
    },

    deleteQuoteAsset (index) {
      this.form.quoteAssets.splice(index, 1)
    },

    canAddQuoteAsset (index) {
      return index === this.form.quoteAssets.length
    },

    canDeleteQuoteAsset (index) {
      return index !== this.form.quoteAssets.length ||
        (index === this.form.quoteAssets.length &&
          this.form.quoteAssets.length !== 1)
    },

    buildCreateAtomicSwapOperation () {
      const balanceID = this.accountBalanceByCode(this.form.asset.code).id
      const quoteAssets = []
      const addresses = {}

      this.form.quoteAssets.forEach(quoteAsset => {
        addresses[quoteAsset.asset.code] = quoteAsset.address
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
          'destination': addresses,
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

.create-atomic-swap-quote-asset-wrp {
  display: flex;
  flex-direction: column;
}

.create-atomic-swap-quote-asset {
  display: flex;
  width: 100%;
}

.create-atomic-swap-form__add-quote-asset {
  margin-top: 1rem;
}

.create-atomic-swap-form__add-quote-asset-btn {
  cursor: pointer;
  white-space: nowrap;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    border-bottom: dotted 0.1rem;
    bottom: 0.1rem;
    left: 0;
    width: 100%;
    height: 0.1rem;
  }

  &:disabled {
    filter: grayscale(1);
    opacity: 0.7;
    cursor: default;
  }
}

.create-atomic-swap-form__quote-asset-wrp {
  margin-top: 3rem;
}

.create-atomic-swap-form__delete-quote-asset-btn {
  margin-top: 1.4rem;
  margin-left: 0.6rem;
  max-width: 2.4rem;
  max-height: 2.4rem;
  color: $col-primary-inactive;
  transition: 0.2s color;

  &:disabled {
    filter: grayscale(100%);
    cursor: default;
  }

  &:enabled:hover,
  &:enabled:focus {
    color: inherit;
  }
}

.create-atomic-swap-form__delete-quote-asset-icon {
  font-size: 2.4rem;
}

.create-atomic-swap-form__quote-assets-subheading-wrp {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-atomic-swap-form__quote-assets-subheading {
  margin-top: 0;
}
</style>
