<template>
  <form
    novalidate
    class="app__form"
    @submit.prevent="next"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          :value="form.type"
          @input="setSaleType"
          name="create-sale-type"
          :label="'create-sale-form.type-lbl' | globalize"
        >
          <option
            v-for="type in localizedSaleTypes"
            :key="type.key"
            :value="type.value"
          >
            {{ type.key | globalize }}
          </option>
        </select-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @blur="touchField('form.name')"
          @change="former.setAttr('saleName', form.name)"
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
        <amount-input-field
          white-autofill
          v-model="form.assetsToSell"
          @change="former.setAttr('assetsToSell', form.assetsToSell)"
          name="create-sale-assets-to-sell"
          validation-type="incoming"
          :label="'create-sale-form.assets-to-sell-lbl' |
            globalize({ asset: form.baseAsset.code })"
          @blur="touchField('form.assetsToSell')"
          :asset="form.baseAsset.code"
          :readonly="formMixin.isDisabled"
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
          @input="former.setAttr('isWhitelisted', form.isWhitelisted)"
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
          :disable-before="lastTwentyYear"
          :enable-time="true"
          @blur="touchField('form.startTime')"
          @input="former.setAttr('startTime', form.startTime)"
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
          @blur="touchField('form.endTime')"
          @input="former.setAttr('endTime', form.endTime)"
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
          :max="form.hardCap || config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          v-model="form.softCap"
          name="create-sale-soft-cap"
          @blur="touchField('form.softCap')"
          @change="former.setAttr('softCap', form.softCap)"
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
          :max="config.MAX_AMOUNT"
          :step="config.MIN_AMOUNT"
          v-model="form.hardCap"
          name="create-sale-hard-cap"
          @blur="touchField('form.hardCap')"
          @change="former.setAttr('hardCap', form.hardCap)"
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

import moment from 'moment'

import { SALE_TYPES } from '@tokend/js-sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { MathUtil } from '@/js/utils'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { SaleFormer } from '@/js/formers/SaleFormer'
import { loadAssetsPairsByQuote } from '@/js/helpers/sale-helper'

import {
  required,
  maxLength,
  softCapMoreThanHardCap,
  hardCapLessThanSoftCap,
  requiredAtLeastOne,
  minDate,
  maxValueBig,
} from '@validators'

import config from '@/config'

const NAME_MAX_LENGTH = 255

