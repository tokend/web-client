<template>
  <div class="verification-general-2">
    <verification-general-form-module
      :blob-id="isFormPopulatable ? kycLatestRequestBlobId : ''"
      :request-id="isRequestUpdatable ? String(kycRequestId) : '0'"
      ref="form-module-importer"
      @submit="onFormSubmit"
    />

    <div>
      <h5 class="form-todo__heading">
        {{ 'general-form.account-information-lbl' | globalize }}
      </h5>

      <kyc-general-form class="form-todo" />
    </div>
  </div>
</template>

<script>
import VerificationGeneralFormModule from '@/vue/modules/verification/general-form'
import KycGeneralForm from '@/vue/forms/KycGeneralForm'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { Bus } from '@/js/helpers/event-bus'
import { keyValues } from '@/key-values'

export default {
  name: 'verification-general-2',
  components: {
    VerificationGeneralFormModule,
    KycGeneralForm,
  },
  computed: {
    ...mapGetters({
      kycState: vuexTypes.kycState,
      kycRequestId: vuexTypes.kycRequestId,
      kycLatestRequestBlobId: vuexTypes.kycLatestRequestBlobId,

      isAccountRoleReseted: vuexTypes.isAccountRoleReseted,
      accountRoleToSet: vuexTypes.kycAccountRoleToSet,
      previousAccountRole: vuexTypes.kycPreviousRequestAccountRoleToSet,
    }),
    isRequestUpdatable () {
      return (
        this.kycState &&
        (
          this.kycState === REQUEST_STATES_STR.pending ||
          this.kycState === REQUEST_STATES_STR.rejected
        )
      )
    },
    isFormPopulatable () {
      return this.isAccountRoleReseted
        ? this.previousAccountRole === keyValues.generalRoleId
        : (
          this.accountRoleToSet === keyValues.generalRoleId ||
          this.accountRoleToSet === keyValues.usAccreditedRoleId ||
          this.accountRoleToSet === keyValues.usVerifiedRoleId
        )
    },
  },
  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
    }),
    async onFormSubmit () {
      const formRef = this.$refs['form-module-importer'].$refs['component']
      formRef.disableForm()

      // HACK: to reduce the probability of
      // request being not ingested by API
      await this.delay(3000)
      await this.loadKyc()

      Bus.success('general-form.request-submitted-msg')
      this.scrollTop()
      formRef.enableForm()
    },
    scrollTop () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    },
    delay (ms) { // TODO: should not be here
      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
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
