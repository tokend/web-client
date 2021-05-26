<template>
  <form
    class="app-form auth-form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="touchField('form.email')"
          name="signup-email"
          :label="'auth-pages.email' | globalize"
          :error-message="getFieldErrorMessage('form.email', {
            length: MAX_FIELD_LENGTH.email,
          })"
          :white-autofill="false"
          :disabled="isDisabled || formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.password"
          @blur="touchField('form.password')"
          name="signup-password"
          type="password"
          :trim="false"
          :error-message="getFieldErrorMessage('form.password', {
            length: MAX_FIELD_LENGTH.password,
          })"
          :white-autofill="false"
          :label="'auth-pages.password' | globalize"
          :disabled="isDisabled || formMixin.isDisabled"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.confirmPassword"
          @blur="touchField('form.confirmPassword')"
          name="signup-confirm-password"
          type="password"
          :trim="false"
          :error-message="getFieldErrorMessage('form.confirmPassword', {
            length: MAX_FIELD_LENGTH.password,
          })"
          :white-autofill="false"
          :label="'auth-pages.confirm-password' | globalize"
          :disabled="isDisabled || formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="auth-form__submit-btn app__button-raised"
        :disabled="isDisabled || formMixin.isDisabled"
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
  maxLength,
} from '@validators'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@/js/errors'
import { walletsManager } from '@/api'
import { MAX_FIELD_LENGTH } from '@/js/const/field-length.const'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'signup-form',
  mixins: [FormMixin],
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data: _ => ({
    form: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    MAX_FIELD_LENGTH,
  }),
  validations: {
    form: {
      email: {
        required,
        email,
        maxLength: maxLength(MAX_FIELD_LENGTH.email),
      },
      password: {
        required,
        password,
        maxLength: maxLength(MAX_FIELD_LENGTH.password),
      },
      confirmPassword: {
        required,
        password,
        maxLength: maxLength(MAX_FIELD_LENGTH.password),
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
        await walletsManager.getKdfParams(this.form.email.toLowerCase())
        // If no error came - the user exists - we obviously won't succeed in
        // sign-up flow
        throw new errors.UserExistsError()
      } catch (e) {
        if (e instanceof errors.NotFoundError) {
          // If user not found - it's our case, so we will continue sign-up
          this.$emit(EVENTS.submit, this.form)
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
