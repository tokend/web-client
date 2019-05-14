<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{ 'auth-pages.sign-in' | globalize }}
    </h2>

    <div class="auth-page__content">
      <template v-if="isVerifyingEmail">
        <loader message-id="auth-pages.verifying-email-msg" />
      </template>

      <template v-else>
        <login-form />

        <div class="auth-page__tips">
          <div class="auth-page__tip">
            {{ 'auth-pages.no-account-question' | globalize }}
            <router-link class="auth-page__tip-link" :to="vueRoutes.signup">
              {{ 'auth-pages.no-account-answer' | globalize }}
            </router-link>
          </div>
          <div class="auth-page__tip">
            {{ 'auth-pages.forgot-pwd-question' | globalize }}
            <router-link class="auth-page__tip-link" :to="vueRoutes.recovery">
              {{ 'auth-pages.forgot-pwd-answer' | globalize }}
            </router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/vue/forms/LoginForm'
import { vueRoutes } from '@/vue-router/routes'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'login',
  components: {
    LoginForm,
  },
  data: _ => ({
    vueRoutes,
    isVerifyingEmail: false,
  }),
  async created () {
    // Verifying email if user came here from email link
    const emailAction = this.$route.params.encodedEmailAction
    if (emailAction) {
      this.isVerifyingEmail = true
      await Sdk.api.wallets.verifyEmail(emailAction)
      Bus.success('auth-pages.email-verified')
      this.isVerifyingEmail = false
    }
  },
}
</script>

<style lang="scss" scoped>
@import './auth-page';
</style>
