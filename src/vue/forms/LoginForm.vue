<template>
  <form class="app-form auth-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="_touchField('form.email')"
          id="login-email"
          :label="'auth-pages.email' | globalize"
          :error-message="_getErrorMessage('form.email')"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.password"
          @blur="_touchField('form.password')"
          id="login-password"
          :error-message="_getErrorMessage('form.password')"
          :label="'auth-pages.password' | globalize"
          :type="'password'"
        />
      </div>
    </div>
    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="auth-form__submit-btn"
        :disabled="_isDisabled"
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
import { vueRoutes } from '@/vue-router'

import { Sdk } from '@/sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@tokend/js-sdk'

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
  computed: {
    ...mapGetters('new-wallet', [
      vuexTypes.wallet
    ])
  },
  methods: {
    ...mapActions('new-wallet', {
      loadWallet: vuexTypes.LOAD_WALLET
    }),
    async submit () {
      if (!this._isFormValid()) return
      this._disableForm()
      try {
        await this.loadWallet(this.form)
        const accountId = this.wallet.accountId
        Sdk.sdk.useWallet(this.wallet)
        if (!await this.isUserExist(accountId)) {
          await Sdk.api.users.create(accountId)
        }
        await this._doLegacyStuff()
      } catch (e) {
        if (e instanceof errors.VerificationRequiredError) {
          this.$router.push({
            ...vueRoutes.verify,
            params: {
              paramsBase64: btoa(JSON.stringify({
                walletId: e.meta.walletId,
                email: this.form.email
              }))
            }
          })
          return
        }
        console.error(e)
        ErrorHandler.process(e)
      }
      this._enableForm()
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
    // TODO: we support old vuex for the legacy components. Remove once
    // the legacy will be completely removed
    async _doLegacyStuff () {
      await this.$store.dispatch('PROCESS_USER_WALLET', this.form)
      await Promise.all([
        await this.$store.dispatch('GET_ACCOUNT_DETAILS'),
        await this.$store.dispatch('GET_USER_DETAILS'),
        await this.$store.dispatch('GET_ACCOUNT_BALANCES')
      ])
      this.$store.dispatch('LOG_IN')
      this.$router.push({ name: 'app' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';
</style>
