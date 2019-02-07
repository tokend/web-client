<template>
  <form class="app-form auth-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="touchField('form.email')"
          id="login-email"
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
          id="login-password"
          type="password"
          :error-message="getFieldErrorMessage('form.password')"
          :white-autofill="false"
          :label="'auth-pages.password' | globalize"
        />
      </div>
    </div>
    <div
      v-if="tfaError"
      class="app__form-row"
    >
      <div class="app__form-field">
        <input-field
          v-model="form.tfaCode"
          @blur="touchField('form.tfaCode')"
          id="login-tfa-code"
          :error-message="getFieldErrorMessage('form.tfaCode')"
          :white-autofill="false"
          :label="'auth-pages.tfa-code' | globalize"
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
        {{ 'auth-pages.sign-in' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { required, requiredIf } from '@validators'
import { vuexTypes } from '@/vuex'
import { mapActions, mapGetters } from 'vuex'
import { vueRoutes } from '@/vue-router/routes'

import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@tokend/js-sdk'

export default {
  name: 'login-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      email: '',
      password: '',
      tfaCode: '',
    },
    tfaError: null,
  }),
  validations: {
    form: {
      email: { required },
      password: { required },
      tfaCode: {
        required: requiredIf(function () { return this.tfaError }),
      },
    },
  },
  computed: {
    ...mapGetters([
      vuexTypes.wallet,
    ]),
  },
  methods: {
    ...mapActions({
      loadWallet: vuexTypes.LOAD_WALLET,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKyc: vuexTypes.LOAD_KYC,
    }),
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        if (this.tfaError) {
          await Sdk.api.factors.verifyTotpFactor(
            this.tfaError,
            this.form.tfaCode
          )
        }
        await this.loadWallet({
          email: this.form.email,
          password: this.form.password,
        })
        const accountId = this[vuexTypes.wallet].accountId
        Sdk.sdk.useWallet(this[vuexTypes.wallet])
        if (!await this.isUserExist(accountId)) {
          await Sdk.api.users.create(accountId)
        }
        await this.loadAccount(accountId)
        await this.loadKyc()
        this.$router.go(-1)
      } catch (e) {
        if (e instanceof errors.VerificationRequiredError) {
          this.$router.push({
            ...vueRoutes.verify,
            params: {
              paramsBase64: btoa(JSON.stringify({
                walletId: e.meta.walletId,
                email: this.form.email,
              })),
            },
          })
        } else if (e instanceof errors.TFARequiredError) {
          this.tfaError = e
        } else {
          ErrorHandler.process(e)
        }
      }
      this.enableForm()
    },
    async isUserExist (accountId) {
      try {
        await Sdk.api.users.get(accountId)
        return true
      } catch (e) {
        if (e instanceof errors.NotFoundError) {
          return false
        }
        throw e
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';
</style>
