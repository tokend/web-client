<template>
  <div>
    <h2 class="auth-page__form-title">{{ i18n.lbl_account_recovery() }}</h2>
    <form
      novalidate
      @submit.prevent="submit">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field-unchained
            class="input-field"
            id="recovery-email"
            name="email"
            :error-message="errorMessage('email')"
            :label="i18n.lbl_email()"
            v-model.trim="form.email"
            v-validate="'required|email'"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field-unchained
            class="input-field"
            type="password"
            id="recovery-seed"
            name="seed"
            :label="i18n.lbl_recovery_seed()"
            :error-message="errorMessage('seed')"
            v-model.trim="form.recoverySeed"
            v-validate="'required|secret_key'"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field-unchained
            class="input-field"
            id="recovery-password"
            type="password"
            name="password"
            :toggle-password="true"
            :label="i18n.lbl_pwd()"
            :error-message="errorMessage('password')"
            v-model.trim="form.password"
            v-validate="'required|min:6'"
          />
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field-unchained
            class="input-field"
            id="recovery-confirm-password"
            type="password"
            name="confirm-password"
            :toggle-password="true"
            :label="i18n.lbl_pwd_confirm()"
            :error-message="errorMessage('confirm-password')"
            :data-vv-as="i18n.lbl_pwd().toLowerCase()"
            v-validate="'required|confirmed:password'"
            v-model.trim="form.confirmPassword"
          />
        </div>
      </div>

      <div class="auth-page__submit">
        <button
          type="submit"
          class="auth-page__submit-btn"
          :disabled="isPending"
          v-ripple>
          {{ i18n.lbl_make_recovery() }}
        </button>
      </div>
      <div class="auth-page__tips">
        <div class="auth-page__tip">
          {{ i18n.auth_know_credentials() }}
          <router-link
            class="auth-page__tip-link"
            :to="routes.login">
            {{ i18n.lbl_signin_now() }}
          </router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '../common/mixins/form.mixin'

import { EventDispatcher } from '../../js/events/event_dispatcher'
import { ErrorHandler } from '../../js/errors/error_handler'
import { vueRoutes } from '../../vue-router/const'
import { errors } from '../../js/errors/factory'
import { i18n } from '../../js/i18n/index'

import { authService } from '../../js/services/auth.service'

export default {
  name: 'recovery',
  mixins: [FormMixin],

  data () {
    return {
      form: {
        email: '',
        password: '',
        recoverySeed: '',
        confirmPassword: ''
      },
      routes: vueRoutes,
      i18n
    }
  },

  methods: {
    async submit () {
      if (!await this.isValid()) return
      this.disable()
      try {
        await authService.makeRecovery({
          recoverySeed: this.form.recoverySeed,
          newPassword: this.form.password,
          email: this.form.email
        })
        EventDispatcher.dispatchShowSuccessEvent(i18n.auth_recovered())
        this.$router.push(vueRoutes.login)
      } catch (error) {
        console.error(error)
        switch (error.constructor) {
          case errors.NotFoundError:
            error.showBanner(i18n.auth_recovery_wallet_not_found())
            break
          case errors.EmailNotVerifiedError:
            error.showBanner(i18n.auth_email_not_verified_on_recovery())
            break
          default:
            ErrorHandler.processUnexpected(error)
        }
      }
      this.enable()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'auth';
</style>
