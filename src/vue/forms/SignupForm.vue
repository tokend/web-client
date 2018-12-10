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
    globalize,
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()
      try {
        await Sdk.api.wallets.getKdfParams(this.form.email)
        // If no error came - the user exists - we obviously won't succeed in
        // sign-up flow
        Bus.error('auth.error-user-exist')
        return
      } catch (e) {
        if (!(e instanceof errors.NotFoundError)) {
          console.error(e)
          ErrorHandler.processUnexpected(e)
          return
        }
        // If user not found - it's our case, so we will continue sign-up
      }
      this.$emit(this.submitEvent, this.form)
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
