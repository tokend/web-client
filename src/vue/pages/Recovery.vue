<template>
  <div class="auth-page">
    <h2 class="auth-page__title">
      {{ 'auth-pages.recover-account' | globalize }}
    </h2>

    <div class="auth-page__content">
      <recovery-form />
    </div>

    <div class="auth-page__tips">
      <div class="auth-page__tip">
        {{ 'auth-pages.know-credentials-question' | globalize }}
        <router-link class="auth-page__tip-link" :to="vueRoutes.login">
          {{ 'auth-pages.know-credentials-answer' | globalize }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import RecoveryForm from '../forms/RecoveryForm'
import { vueRoutes } from '@/vue-router'

export default {
  name: 'recovery',
  components: {
    RecoveryForm
  },
  data: _ => ({
    vueRoutes
  })
}
</script>

<style lang="scss" scoped>
@import './auth-page';
</style>
