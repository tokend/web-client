<template>
  <div class="kyc-recovery-unverified">
    <h1>L O R E M</h1>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'kyc-recovery-unverified',
  components: {
  },
  data: _ => ({
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
      await this.sendKycRecoveryRequest()
      Bus.success('verification-form.request-submitted-msg')
    } catch (e) {
      ErrorHandler.process(e)
    }
  },

  methods: {
    ...mapActions({
      sendKycRecoveryRequest: vuexTypes.SEND_KYC_RECOVERY_REQUEST,
    }),
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

</style>
