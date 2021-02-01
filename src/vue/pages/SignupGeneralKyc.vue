<template>
  <div class="auth-page">
    <template>
      <h2 class="auth-page__title">
        {{ 'auth-pages.signup-general-kyc-title' | globalize }}
      </h2>

      <div class="auth-page__content">
        <kyc-general-form />
      </div>
    </template>
  </div>
</template>

<script>
import KycGeneralForm from '@/vue/forms/KycGeneralForm'

export default {
  name: 'signup-general-kyc',
  components: {
    KycGeneralForm,
  },
}
</script>

<style lang="scss">
@import './auth-page';

</style>
