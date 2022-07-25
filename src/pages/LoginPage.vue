<script lang="ts" setup>
import LoginForm from '@/forms/LoginForm.vue'
</script>

<template>
  <div class="login-page">
    <login-form class="login-page__form" />
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: grid;
  place-items: center;
}
</style>
