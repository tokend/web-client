<script lang="ts" setup>
import LoginForm from '@/forms/LoginForm.vue'
import { AppLogo } from '@/common'
</script>

<template>
  <div class="login-page">
    <div class="login-page__greetings">
      <span class="login-page__over-title">
        {{ $t('login-page.over-title') }}
      </span>
      <h1 class="login-page__title">
        {{ $t('login-page.title') }}
      </h1>
    </div>
    <div class="login-page__interaction">
      <app-logo class="login-page__logo" />
      <login-form class="login-page__form" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.login-page__greetings {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(var(--primary-light) 0%, var(--primary-dark) 65%);
  padding: toRem(80) toRem(110);
}

.login-page__over-title {
  font-size: toRem(24);
  margin-bottom: toRem(56);
}

.login-page__title {
  font-size: toRem(56);
  max-width: toRem(450);
}

.login-page__interaction {
  display: flex;
  flex-direction: column;
  padding: toRem(80) toRem(110);
}

.login-page__logo {
  max-width: toRem(100);
}

.login-page__form {
  margin: auto 0;
}
</style>
