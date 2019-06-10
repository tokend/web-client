<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{ 'auth-pages.kyc-recovery' | globalize }}
    </h2>

    <div class="auth-page__content">
      <wallet-recovery-form
        @submit="isEmailSent = true"
      />

      <div class="auth-page__tips">
        <div class="auth-page__tip">
          <span>
            {{ 'auth-pages.know-credentials-question' | globalize }}
          </span>
          <router-link class="auth-page__tip-link" :to="vueRoutes.login">
            {{ 'auth-pages.know-credentials-answer' | globalize }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WalletRecoveryForm from '../forms/WalletRecoveryForm'

import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'kyc-recovery',
  components: {
    WalletRecoveryForm,
  },
  data: _ => ({
    isEmailSent: false,
    vueRoutes,
  }),
}
</script>

<style lang="scss" scoped>
@import './auth-page';
</style>
