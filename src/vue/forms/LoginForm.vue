<template>
  <form class="login-form" @submit.prevent="submit">
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
          @blur="$v.form.email.$touch()"
          :error-message="errorMessage(`form.password`)"
          :label="globalize('auth.password')"
          :type="`password`"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button
        type="submit"
        class="login-form__submit-btn"
        :disabled="formMixin.isDisabled"
      >
        {{ 'auth.sign-in' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '../mixins/form.mixin'

import { globalize } from '@/vue/filters/globalize'
import { required } from '@validators'

import { vuexTypes } from '@/vuex'
import { mapActions } from 'vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'login-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      email: '',
      password: ''
    }
  }),
  validations: {
    form: {
      email: { required },
      password: { required }
    }
  },
  methods: {
    ...mapActions('new-wallet', {
      loadWallet: vuexTypes.LOAD_WALLET
    }),
    globalize,
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        await this.loadWallet(this.form)
      } catch (e) {
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

.login-form__submit-btn {
  @include button-raised();

  margin-right: auto;
  margin-bottom: 2 * $point;
  width: 20 * $point;
}

</style>
