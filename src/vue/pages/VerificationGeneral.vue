<template>
  <div class="verification-general">
    <h5 class="verification-container__heading">
      {{ 'general-form.account-information-lbl' | globalize }}
    </h5>

    <kyc-general-form
      class="verification-container__form"
      :former="former"
      @submitted="onFormSubmit"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { scrollToTop } from '@/js/helpers/scroll-helpers'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'
import KycGeneralForm from '@/vue/forms/KycGeneralForm'

export default {
  name: 'verification-general',

  components: {
    KycGeneralForm,
  },

  computed: {
    ...mapGetters({ kycRequest: vuexTypes.kycRequest }),

    former () {
      return new KycGeneralFormer(this.kycRequest)
    },
  },

  methods: {
    async onFormSubmit () {
      scrollToTop()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './verification/styles';
</style>
