<template>
  <div
    v-if="kycRecoveryRequest.isExists"
    class="kyc-recovery-state-message"
    :class="`kyc-recovery-state-message--${kycRecoveryRequest.state}`"
  >
    <div class="kyc-recovery-state-message__content">
      <h2 class="kyc-recovery-state-message__title">
        {{ kycRecoveryTitleTranslationId | globalize }}
      </h2>
      <h3 class="kyc-recovery-state-message__description">
        {{ kycRecoveryDescriptionTranslationId | globalize }}
      </h3>

      <div
        v-if="kycRecoveryRequest.rejectReason"
        class="kyc-recovery-state-message__reason"
      >
        <p class="kyc-recovery-state-message__reason-title">
          {{ kycRecoveryReasonTranslationId | globalize }}
        </p>

        <p class="kyc-recovery-state-message__reason-msg">
          {{ kycRecoveryRequest.rejectReason }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'kyc-recovery-state-message',

  computed: {
    ...mapGetters({
      kycRecoveryRequest: vuexTypes.kycRecoveryRequest,
    }),

    kycRecoveryTitleTranslationId () {
      const request = this.kycRecoveryRequest
      switch (true) {
        case request.isPermanentlyRejected:
          return 'kyc-recovery-state-message.permanently-rejected-title'
        case request.isPending:
          return 'kyc-recovery-state-message.pending-title'
        case request.isApproved:
          return 'kyc-recovery-state-message.approved-title'
        case request.isRejected:
          return 'kyc-recovery-state-message.rejected-title'
        default:
          const errMsg = `Unknown kyc recovery state. got: ${request.stateI}`
          ErrorHandler.processWithoutFeedback(new Error(errMsg))
          return ''
      }
    },

    kycRecoveryDescriptionTranslationId () {
      const request = this.kycRecoveryRequest
      switch (true) {
        case request.isPermanentlyRejected:
          return 'kyc-recovery-state-message.permanently-rejected-desc'
        case request.isPending:
          return 'kyc-recovery-state-message.pending-desc'
        case request.isApproved:
          return 'kyc-recovery-state-message.approved-desc'
        case request.isRejected:
          return 'kyc-recovery-state-message.rejected-desc'
        default:
          const errMsg = `Unknown kyc recovery state. got: ${request.stateI}`
          ErrorHandler.processWithoutFeedback(new Error(errMsg))
          return ''
      }
    },

    kycRecoveryReasonTranslationId () {
      const request = this.kycRecoveryRequest
      switch (true) {
        case request.isPermanentlyRejected:
          return 'kyc-recovery-state-message.permanently-rejected-reason'
        case request.isPending:
          return 'kyc-recovery-state-message.pending-reason'
        case request.isApproved:
          return 'kyc-recovery-state-message.approved-reason'
        case request.isRejected:
          return 'kyc-recovery-state-message.rejected-reason'
        default:
          const errMsg = `Unknown kyc recovery state. got: ${request.stateI}`
          ErrorHandler.processWithoutFeedback(new Error(errMsg))
          return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.kyc-recovery-state-message {
  margin-top: 5rem;

  &--approved {
    background-color: $col-request-approved;
  }

  &--pending {
    background-color: $col-request-pending;
  }

  &--rejected,
  &--permanently_rejected {
    background-color: $col-request-rejected;
  }
}

.kyc-recovery-state-message__content {
  padding: 2.4rem;
  font-size: 1.4rem;
  color: $col-message-box-text;
  word-wrap: break-word;
  line-height: 1.25;
}

.kyc-recovery-state-message__description {
  margin-top: 0.4rem;
}

.kyc-recovery-state-message__reason {
  margin-top: 1.6rem;
}

.kyc-recovery-state-message__reason-msg {
  margin-bottom: 1rem;
}

.kyc-recovery-state-message__reason-title {
  font-weight: 700;
}
</style>
