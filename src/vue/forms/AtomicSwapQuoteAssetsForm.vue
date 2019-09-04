<template>
  <form
    novalidate
    class="app__form atomic-swap-quote-assets-form"
    @submit.prevent="submit()"
  >
    <div
      class="atomic-swap-quote-assets-form__quote-asset-wrp"
      v-for="(quoteAsset, index) in form.quoteAssets"
      :key="index"
    >
      <div class="atomic-swap-quote-assets-form__quote-asset">
        <div class="atomic-swap-quote-assets-form__quote-assets-subheading-wrp">
          <!-- eslint-disable-next-line max-len -->
          <h3 class="app__form-subheading atomic-swap-quote-assets-form__quote-assets-subheading">
            {{ 'atomic-swap-quote-assets-form.quote-assets-subheading' |
              globalize({number: index + 1})
            }}
          </h3>

          <button
            v-if="canDeleteQuoteAsset(index + 1)"
            type="button"
            class="atomic-swap-quote-assets-form__delete-quote-asset-btn"
            @click="deleteQuoteAsset(index)"
            :disabled="isDisabled"
          >
            <!-- eslint-disable-next-line max-len -->
            <i class="mdi mdi-minus-circle-outline atomic-swap-quote-assets-form__delete-quote-asset-icon" />
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
      <div
        class="atomic-swap-quote-assets-form__add-quote-asset-wrp"
        v-if="canAddQuoteAsset(index + 1)"
      >
        <p class="atomic-swap-quote-assets-form__add-quote-asset">
          <button
            class="atomic-swap-quote-assets-form__add-quote-asset-btn"
            type="button"
            @click="addQuoteAsset(index)"
            :disabled="isDisabled"
          >
            <!-- eslint-disable-next-line max-len -->
            {{ 'atomic-swap-quote-assets-form.add-quote-asset-btn' | globalize }}
          </button>
        </p>
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
  selectedSameAssetCode,
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
      quoteAssets: [{ price: '', asset: {}, destination: '' }],
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
              selectedSameAssetCode: asset => {
                /* eslint-disable max-len */
                const selectedAssets = this.getSelectedAssetsByAssetCode(asset.code)
                return selectedSameAssetCode(selectedAssets)
                /* eslint-enable max-len */
              },
            },
            destination: {
              required,
              addressOrNumberCard: (value, quoteAsset) => {
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
    }),
  },

  async created () {
    this.form.quoteAssets[0].asset = this.quoteAtomicSwapAssets[0] || {}
  },
  methods: {
    submit () {
      if (!this.isFormValid()) return
      this.$emit(EVENTS.submit, this.form)
    },

    getSelectedAssetsByAssetCode (assetCode) {
      const selectedAssetsCode = []
      this.form.quoteAssets.forEach(quoteAsset => {
        if (quoteAsset.asset.code === assetCode) {
          selectedAssetsCode.push(quoteAsset.asset.code)
        }
      })
      return selectedAssetsCode
    },

    setQuoteAssetByCode (code, index) {
      this.form.quoteAssets[index].asset = this.quoteAtomicSwapAssets
        .find(item => item.code === code)
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

    canAddQuoteAsset (index) {
      return index === this.form.quoteAssets.length
    },

    canDeleteQuoteAsset (index) {
      return index !== this.form.quoteAssets.length ||
        (index === this.form.quoteAssets.length &&
          this.form.quoteAssets.length !== 1)
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

.atomic-swap-quote-assets-form__add-quote-asset {
  margin-top: 1rem;
}

.atomic-swap-quote-assets-form__add-quote-asset-btn {
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

.atomic-swap-quote-assets-form__quote-asset-wrp {
  margin-top: 3rem;
}

.atomic-swap-quote-assets-form__delete-quote-asset-btn {
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

.atomic-swap-quote-assets-form__delete-quote-asset-icon {
  font-size: 2.4rem;
}

.atomic-swap-quote-assets-form__quote-assets-subheading-wrp {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.atomic-swap-quote-assets-form__quote-assets-subheading {
  margin-top: 0;
}
</style>
