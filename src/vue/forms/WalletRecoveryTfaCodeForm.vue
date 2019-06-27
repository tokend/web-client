<template>
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
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { required } from '@validators'
import { errors } from '@/js/errors'
import { vueRoutes } from '@/vue-router/routes'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { factorsManager } from '@/api'

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
    form: {
      code: '000000',
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
