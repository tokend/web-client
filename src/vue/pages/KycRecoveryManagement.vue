<template>
  <div class="kyc-recovery-management">
    <div
      v-if="isLoaded"
      class="kyc-recovery-management__inner">
      <kyc-recovery-unverified v-if="isAccountUnverified" />
      <verification-general-form v-else-if="isAccountGeneral" />
      <verification-corporate-form v-else-if="isAccountCorporate" />
    </div>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
// import { Bus } from '@/js/helpers/event-bus'
import KycRecoveryUnverified from '@/vue/pages/KycRecoveryUnverified'
import VerificationGeneralForm from '@/vue/modules/verification/general-form/index'
import VerificationCorporateForm from '@/vue/pages/VerificationCorporate'

export default {
  name: 'kyc-recovery-management',
  components: {
    KycRecoveryUnverified,
    VerificationGeneralForm,
    VerificationCorporateForm,
  },
  data: _ => ({
    isLoaded: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.kycRecoveryState,
      vuexTypes.kycRecoveryRequestId,
      vuexTypes.isAccountGeneral,
      vuexTypes.isAccountCorporate,
      vuexTypes.isAccountUnverified,
      vuexTypes.isKycRecoveryInited,
    ]),
  },

  async created () {
    try {
      if (!this.isKycRecoveryInited) {
        await this.loadKycRecovery()
      }
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    ...mapActions({
      loadKycRecovery: vuexTypes.LOAD_KYC_RECOVERY,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

// .kyc-recovery-management {
//   // display: flex;
//   // justify-content: center;
// }

.kyc-recovery-management__inner {
  padding: 3.5rem 16rem;
}
</style>
