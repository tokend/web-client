<template>
  <div class="verification-general-2">
    <verification-general-form-module
      blob-id=""
      :request-id="'0'"
      ref="form-module-importer"
      @submit="onFormSubmit"
    />

    <div>
      <h5 class="form-todo__heading">
        {{ 'general-form.account-information-lbl' | globalize }}
      </h5>

      <kyc-general-form
        class="form-todo"
        :former="former"
        @submitted="onFormSubmit"
      />
    </div>
  </div>
</template>

<script>
import VerificationGeneralFormModule from '@/vue/modules/verification/general-form'
import KycGeneralForm from '@/vue/forms/KycGeneralForm'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { scrollToTop } from '@/js/helpers/scroll-helpers'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'

export default {
  name: 'verification-general-2',

  components: {
    VerificationGeneralFormModule,
    KycGeneralForm,
  },

  computed: {
    ...mapGetters({
      kycRequest: vuexTypes.kycRequest,
    }),

    former () {
      if (this.kycRequest.isGeneralKycRecord) {
        return new KycGeneralFormer(this.kycRequest)
      }
      return new KycGeneralFormer()
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
@import '~@/vue/forms/_app-form';

.verification-general-2 {
  display: grid;
  grid: auto / auto-flow 1fr;
}

.form-todo {
  margin-top: 1rem;
  background-color: $col-block-bg;
  padding: 2.4rem;

  @include box-shadow();
}

.form-todo__heading {
  font-size: 1.3rem;
  font-weight: 400;
  margin-top: 4rem;
}
</style>
