<template>
  <div
    v-if="kycRecoveryState"
    class="kyc-recovery-state-message"
    :class="`kyc-recovery-state-message--${kycRecoveryState}`"
  >
    <div class="kyc-recovery-state-message__content">
      <h2 class="kyc-recovery-state-message__title">
        {{ kycRecoveryTitleTranslationId | globalize }}
      </h2>
      <h3 class="kyc-recovery-state-message__description">
        {{ kycRecoveryDescriptionTranslationId | globalize }}
      </h3>

      <div
        v-if="kycRecoveryRejectReason"
        class="kyc-recovery-state-message__reason"
      >
        <p class="kyc-recovery-state-message__reason-title">
          {{ kycRecoveryReasonTranslationId | globalize }}
        </p>

        <p class="kyc-recovery-state-message__reason-msg">
          {{ kycRecoveryRejectReason }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'kyc-recovery-state-message',

  computed: {
    ...mapGetters({
      kycRecoveryState: vuexTypes.kycRecoveryState,
      kycRecoveryRejectReason: vuexTypes.kycRecoveryRejectReason,
    }),

    kycRecoveryTitleTranslationId () {
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

    kycRecoveryDescriptionTranslationId () {
      switch (this.kycRecoveryState) {
        case REQUEST_STATES_STR.permanentlyRejected:
          return 'kyc-recovery-state-message.permanently-rejected-desc'
        case REQUEST_STATES_STR.pending:
          return 'kyc-recovery-state-message.pending-desc'
        case REQUEST_STATES_STR.approved:
          return 'kyc-recovery-state-message.approved-desc'
        case REQUEST_STATES_STR.rejected:
          return 'kyc-recovery-state-message.rejected-desc'
        default:
          ErrorHandler.processWithoutFeedback(new Error(
            'Unknown kyc recovery state. kycRecoveryState = ' +
            this.kycRecoveryState)
          )
          return ''
      }
    },

    kycRecoveryReasonTranslationId () {
      switch (this.kycRecoveryState) {
        case REQUEST_STATES_STR.permanentlyRejected:
          return 'kyc-recovery-state-message.permanently-rejected-reason'
        case REQUEST_STATES_STR.pending:
          return 'kyc-recovery-state-message.pending-reason'
        case REQUEST_STATES_STR.approved:
          return 'kyc-recovery-state-message.approved-reason'
        case REQUEST_STATES_STR.rejected:
          return 'kyc-recovery-state-message.rejected-reason'
        default:
          ErrorHandler.processWithoutFeedback(new Error(
            'Unknown kyc recovery state. kycRecoveryState = ' +
            this.kycRecoveryState)
          )
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

  &--approved { background-color: $col-request-approved; }
  &--pending { background-color: $col-request-pending; }

  /* stylelint-disable selector-nested-pattern */
  &--rejected,
  &--permanently_rejected {
    background-color: $col-request-rejected;
  }
  /* stylelint-enable selector-nested-pattern */
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
