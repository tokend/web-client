<template>
  <form
    novalidate
    class="app__form atomic-swap-quote-assets-form"
    @submit.prevent="submit()"
  >
    <div
      class="atomic-swap-quote-assets-form__asset-wrp"
      v-for="(quoteAsset, index) in form.quoteAssets"
      :key="index"
    >
      <div class="atomic-swap-quote-assets-form__asset">
        <div class="atomic-swap-quote-assets-form__assets-subheading-wrp">
          <!-- eslint-disable-next-line max-len -->
          <h3 class="app__form-subheading atomic-swap-quote-assets-form__assets-subheading">
            {{ 'atomic-swap-quote-assets-form.assets-subheading' |
              globalize({number: index + 1})
            }}
          </h3>

          <button
            v-if="canDeleteQuoteAsset(index + 1)"
            type="button"
            class="atomic-swap-quote-assets-form__delete-asset-btn"
            @click="deleteQuoteAsset(index)"
            :disabled="isDisabled"
          >
            <!-- eslint-disable-next-line max-len -->
            <i class="mdi mdi-minus-circle-outline atomic-swap-quote-assets-form__delete-asset-icon" />
          </button>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <!-- eslint-disable max-len -->
            <select-field
              :value="form.quoteAssets[index].asset.code"
              @input="setQuoteAssetByCode($event, index)"
              name="create-atomic-swap-asset"
              :label="'atomic-swap-quote-assets-form.asset-lbl' | globalize"
              @blur="touchField(`form.quoteAssets[${index}].asset`)"
              :error-message="getFieldErrorMessage(`form.quoteAssets[${index}].asset`)"
              :disabled="isDisabled"
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
            <!-- eslint-disable max-len -->
            <input-field
              white-autofill
              v-model="form.quoteAssets[index].destination"
              @blur="touchField(`form.quoteAssets[${index}].destination`)"
              :error-message="getFieldErrorMessage(
                `form.quoteAssets[${index}].destination`,
                {
                  destinationLabel: getDestinationLabel(form.quoteAssets[index].asset)
                }
              )"
              :name="'create-atomic-swap-quote-asset-destination'"
              :label="getDestinationLabel(form.quoteAssets[index].asset)"
              :disabled="isDisabled"
            />
            <!-- eslint-enable max-len -->
          </div>
        </div>
      </div>
    </div>

    <div
      class="atomic-swap-quote-assets-form__add-asset-wrp"
    >
      <div class="atomic-swap-quote-assets-form__add-asset">
        <button
          class="atomic-swap-quote-assets-form__add-asset-btn"
          type="button"
          @click="addQuoteAsset()"
          :disabled="isDisabled"
        >
          <!-- eslint-disable-next-line max-len -->
          {{ 'atomic-swap-quote-assets-form.add-asset-btn' | globalize }}
        </button>
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        class="atomic-swap-quote-assets-form__submit-btn app__button-raised"
        :disabled="isDisabled"
      >
        {{ 'atomic-swap-quote-assets-form.create-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import {
  required,
  cardNumber,
  address,
} from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { globalize } from '@/vue/filters/globalize'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'atomic-swap-quote-assets-form',
  mixins: [FormMixin],
  props: {
    isDisabled: { type: Boolean, default: false },
  },
  data: _ => ({
    form: {
      quoteAssets: [{ asset: {}, destination: '' }],
    },
    isLoaded: false,
    isLoadFailed: false,
    isFormSubmitting: false,
  }),

  validations () {
    return {
      form: {
        quoteAssets: {
          $each: {
            asset: {
              required,
              selectedSameAssetCode: asset => !this.isAssetRepeated(asset.code),
            },
            destination: {
              required,
              cryptoAddressOrCreditCardNumber: (value, quoteAsset) => {
                return quoteAsset.asset.isCoinpayments
                  ? address(quoteAsset.asset.code)(value)
                  : cardNumber(value)
              },
            },
          },
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      quoteAtomicSwapAssets: vuexTypes.quoteAtomicSwapAssets,
      assetByCode: vuexTypes.assetByCode,
    }),
  },

  async created () {
    this.form.quoteAssets[0].asset = this.quoteAtomicSwapAssets[0] || {}
  },
  methods: {
    submit () {
      this.$emit(EVENTS.submit, this.form)
    },

    isAssetRepeated (assetCode) {
      const repeatedAssets = this.form.quoteAssets
        .reduce((count, quoteAsset) => {
          return quoteAsset.asset.code === assetCode
            ? ++count
            : count
        }, 0)

      return repeatedAssets > 1
    },

    setQuoteAssetByCode (code, index) {
      this.form.quoteAssets[index].asset = this.assetByCode(code)
    },

    addQuoteAsset () {
      this.form.quoteAssets.push({
        destination: '',
        asset: this.quoteAtomicSwapAssets[0],
      })
    },

    deleteQuoteAsset (index) {
      this.form.quoteAssets.splice(index, 1)
    },

    canDeleteQuoteAsset (index) {
      return this.form.quoteAssets.length > 1
    },

    getDestinationLabel (asset) {
      return globalize(
        asset.isCoinpayments
          ? 'atomic-swap-quote-assets-form.address-lbl'
          : 'atomic-swap-quote-assets-form.card-number-lbl'
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.atomic-swap-quote-assets-form__add-asset {
  margin-top: 1rem;
}

.atomic-swap-quote-assets-form__add-asset-btn {
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

.atomic-swap-quote-assets-form__asset-wrp {
  margin-top: 3rem;
}

.atomic-swap-quote-assets-form__delete-asset-btn {
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

.atomic-swap-quote-assets-form__delete-asset-icon {
  font-size: 2.4rem;
}

.atomic-swap-quote-assets-form__assets-subheading-wrp {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.atomic-swap-quote-assets-form__assets-subheading {
  margin-top: 0;
}
</style>
