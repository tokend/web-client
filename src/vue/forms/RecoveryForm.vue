<template>
  <form class="app-form auth-form" @submit.prevent="submit">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.email"
          @blur="touchField('form.email')"
          id="recovery-email"
          name="recovery-email"
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
          id="recovery-password"
          name="recovery-password"
          type="password"
          :error-message="getFieldErrorMessage('form.password')"
          :label="'auth-pages.new-password' | globalize"
          :white-autofill="false"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.confirmPassword"
          @blur="touchField('form.confirmPassword')"
          id="recovery-confirm-password"
          name="recovery-password-confirm"
          type="password"
          :error-message="getFieldErrorMessage('form.confirmPassword')"
          :label="'auth-pages.confirm-password' | globalize"
          :white-autofill="false"
        />
      </div>
    </div>
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.recoverySeed"
          @blur="touchField('form.recoverySeed')"
          id="recovery-seed"
          name="recovery-seed"
          type="password"
          :error-message="getFieldErrorMessage('form.recoverySeed')"
          :label="'auth-pages.recovery-seed' | globalize"
          :white-autofill="false"
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
        {{ 'auth-pages.recover-lbl' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import {
  required,
  password,
  sameAs,
  email,
  seed,
} from '@validators'
import { Sdk } from '@/sdk'
import { Api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { errors } from '@/js/errors'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { vueRoutes } from '@/vue-router/routes'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'recovery-form',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      email: '',
      password: '',
      confirmPassword: '',
      recoverySeed: '',
    },
  }),
  validations: {
    form: {
      email: { required, email },
      password: { required, password },
      confirmPassword: {
        required,
        password,
        sameAsPassword: sameAs(function () { return this.form.password }),
      },
      recoverySeed: { required, seed },
    },
  },
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
  methods: {
    ...mapActions({
      loadWallet: vuexTypes.LOAD_WALLET,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKyc: vuexTypes.LOAD_KYC,
      loadKvEntries: vuexTypes.LOAD_KV_ENTRIES,
    }),
    async submit () {
      if (!this.isFormValid()) {
        return
      }
      this.disableForm()
      try {
        await Sdk.api.wallets.recovery(
          this.form.email.toLowerCase(),
          this.form.recoverySeed,
          this.form.password
        )

        await this.login()

        Bus.success('auth-pages.recovered')
        this.$router.push(vueRoutes.app)
      } catch (e) {
        switch (e.constructor) {
          case errors.NotFoundError:
            Bus.error('errors.user-doesnt-exist')
            ErrorHandler.processWithoutFeedback(e)
            break
          default:
            ErrorHandler.process(e)
        }
      }
      this.enableForm()
    },

    async login () {
      await this.loadWallet({
        email: this.form.email,
        password: this.form.password,
      })
      const accountId = this.wallet.accountId
      Sdk.sdk.useWallet(this.wallet)
      Api.useWallet(this.wallet)

      await this.loadAccount(accountId)
      await this.loadKvEntries()
      await this.loadKyc()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import './auth-form';
</style>
