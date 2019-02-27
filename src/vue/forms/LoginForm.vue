<template>
  <form class="app-form auth-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="touchField('form.email')"
          id="login-email"
          name="login-email"
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
          name="login-password"
          type="password"
          :error-message="getFieldErrorMessage('form.password')"
          :white-autofill="false"
          :label="'auth-pages.password' | globalize"
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

import { required } from '@validators'
import { vuexTypes } from '@/vuex'
import { mapActions, mapGetters } from 'vuex'
import { vueRoutes } from '@/vue-router/routes'

import { Sdk } from '@/sdk'
import { Api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@tokend/js-sdk'

export default {
  name: 'login-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      email: '',
      password: '',
    },
  }),
  validations: {
    form: {
      email: { required },
      password: { required },
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
      loadKvEntriesAccountRoleIds: vuexTypes.LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS,
    }),
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        await this.loadWallet({
          email: this.form.email.toLowerCase(),
          password: this.form.password,
        })
        const accountId = this[vuexTypes.wallet].accountId

        Sdk.sdk.useWallet(this[vuexTypes.wallet])
        Api.useWallet(this[vuexTypes.wallet])

        await this.loadAccount(accountId)
        await this.loadKvEntriesAccountRoleIds()
        await this.loadKyc()
        if (Object.keys(this.$route.query).includes('redirectPath')) {
          this.$router.push({ path: this.$route.query.redirectPath })
        } else {
          this.$router.push({ name: 'app' })
        }
      } catch (e) {
        this.processAuthError(e)
      }
      this.enableForm()
    },
    processAuthError (error) {
      switch (error.constructor) {
        case errors.VerificationRequiredError:
          this.$router.push({
            ...vueRoutes.verify,
            params: {
              paramsBase64: btoa(JSON.stringify({
                walletId: error.meta.walletId,
                email: this.form.email.toLowerCase(),
              })),
            },
          })
          break
        case errors.NotFoundError:
          ErrorHandler.process(
            error,
            'auth-pages.wrong-email-or-password-err'
          )
          break
        default:
          ErrorHandler.process(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';
</style>
