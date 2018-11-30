<template>
  <div class="login">
    <h2 class="login__title">{{ 'auth.sign-in' | globalize }}</h2>

    <div class="login__content">
      <login-form />
    </div>

    <div class="login__tips">
      <div class="login__tip">
        {{ 'auth.no-account-question' | globalize }}
        <router-link class="login__tip-link" to="/sign-in">
          {{ 'auth.no-account-answer' | globalize }}
        </router-link>
      </div>
      <div class="login__tip">
        {{ 'auth.forgot-pwd-question' | globalize }}
        <router-link class="login__tip-link" to="/sign-in">
          {{ 'auth.forgot-pwd-answer' | globalize }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '../forms/LoginForm'

export default {
  name: 'login',
  components: {
    LoginForm
  }
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.login__title {
  font-size: 3.2 * $point;
  font-weight: 400;
  margin-bottom: 2.4 * $point;
  color: $col-text-page-heading;
}

.login__content {
  margin-bottom: 5.5 * $point;
}

.login__tip-link {
  // TODO: remove !important once md will be completely out
  color: $col-text-auth-tip-link !important;
  text-decoration: underline;
}
</style>