export default {
  name: 'information-step-form',
  mixins: [FormMixin],
  props: {
    former: { type: SaleFormer, required: true },
  },

  data () {
    return {
      form: {
        type: '0',
        name: this.former.attrs.saleName,
        baseAsset: {},
        capAsset: {},
        startTime: this.former.attrs.startTime,
        endTime: this.former.attrs.endTime,
        softCap: this.former.attrs.softCap,
        hardCap: this.former.attrs.hardCap,
        assetsToSell: this.former.attrs.assetsToSell,
        quoteAssets: this.former.attrs.quoteAssetsAndPrices,
        isWhitelisted: this.former.attrs.isWhitelisted,
      },
      assetPairs: {},
      isQuoteAssetsLoaded: false,
      availableQuoteAssets: [],
      NAME_MAX_LENGTH,
      config,
    }
  },

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
            config.MIN_AMOUNT, this.form.hardCap,
          ),
        },
        hardCap: {
          required,
          hardCapLessThanSoftCap: hardCapLessThanSoftCap(
            this.form.softCap, config.MAX_AMOUNT,
          ),
        },
        assetsToSell: {
          required,
          noMoreThanAvailableForIssuance: maxValueBig(
            this.availableForIssuance,
          ),
        },
        quoteAssets: { requiredAtLeastOne },
      },
    }
  },

  computed: {
    ...mapGetters({
      ownedAssets: vuexTypes.ownedAssets,
      baseAssets: vuexTypes.fiatAssets,
      assetByCode: vuexTypes.assetByCode,
    }),

    priceForAsset () {
      let value = MathUtil.divide(
        this.form.hardCap,
        this.form.assetsToSell,
      )
      return {
        value: isNaN(value) ? 0 : value,
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

    lastTwentyYear () {
      return moment().subtract(20, 'years').toISOString()
    },

    localizedSaleTypes () {
      return [
        {
          key: 'create-sale-form.fixed-price',
          value: SALE_TYPES.fixedPrice,
        },
        {
          key: 'create-sale-form.immediate',
          value: SALE_TYPES.immediate,
        },
      ]
    },
  },

  watch: {
    'form.capAsset.code': async function (value) {
      if (this.isQuoteAssetsLoaded) {
        this.isQuoteAssetsLoaded = false
        this.form.quoteAssets = []
      }
      const quoteAssets = await this.loadBaseAssetsByQuote(value)
      this.availableQuoteAssets = [this.form.capAsset, ...quoteAssets]

      this.isQuoteAssetsLoaded = true
    },

    'form.quoteAssets' () {
      this.former.setAttr('quoteAssetsAndPrices',
        this.getQuoteAssetsAndPrices())
    },
  },

  created () {
    this.form.type = this.former.attrs.saleType ||
      this.localizedSaleTypes[0].value
    this.form.baseAsset = this.ownedAssets
      .find(item => item.code === this.former.attrs.baseAssetCode) ||
      this.ownedAssets[0] ||
      {}
    this.form.capAsset = this.baseAssets
      .find(item => item.code === this.former.attrs.capAssetCode) ||
      this.baseAssets[0] ||
      {}

    this.former.setAttr('quoteAssetsAndPrices',
      this.getQuoteAssetsAndPrices())
    this.former.setAttr('saleType', this.form.type)
    this.former.setAttr('baseAssetCode', this.form.baseAsset.code)
    this.former.setAttr('capAssetCode', this.form.capAsset.code)
  },

  methods: {
    next () {
      if (this.isFormValid()) this.$emit('next')
    },
    setBaseAssetByCode (code) {
      this.form.baseAsset = this.ownedAssets.find(item => item.code === code)
      this.former.setAttr('baseAssetCode', code)
    },

    setSaleType (type) {
      this.form.type = +type
      this.former.setAttr('saleType', +type)
    },

    setCapAssetByCode (code) {
      this.form.capAsset = this.baseAssets.find(item => item.code === code)
      this.former.setAttr('capAssetCode', code)
    },

    getCurrentDate () {
      return moment().toISOString()
    },

    async loadBaseAssetsByQuote (quoteAssetCode) {
      let result

      try {
        this.assetPairs = await loadAssetsPairsByQuote(quoteAssetCode)
        result = this.assetPairs.map(a => a.baseAssetCode)
          .map(item => this.assetByCode(item))
          .filter(item => item.isBaseAsset)
      } catch (e) {
        result = []
        ErrorHandler.processWithoutFeedback(e)
      }

      return result
    },

    getQuoteAssetsAndPrices () {
      const basePrice = MathUtil.divide(
        this.form.hardCap,
        this.form.assetsToSell,
      )

      let quoteAssetsCodesAndPrices =
        this.form.quoteAssets.map((item) => ({
          asset: item,
          price: this.getQuoteAssetsPrices(item, basePrice),
        }))

      return quoteAssetsCodesAndPrices
    },

    getQuoteAssetsPrices (assetCode, basePrice) {
      let result
      const capAssetCode = this.form.capAsset.code
      if (capAssetCode !== assetCode) {
        if (this.form.type === SALE_TYPES.immediate) {
          let assetPair = this.assetPairs.filter(item =>
            item.baseAndQuote === `${assetCode}/${capAssetCode}`,
          )
          result = MathUtil.divide(basePrice, assetPair[0].price)
        } else {
          result = '1'
        }
      } else {
        result = basePrice
      }

      return result
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/app-form';
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
