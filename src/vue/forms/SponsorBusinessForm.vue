<template>
  <div class="sponsor-business-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="submit"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            :value="form.asset.code"
            @input="setAssetByCode"
            :label="'invest-form.asset-lbl' | globalize"
            name="sponsor-business-asset"
            @blur="touchField('form.asset')"
            :disabled="formMixin.isDisabled"
          >
            <option
              v-for="asset in quoteAssetListValues"
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
            v-model="form.amount"
            name="sponsor-business-amount"
            validation-type="outgoing"
            :max="balance.balance"
            :label="'transfer-form.amount-lbl' | globalize"
            :asset="form.asset"
            :readonly="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          type="button"
          @click="submit"
          class="app__button-raised invest-form__submit-btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'invest-form.update-offer-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import config from '@/config'

import { required } from '@validators'

export default {
  name: 'sponsor-business-form',
  mixins: [FormMixin],

  data: _ => ({
    form: {
      asset: {},
      amount: '',
    },
    MIN_AMOUNT: config.MIN_AMOUNT,
  }),

  validations () {
    return {
      form: {
        asset: { required },
        amount: {
          required,
        },
      },
    }
  },

}
</script>

<style lang="scss">
@import './app-form';

</style>
