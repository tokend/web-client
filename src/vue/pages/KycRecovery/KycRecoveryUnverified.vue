<template>
  <div class="kyc-recovery-unverified">
    <template v-if="kycRecoveryState">
      <i
        class="mdi
              kyc-recovery-unverified__icon"
        :class="{
          'mdi-restart-off': isRejected,
          'mdi-restart': !isRejected
        }"
      />
      <h2 class="kyc-recovery-unverified__msg">
        {{ kycRecoveryMessageTranslationId | globalize }}
      </h2>
      <button
        v-if="isRejected"
        @click="sendRequest"
        class="app__button-raised
               kyc-recovery-unverified__button"
        :disabled="isSubmtting"
      >
        {{ 'kyc-recovery.submit-again-lbl' | globalize }}
      </button>
    </template>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

const EVENTS = {
  kycRecoverySubmit: 'kyc-recovery-submit',
}

export default {
  name: 'kyc-recovery-unverified',
  data: _ => ({
    isSubmtting: false,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.kycRecoveryState,
      vuexTypes.isKycRecoveryInited,
      vuexTypes.isKycRecoveryRejected,
      vuexTypes.isKycRecoveryPermanentlyRejected,
    ]),

    isRejected () {
      return this.isKycRecoveryRejected || this.isKycRecoveryPermanentlyRejected
    },

    kycRecoveryMessageTranslationId () {
      switch (this.kycRecoveryState) {
        case REQUEST_STATES_STR.permanentlyRejected:
          return 'kyc-recovery-state-message.permanently-rejected-title'
        case REQUEST_STATES_STR.pending:
          return 'kyc-recovery-state-message.pending-title'
        case REQUEST_STATES_STR.approved:
          return 'kyc-recovery-state-message.approved-title'
        case REQUEST_STATES_STR.rejected:
          return 'kyc-recovery-state-message.rejected-title'
        default:
          ErrorHandler.processWithoutFeedback(new Error(
            'Unknown kyc recovery state. kycRecoveryState = ' +
            this.kycRecoveryState)
          )
          return ''
      }
    },
  },

  created () {
    if (this.isKycRecoveryInited) {
      this.sendRequest()
    }
  },

  methods: {
    ...mapActions({
      sendKycRecoveryRequest: vuexTypes.SEND_KYC_RECOVERY_REQUEST,
      loadKycRecovery: vuexTypes.LOAD_KYC_RECOVERY,
    }),

    async sendRequest () {
      this.isSubmtting = true
      try {
        await this.sendKycRecoveryRequest()
        this.$emit(EVENTS.kycRecoverySubmit)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isSubmtting = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.kyc-recovery-unverified {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.kyc-recovery-unverified__icon {
  font-size: 20rem;
  margin-top: 8rem;
  color: $col-secondary;
}

.kyc-recovery-unverified__msg {
  color: $col-secondary;
}

.kyc-recovery-unverified__button {
  margin-top: 2rem;
}
</style>
