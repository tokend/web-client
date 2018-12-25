<template>
  <form class="app-form issuance-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <select-field-unchained
          v-model="form.asset"
          :values="['BTC', 'ETH', 'USD']"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          type="number"
          v-model="form.amount"
          @blur="_touchField('form.amount')"
          id="create-issuance-amount"
          :label="'Amount' | globalize"
          :error-message="_getErrorMessage('form.amount')"
        />
        <span>Available for issuance:</span>
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="_touchField('form.email')"
          id="create-issuance-email"
          :label="'Email' | globalize"
          :error-message="_getErrorMessage('form.email')"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.reference"
          @blur="_touchField('form.reference')"
          id="create-issuance-reference"
          :error-message="_getErrorMessage('form.reference')"
          :label="'Reference' | globalize"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="issuance-form__submit-btn"
        :disabled="_isDisabled"
      >
        {{ 'Issue' | globalize }}
      </button>
      <button
        v-ripple
        class="issuance-form__cancel-btn"
        :disabled="_isDisabled"
      >
        {{ 'CANCEL' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import SelectFieldUnchained from '@/vue/fields/SelectFieldUnchained'

import { required } from '@validators'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'create-issuance-form',
  components: {
    SelectFieldUnchained
  },
  mixins: [FormMixin],
  data: _ => ({
    form: {
      asset: '',
      amount: 0,
      email: '',
      reference: ''
    }
  }),
  validations: {
    form: {
      asset: { required },
      amount: { required },
      email: { required },
      reference: { required }
    }
  },
  computed: {
    ...mapGetters('new-wallet', [
      vuexTypes.wallet
    ])
  },
  methods: {
    submit () {
      return this._isFormValid()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './issuance-form';
</style>
