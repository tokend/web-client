<template>
  <div class="auth-page">
    <h2 class="auth-page__title">{{ 'auth-pages.log-in' | globalize }}</h2>

    <div class="auth-page__content">
      <login-form />
    </div>

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
  </div>
</template>

<script>
import LoginForm from '../forms/LoginForm'
import { vueRoutes } from '@/vue-router/routes'
import { Sdk } from '@/sdk'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'login',
  components: {
    LoginForm
  },
  data: _ => ({
    vueRoutes
  }),
  async created () {
    // Verifying email if user came here from email link
    const emailAction = this.$route.params.encodedEmailAction
    if (emailAction) {
      await Sdk.api.wallets.verifyEmail(emailAction)
      Bus.success('auth-pages.email-verified')
    }
  }
}
</script>

<style lang="scss" scoped>
@import './auth-page';
</style>
