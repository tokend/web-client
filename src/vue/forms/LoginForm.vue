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
        {{ 'auth-pages.log-in' | globalize }}
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
    }),
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        await this.loadWallet(this.form)
        const accountId = this[vuexTypes.wallet].accountId
        Sdk.sdk.useWallet(this[vuexTypes.wallet])
        if (!await this.isUserExist(accountId)) {
          await Sdk.api.users.create(accountId)
        }
        await this.loadAccount(accountId)
        this.$router.push({ name: 'app' })
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
          return
        }
        ErrorHandler.process(e)
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
