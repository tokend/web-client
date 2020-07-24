<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{ 'auth-pages.sign-in' | globalize }}
    </h2>

    <div class="auth-page__content">
      <template v-if="isVerifyingEmail">
        <loader
          class="auth-page__verification-loader"
          message-id="auth-pages.verifying-email-msg"
        />
      </template>

      <template v-else>
        <login-form />

        <i18n
          path="auth-pages.no-account"
          class="auth-page__tip"
          tag="p"
        >
          <template #registerLink>
            <router-link
              class="auth-page__tip-link"
              :to="vueRoutes.signup"
            >
              {{ 'auth-pages.register-link' | globalize }}
            </router-link>
          </template>
        </i18n>

        <i18n
          path="auth-pages.forgot-pwd"
          class="auth-page-tip"
          tag="p"
        >
          <template #recoveryLink>
            <router-link
              class="auth-page__tip-link"
              :to="vueRoutes.kycRecoveryInit"
            >
              {{ 'auth-pages.recovery-link' | globalize }}
            </router-link>
          </template>
        </i18n>
      </template>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/vue/forms/LoginForm'
import Loader from '@/vue/common/Loader'

import { vueRoutes } from '@/vue-router/routes'
import { Bus } from '@/js/helpers/event-bus'

import { walletsManager } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'login',
  components: {
    LoginForm,
    Loader,
  },
  data: _ => ({
    vueRoutes,
    isVerifyingEmail: false,
  }),
  async created () {
    try {
      // Verifying email if user came here from email link
      const verificationCode = this.$route.params.encodedVerificationCode
      if (verificationCode) {
        this.isVerifyingEmail = true
        await walletsManager.verifyEmail(verificationCode)
        Bus.success('auth-pages.email-verified')
        this.isVerifyingEmail = false
      }
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },
}
</script>

<style lang="scss" scoped>
@import './auth-page';

.auth-page__tip {
  margin-top: 5rem;
}
</style>
