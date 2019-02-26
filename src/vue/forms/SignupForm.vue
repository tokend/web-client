<template>
  <form class="app-form auth-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="touchField('form.email')"
          id="signup-email"
          name="signup-email"
          :label="'auth-pages.email' | globalize"
          :error-message="getFieldErrorMessage('form.email')"
          :white-autofill="false"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.password"
          @blur="touchField('form.password')"
          id="signup-password"
          name="signup-password"
          type="password"
          :error-message="getFieldErrorMessage('form.password')"
          :white-autofill="false"
          :label="'auth-pages.password' | globalize"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.confirmPassword"
          @blur="touchField('form.confirmPassword')"
          id="signup-confirm-password"
          name="signup-password-confirm"
          type="password"
          :error-message="getFieldErrorMessage('form.confirmPassword')"
          :white-autofill="false"
          :label="'auth-pages.confirm-password' | globalize"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="auth-form__submit-btn"
        :disabled="formMixin.isDisabled"
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
  sameAs,
} from '@validators'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@/js/errors'
import { Sdk } from '@/sdk'

export default {
  name: 'signup-form',
  mixins: [FormMixin],
  props: {
    submitEvent: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    form: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  }),
  validations: {
    form: {
      email: { required, email },
      password: { required, password },
      confirmPassword: {
        required,
        password,
        sameAsPassword: sameAs(function () { return this.form.password }),
      },
    },
  },
  methods: {
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()
      try {
        await Sdk.api.wallets.getKdfParams(this.form.email.toLowerCase())
        // If no error came - the user exists - we obviously won't succeed in
        // sign-up flow
        throw new errors.UserExistsError()
      } catch (e) {
        if (e instanceof errors.NotFoundError) {
          // If user not found - it's our case, so we will continue sign-up
          this.$emit(this.submitEvent, this.form)
          this.enableForm()
          return
        }
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';
</style>
