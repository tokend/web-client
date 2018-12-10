<template>
  <div class="auth-page">
    <h2 class="auth-page__title">{{ 'auth.get-started' | globalize }}</h2>

    <div class="auth-page__content">
      <signup-form />
    </div>

    <div class="auth-page__tips">
      <div class="auth-page__tip">
        {{ 'auth.have-an-account-question' | globalize }}
        <router-link class="auth-page__tip-link" to="/sign-in">
          {{ 'auth.have-an-account-answer' | globalize }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import SignupForm from '../forms/SignupForm'

export default {
  name: 'signup',
  components: {
    SignupForm
  }
}
</script>

<style lang="scss" scoped>
@import './auth-page';
</style>
