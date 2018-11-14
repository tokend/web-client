<template>
  <div>
    <h2 class="auth-page__form-title">{{ i18n.lbl_signin() }}</h2>
    <form
      novalidate
      @submit.prevent="submit">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field-unchained
            class="input-field"
            id="login-email"
            v-model.trim="form.email"
            :label="i18n.lbl_email()"
            name="email"
            :error-message="errorMessage('email')"
            v-validate="'required'"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field-unchained
            class="input-field"
            id="login-password"
            v-model.trim="form.password"
            type="password"
            :toggle-password="true"
            :label="i18n.lbl_pwd()"
            name="password"
            :error-message="errorMessage('password')"
            v-validate="'required'"
          />
        </div>
      </div>

      <div class="auth-page__submit">
        <button
          type="submit"
          class="auth-page__submit-btn"
          :disabled="isPending"
          v-ripple>
          {{ i18n.log_signin() }}
        </button>
      </div>

      <div class="auth-page__tips">
        <div class="auth-page__tip">
          {{ i18n.log_dont_have_an_account() }}
          <router-link
            class="auth-page__tip-link"
            :to="{ name: 'signup' }">
            {{ i18n.log_register_now() }}
          </router-link>
        </div>
        <div class="auth-page__tip">
          {{ i18n.log_forgot_password() }}
          <router-link
            class="auth-page__tip-link"
            :to="{ name: 'recovery' }">
            {{ i18n.log_recover_it() }}
          </router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import formMixin from '../common/mixins/form.mixin'

import { errors } from '../../js/errors/factory'
import { EventDispatcher } from '../../js/events/event_dispatcher'
import { ErrorHandler } from '../../js/errors/error_handler'
import { dispatchAppEvent } from '../../js/events/helpers'
import { commonEvents } from '../../js/events/common_events'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '../../vuex/types'
import { vueRoutes } from '../../vue-router/const'

import { confirmAction } from '../../js/modals/confirmation_message'
import { showAlert } from '../../js/modals/alert_message'
import { WalletHelper } from '../../js/helpers/wallet.helper'
import { walletService } from '../../js/services/wallet.service'
import { emailService } from '../../js/services/email.service'
import { usersService } from '../../js/services/users.service'

import { i18n } from '../../js/i18n/index'

export default {
  mixins: [formMixin],

  data: () => ({
    form: {
      password: '',
      email: ''
    },
    i18n,
    hasSeenWarning: null
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.accountType,
      vuexTypes.accountBlocked
    ]),
    verifyEmailParams () {
      const token = this.$route.params.token
      const walletId = this.$route.params.walletId
      if (token && walletId) return { token, walletId }
      return null
    }
  },

  created () {
    if (this.verifyEmailParams) return this.verifyEmail()
    this.hasSeenWarning = localStorage.hasOwnProperty('seenBlockWarning')
  },

  methods: {
    ...mapActions({
      setUserLoggedIn: vuexTypes.LOG_IN, // TODO

      processUserWallet: vuexTypes.PROCESS_USER_WALLET,
      loadAccount: vuexTypes.GET_ACCOUNT_DETAILS,
      loadUser: vuexTypes.GET_USER_DETAILS,
      loadBalances: vuexTypes.GET_ACCOUNT_BALANCES
    }),

    async submit () {
      if (!await this.isValid()) return
      this.form.email = this.form.email.toLowerCase()
      this.disable()
      try {
        await this.processUserWallet(this.form)
        if (!await usersService.checkIfUserExists()) {
          await usersService.createUser(this.accountId)
        }
        await this.fetchUserDetails()
        await this.enterApplication()
      } catch (error) {
        switch (error.constructor) {
          case errors.NotFoundError:
            error.showBanner(i18n.auth_not_found())
            break
          case errors.EmailNotVerifiedError:
            this.handleNotVerifiedError()
            break
          default:
            ErrorHandler.processUnexpected(error)
        }
      }
      this.enable()
    },

    async fetchUserDetails () {
      await Promise.all([
        this.loadUser(),
        this.loadAccount(),
        this.loadBalances()
      ])
    },

    enterApplication () {
      this.setUserLoggedIn()
      dispatchAppEvent(commonEvents.enterAppEvent)
      this.$router.push(this.$route.params.redirect || vueRoutes.app)
      if (this.accountBlocked) {
        if (!this.hasSeenWarning) {
          localStorage.setItem(
            'seenBlockWarning',
            'User acknowledged about block'
          )
          this.hasSeenWarning = true
          showAlert({
            title: i18n.mod_accountBlocked_title(),
            message: i18n.mod_accountBlocked_message()
          })
        }
      }
    },

    // TODO: wtf, need drop this away
    async handleNotVerifiedError () {
      if (!await confirmAction({
        title: i18n.mod_email_not_verified_title(),
        message: i18n.mod_email_not_verified_message()
      })) return
      this.disable()
      try {
        const kdf = await walletService.loadKdfParamsForEmail(this.form.email)
        const { walletId } = WalletHelper.calculateWalletParams(
          this.form.password,
          this.form.email,
          kdf.attributes().salt,
          kdf.attributes()
        )
        await emailService.sendResendEmailRequest(walletId)
        EventDispatcher.dispatchShowSuccessEvent(i18n.auth_email_sent())
      } catch (error) {
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },

    async verifyEmail () {
      try {
        await emailService.sendVerifyEmailRequest(
          this.verifyEmailParams.token,
          this.verifyEmailParams.walletId
        )
        EventDispatcher.dispatchShowSuccessEvent(i18n.auth_email_verified())
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'auth';
</style>
