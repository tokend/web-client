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
          :value="form.baseAsset.code"
          @input="setBaseAssetByCode"
          name="create-sale-base-asset"
          :label="'create-sale-form.base-asset-lbl' | globalize"
        >
          <option
            v-for="asset in ownedAssets"
            :key="asset.code"
            :value="asset.code"
          >
            {{ asset.nameAndCode }}
          </option>
        </select-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          :value="form.capAsset.code"
          @input="setCapAssetByCode"
          name="create-sale-base-asset"
          :label="'create-sale-form.cap-asset-lbl' | globalize"
          :error-message="!isQuoteAssetsLoaded || availableQuoteAssets.length
            ? ''
            : 'create-sale-form.no-investable-assets-err' | globalize"
        >
          <option
            v-for="asset in baseAssets"
            :key="asset.code"
            :value="asset.code"
          >
            {{ asset.nameAndCode }}
          </option>
        </select-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.assetsToSell"
          @blur="touchField('form.assetsToSell')"
          name="create-sale-assets-to-sell"
          type="number"
          :min="0"
          :max="availableForIssuance"
          :step="MIN_AMOUNT"
          :label="'create-sale-form.assets-to-sell-lbl' |
            globalize({ asset: form.baseAsset.code })"
          :error-message="getFieldErrorMessage(
            'form.assetsToSell',
            { available: availableForIssuance }
          )"
        />

        <template v-if="form.baseAsset">
          <p class="app__form-field-description">
            {{
              'create-sale-form.available-amount-hint' | globalize({
                amount: {
                  value: availableForIssuance,
                  currency: form.baseAsset.code
                }
              })
            }}
          </p>
        </template>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          :name="`create-sale-whitelisted`"
          v-model="form.isWhitelisted"
        >
          {{ 'create-sale-form.whitelisted-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <date-field
          v-model="form.startTime"
          name="create-sale-start-time"
          :enable-time="true"
          @input="touchField('form.startTime')"
          @blur="touchField('form.startTime')"
          :label="'create-sale-form.start-time-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.startTime')"
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
          :min="0"
          :max="form.hardCap || MAX_AMOUNT"
          :step="MIN_AMOUNT"
          v-model="form.softCap"
          @blur="touchField('form.softCap')"
          name="create-sale-soft-cap"
          :label="'create-sale-form.soft-cap-lbl' | globalize({
            asset: form.capAsset.code
          })"
          :error-message="getFieldErrorMessage(
            'form.softCap',
            { hardCap: form.hardCap || '0' }
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          type="number"
          :min="0"
          :max="MAX_AMOUNT"
          :step="MIN_AMOUNT"
          v-model="form.hardCap"
          @blur="touchField('form.hardCap')"
          name="create-sale-hard-cap"
          :label="'create-sale-form.hard-cap-lbl' | globalize({
            asset: form.capAsset.code
          })"
          :error-message="getFieldErrorMessage(
            'form.hardCap',
            { softCap: form.softCap || '0' }
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <p class="information-step-form__price">
          {{
            'create-sale-form.price-for-asset-hint' | globalize({
              base: form.baseAsset.code,
              quote: form.capAsset.code,
              value: priceForAsset
            })
          }}
        </p>
      </div>
    </div>

    <div
      v-if="availableQuoteAssets.length"
      class="information-step-form__quote-assets"
    >
      <p class="information-step-form__quote-assets-title">
        {{ 'create-sale-form.accept-investments-msg' | globalize }}
      </p>

      <div
        class="app__form-row"
        v-for="item in availableQuoteAssets"
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
import LoadAssetPairsMixin from '../mixins/load-asset-pairs.mixin'

import moment from 'moment'

import { CreateSaleRequest } from '../wrappers/create-sale-request'

import { MathUtil } from '@/js/utils'

import {
  required,
  maxLength,
  softCapMoreThanHardCap,
  hardCapLessThanSoftCap,
  requiredAtLeastOne,
  minDate,
  lessThenMax,
} from '@validators'

import config from '@/config'

const EVENTS = {
  submit: 'submit',
}

const CODE_MAX_LENGTH = 16
const NAME_MAX_LENGTH = 255

export default {
  name: 'information-step-form',
  mixins: [FormMixin, LoadAssetPairsMixin],
  props: {
    request: { type: CreateSaleRequest, default: null },
    ownedAssets: { type: Array, default: _ => [] },
    baseAssets: { type: Array, default: _ => [] },
  },

  data: _ => ({
    form: {
      name: '',
      baseAsset: {},
      capAsset: {},
      startTime: '',
      endTime: '',
      softCap: '',
      hardCap: '',
      assetsToSell: '',
      quoteAssets: [],
      isWhitelisted: false,
    },
    isQuoteAssetsLoaded: false,
    availableQuoteAssets: [],
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
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
        capAsset: { required },
        startTime: {
          required,
        },
        endTime: {
          required,
          minDate: minDate(this.form.startTime || moment().toISOString()),
        },
        softCap: {
          required,
          softCapMoreThanHardCap: softCapMoreThanHardCap(
            this.MIN_AMOUNT, this.form.hardCap
          ),
        },
        hardCap: {
          required,
          hardCapLessThanSoftCap: hardCapLessThanSoftCap(
            this.form.softCap, this.MAX_AMOUNT
          ),
        },
        assetsToSell: {
          required,
          noMoreThanAvailableForIssuance: lessThenMax(
            this.availableForIssuance
          ),
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
        currency: this.form.capAsset.code,
      }
    },

    availableForIssuance () {
      return this.form.baseAsset
        ? this.form.baseAsset.availableForIssuance
        : ''
    },

    yesterday () {
      return moment().subtract(1, 'days').toISOString()
    },
  },

  watch: {
    'form.capAsset.code': async function (value) {
      if (this.isQuoteAssetsLoaded) {
        this.isQuoteAssetsLoaded = false
        this.form.quoteAssets = []
      }

      this.availableQuoteAssets = await this.loadBaseAssetsByQuote(value)
      this.isQuoteAssetsLoaded = true
    },
  },

  created () {
    if (this.request) {
      this.populateForm()
    } else {
      this.form.baseAsset = this.ownedAssets[0] || {}
      this.form.capAsset = this.baseAssets[0] || {}
    }
  },

  methods: {
    setBaseAssetByCode (code) {
      this.form.baseAsset = this.ownedAssets.find(item => item.code === code)
    },

    setCapAssetByCode (code) {
      this.form.capAsset = this.baseAssets.find(item => item.code === code)
    },

    getCurrentDate () {
      return moment().toISOString()
    },

    populateForm () {
      this.form.name = this.request.name
      this.form.baseAsset = this.ownedAssets
        .find(item => item.code === this.request.baseAsset)
      this.form.capAsset = this.baseAssets
        .find(item => item.code === this.request.defaultQuoteAsset)
      this.form.startTime = this.request.startTime
      this.form.endTime = this.request.endTime
      this.form.softCap = this.request.softCap
      this.form.hardCap = this.request.hardCap
      this.form.assetsToSell = this.request.assetsToSell
      this.form.quoteAssets = this.request.quoteAssets
      this.form.isWhitelisted = this.request.isWhitelisted
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

.information-step-form__quote-assets {
  margin-top: 2.4rem;
}
</style>
