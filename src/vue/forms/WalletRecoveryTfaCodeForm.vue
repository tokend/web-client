<template>
  <div>
    <form class="app-form auth-form" @submit.prevent="submit">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.code"
            @blur="touchField('form.code')"
            name="wallet-recovery-code"
            :label="'auth-pages.code' | globalize"
            :error-message="getFieldErrorMessage('form.code')"
            :white-autofill="false"
          />
        </div>
      </div>
      <p v-if="error.meta.factorType === FACTOR_TYPES.email">
        {{ 'kyc-recovery.email-code' | globalize }}
      </p>
      <p v-if="error.meta.factorType === FACTOR_TYPES.totp">
        {{ 'kyc-recovery.tfa-code' | globalize }}}
      </p>

      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="auth-form__submit-btn app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ 'auth-pages.recover-lbl' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { required } from '@validators'
import { errors } from '@/js/errors'
import { vueRoutes } from '@/vue-router/routes'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { factorsManager } from '@/api'

const FACTOR_TYPES = {
  totp: 'totp',
  email: 'email',
}
export default {
  name: 'wallet-recovery-form',
  mixins: [FormMixin],
  props: {
    error: {
      type: errors.TFARequiredError,
      required: true,
    },
  },
  data: _ => ({
    FACTOR_TYPES,
    form: {
      code: '',
    },
  }),
  validations: {
    form: {
      code: { required },
    },
  },
  methods: {
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()
      try {
        await factorsManager
          .verifyTotpFactorAndRetry(this.error, this.form.code)
        this.$router.push(vueRoutes.login)
      } catch (err) {
        ErrorHandler.process(err)
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