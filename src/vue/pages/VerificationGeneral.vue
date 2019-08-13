<template>
  <div class="verification-general-form">
    <p class="verification-general-form__account-info-title">
      {{ 'verification-form.account-information-lbl' | globalize }}
    </p>

    <general-kyc-form
      class="verification-general-form__tag"
      @submitted="showSuccessMessage()"
    />
  </div>
</template>

<script>
import GeneralKycForm from '@/vue/forms/GeneralKycForm'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'verification-general-form',
  components: {
    GeneralKycForm,
  },

  methods: {
    showSuccessMessage () {
      Bus.success('verification-form.request-submitted-msg')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.verification-general-form {
  margin-top: 4rem;
}

.verification-general-form__account-info-title {
  color: $col-primary;
  font-size: 1.3rem;
}

.verification-general-form__tag {
  margin-top: 1rem;
  background-color: $col-block-bg;
  padding: 2.4rem;

  @include box-shadow();
}

</style>
