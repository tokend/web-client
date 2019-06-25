<template>
  <div class="kyc-recovery-management">
    <template v-if="isLoaded">
      <verification-general-form v-if="isAccountGeneral" />
      <verification-corporate-form />
    </template>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
// import { Bus } from '@/js/helpers/event-bus'
// import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

import VerificationGeneralForm from '@/vue/modules/verification/general-form/index'
import VerificationCorporateForm from '@/vue/pages/VerificationCorporate'

export default {
  name: 'kyc-recovery-management',
  components: {
    VerificationGeneralForm,
    VerificationCorporateForm,
  },
  data: _ => ({
    isLoaded: false,
    isLoadingFailed: false,
    isSubmitting: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.kvDefaultSignerRoleId,
      vuexTypes.kycRecoveryState,
      vuexTypes.kycRecoveryRequestId,
      vuexTypes.isAccountGeneral,
      vuexTypes.isAccountCorporate,
      vuexTypes.isAccountUnverified,
    ]),
  },

  async created () {
    try {
      await this.loadKycRecovery()
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
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

.kyc-recovery-management {
  display: flex;
  justify-content: center;
}
</style>
