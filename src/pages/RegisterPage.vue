<script lang="ts" setup>
import RegisterForm from '@/forms/RegisterForm.vue'
import { AppLogo } from '@/common'
</script>

<template>
  <div class="register-page">
    <div class="register-page__greetings">
      <span class="register-page__over-title">
        {{ $t('register-page.over-title') }}
      </span>
      <h2 class="register-page__title">
        {{ $t('register-page.title') }}
      </h2>
    </div>
    <div class="register-page__interaction">
      <app-logo class="register-page__logo" />
      <register-form class="register-page__form" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.register-page__greetings {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(var(--primary-light) 0%, var(--primary-dark) 65%);
  padding: toRem(80) toRem(110);
}

.register-page__over-title {
  font-size: toRem(24);
  margin-bottom: toRem(56);
}

.register-page__title {
  font-size: toRem(56);
  max-width: toRem(450);
}

.register-page__interaction {
  display: flex;
  flex-direction: column;
  padding: toRem(80) toRem(110);
}

.register-page__logo {
  max-width: toRem(100);
}

.register-page__form {
  margin: auto 0;
}
</style>
