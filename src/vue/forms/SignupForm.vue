<template>
  <form class="app-form auth-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="_touchField('form.email')"
          id="signup-email"
          :label="'auth-pages.email' | globalize"
          :error-message="_getErrorMessage('form.email')"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.password"
          @blur="_touchField('form.password')"
          id="signup-password"
          type="password"
          :error-message="_getErrorMessage('form.password')"
          :label="'auth-pages.password' | globalize"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.confirmPassword"
          @blur="_touchField('form.confirmPassword')"
          id="signup-confirm-password"
          type="password"
          :error-message="_getErrorMessage('form.confirmPassword')"
          :label="'auth-pages.confirm-password' | globalize"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="auth-form__submit-btn"
        :disabled="_isDisabled"
      >
        {{ 'auth-pages.sign-up' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import {
  email,
  required,
  password,
  sameAs
} from '@validators'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@tokend/js-sdk'
import { Bus } from '@/js/helpers/event-bus'
import { Sdk } from '@/sdk'

export default {
  name: 'signup-form',
  mixins: [FormMixin],
  props: {
    submitEvent: {
      type: String,
      required: true
    }
  },
  data: _ => ({
    form: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  }),
  validations: {
    form: {
      email: { required, email },
      password: { required, password },
      confirmPassword: {
        required,
        password,
        sameAsPassword: sameAs(function () { return this.form.password })
      }
    }
  },
  methods: {
    async submit () {
      if (!this._isFormValid()) {
        return
      }
      this._disableForm()
      try {
        await Sdk.api.wallets.getKdfParams(this.form.email)
        // If no error came - the user exists - we obviously won't succeed in
        // sign-up flow
        Bus.error('auth-pages.error-user-exist')
      } catch (e) {
        if (e instanceof errors.NotFoundError) {
          // If user not found - it's our case, so we will continue sign-up
          this.$emit(this.submitEvent, this.form)
          this._enableForm()
          return
        }
        console.error(e)
        ErrorHandler.process(e)
      }
      this._enableForm()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';
</style>
