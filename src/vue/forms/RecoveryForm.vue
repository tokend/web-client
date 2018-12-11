<template>
  <form class="app-form auth-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="$v.form.email.$touch()"
          :label="globalize('auth-pages.email')"
          :error-message="errorMessage(`form.email`)"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.password"
          @blur="$v.form.password.$touch()"
          :error-message="errorMessage(`form.password`)"
          :label="globalize('auth-pages.password')"
          :type="`password`"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.confirmPassword"
          @blur="$v.form.confirmPassword.$touch()"
          :error-message="errorMessage(`form.confirmPassword`)"
          :label="globalize('auth-pages.confirm-password')"
          :type="`password`"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.recoverySeed"
          @blur="$v.form.recoverySeed.$touch()"
          :error-message="errorMessage(`form.recoverySeed`)"
          :label="globalize('auth-pages.recovery-seed')"
          :type="`password`"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
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
import FormMixin from '../mixins/form.mixin'
import {
  required,
  password,
  sameAs,
  email,
  seed
} from '@validators'
import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { globalize } from '@/vue/filters/globalize'

export default {
  name: 'recovery-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      email: '',
      password: '',
      confirmPassword: '',
      recoverySeed: ''
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
      },
      recoverySeed: { required, seed }
    }
  },
  methods: {
    globalize,
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()
      try {
        await Sdk.api.wallets.recovery(
          this.form.email,
          this.form.recoverySeed,
          this.form.password
        )
      } catch (e) {
        console.error(e)
        ErrorHandler.processUnexpected(e)
      }
      this.enableForm()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';
</style>
