<template>
  <form
    novalidate
    class="app__form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @blur="touchField('form.name')"
          name="create-sale-name"
          :label="'create-sale-form.sale-name-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.name', { length: NAME_MAX_LENGTH }
          )"
          :maxlength="NAME_MAX_LENGTH"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="form.baseAsset"
          :values="ownedAssets"
          name="create-sale-base-asset"
          key-as-value-text="nameAndCode"
          :label="'create-sale-form.base-asset-lbl' | globalize"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <date-field
          v-model="form.startTime"
          name="create-sale-start-time"
          :enable-time="true"
          :disable-before="yesterday"
          @input="touchField('form.startTime')"
          @blur="touchField('form.startTime')"
          :label="'create-sale-form.start-time-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.startTime', { minDate: getCurrentDate() }
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <date-field
          v-model="form.endTime"
          :enable-time="true"
          :disable-before="yesterday"
          @input="touchField('form.endTime')"
          @blur="touchField('form.endTime')"
          name="create-sale-end-time"
          :label="'create-sale-form.close-time-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.endTime', { minDate: form.startTime || getCurrentDate() }
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          type="number"
          v-model="form.softCap"
          @blur="touchField('form.softCap')"
          name="create-sale-soft-cap"
          :label="'create-sale-form.soft-cap-lbl' | globalize({
            asset: DEFAULT_QUOTE_ASSET
          })"
          :error-message="getFieldErrorMessage(
            'form.softCap',
            { from: MIN_AMOUNT, to: MAX_AMOUNT }
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          type="number"
          v-model="form.hardCap"
          @blur="touchField('form.hardCap')"
          name="create-sale-hard-cap"
          :label="'create-sale-form.hard-cap-lbl' | globalize({
            asset: DEFAULT_QUOTE_ASSET
          })"
          :error-message="getFieldErrorMessage(
            'form.hardCap',
            { from: form.softCap, to: MAX_AMOUNT }
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.assetsToSell"
          @blur="touchField(
            'form.assetsToSell'
          )"
          name="create-sale-assets-to-sell"
          type="number"
          :label="'create-sale-form.assets-to-sell-lbl' |
            globalize({ asset: form.baseAsset.code })"
          :error-message="getFieldErrorMessage(
            'form.assetsToSell',
            { from: MIN_AMOUNT, to: availableForIssuance }
          )"
        />

        <template v-if="form.baseAsset">
          <p class="app__form-field-description">
            {{
              'create-sale-form.available-amount-hint' | globalize({
                asset: form.baseAsset.code,
                amount: availableForIssuance
              })
            }}
          </p>
        </template>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <p class="information-step-form__price">
          {{
            'create-sale-form.price-for-asset-hint' | globalize({
              base: form.baseAsset.code,
              quote: DEFAULT_QUOTE_ASSET,
              value: priceForAsset
            })
          }}
        </p>
      </div>
    </div>

    <div class="app__form-row">
      {{ 'create-sale-form.accept-investments-msg' | globalize }}
    </div>

    <div
      class="app__form-row"
      v-for="item in baseAssets"
      :key="item.code"
    >
      <div class="app__form-field">
        <tick-field
          :name="`create-sale-tick-${item.code}`"
          v-model="form.quoteAssets"
          :cb-value="item.code"
        >
          {{ item.nameAndCode }}
        </tick-field>
      </div>
    </div>

    <div class="information-step-form__error-text">
      {{ getFieldErrorMessage('form.quoteAssets') }}
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="app__button-raised"
      >
        {{ 'create-sale-form.next-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import moment from 'moment'
import { formatDate } from '@/vue/filters/formatDate'

import { CreateSaleRequest } from '../wrappers/create-sale-request'

import { MathUtil } from '@/js/utils'

import {
  required,
  maxLength,
  amountRange,
  requiredAtLeastOne,
  minDate,
} from '@validators'

import { config } from '../_config'

const EVENTS = {
  submit: 'submit',
}

const CODE_MAX_LENGTH = 16
const NAME_MAX_LENGTH = 255

export default {
  name: 'information-step-form',
  mixins: [FormMixin],
  props: {
    request: { type: CreateSaleRequest, default: null },
    ownedAssets: { type: Array, default: _ => [] },
    baseAssets: { type: Array, default: _ => [] },
  },

  data: _ => ({
    form: {
      name: '',
      baseAsset: {},
      startTime: '',
      endTime: '',
      softCap: '',
      hardCap: '',
      assetsToSell: '',
      quoteAssets: [],
    },
    MIN_AMOUNT: config().MIN_AMOUNT,
    MAX_AMOUNT: config().MAX_AMOUNT,
    DEFAULT_QUOTE_ASSET: config().DEFAULT_QUOTE_ASSET,
    CODE_MAX_LENGTH,
    NAME_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        name: {
          required,
          maxLength: maxLength(NAME_MAX_LENGTH),
        },
        baseAsset: { required },
        startTime: {
          required,
          minDate: minDate(moment().toString()),
        },
        endTime: {
          required,
          minDate: minDate(this.form.startTime || moment().toString()),
        },
        softCap: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
        },
        hardCap: {
          required,
          amountRange: amountRange(this.form.softCap, this.MAX_AMOUNT),
        },
        assetsToSell: {
          required,
          amountRange: amountRange(this.MIN_AMOUNT, this.availableForIssuance),
        },
        quoteAssets: { requiredAtLeastOne },
      },
    }
  },

  computed: {
    priceForAsset () {
      return {
        value: MathUtil.divide(
          this.form.hardCap,
          this.form.assetsToSell
        ),
        currency: this.DEFAULT_QUOTE_ASSET,
      }
    },

    availableForIssuance () {
      return this.form.baseAsset.availableForIssuance
    },

    yesterday () {
      return moment().subtract(1, 'days').toString()
    },
  },

  created () {
    this.form.baseAsset = this.ownedAssets[0] || {}
    if (this.request) {
      this.populateForm()
    }
  },

  methods: {
    getCurrentDate () {
      return formatDate(moment().toString())
    },

    populateForm () {
      this.form = {
        name: this.request.name,
        baseAsset: this.ownedAssets
          .find(item => item.code === this.request.baseAsset),
        startTime: this.request.startTime,
        endTime: this.request.endTime,
        softCap: this.request.softCap,
        hardCap: this.request.hardCap,
        assetsToSell: this.request.assetsToSell,
        quoteAssets: this.request.quoteAssets,
      }
    },

    submit () {
      if (this.isFormValid()) {
        this.$emit(EVENTS.submit, this.form)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';
@import '~@scss/variables';

.information-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.information-step-form__error-text {
  margin-top: 1rem;
  color: $col-error;
}

.information-step-form__price {
  font-size: 1.4rem;
}
</style>
