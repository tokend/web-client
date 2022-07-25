<script lang="ts" setup>
import RegisterForm from '@/forms/RegisterForm.vue'
</script>

<template>
  <div class="register-page">
    <register-form class="register-page__form" />
  </div>
</template>

<style lang="scss" scoped>
.register-page {
  display: grid;
  place-items: center;
}
</style>
