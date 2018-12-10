<template>
  <form class="signup-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="$v.form.email.$touch()"
          :label="globalize('auth.email')"
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
          :label="globalize('auth.password')"
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
          :label="globalize('auth.confirm-password')"
          :type="`password`"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        type="submit"
        class="signup-form__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'auth.sign-up' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '../mixins/form.mixin'

import { globalize } from '@/vue/filters/globalize'
import {
  email,
  required,
  password,
  sameAs
} from '@validators'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'signup-form',
  mixins: [FormMixin],
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
    globalize,
    submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        // TODO
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
@import '~@scss/mixins';
@import '~@scss/variables';

.signup-form__submit-btn {
  @include button-raised();

  margin-right: auto;
  margin-bottom: 2 * $point;
  width: 20 * $point;
}
</style>
