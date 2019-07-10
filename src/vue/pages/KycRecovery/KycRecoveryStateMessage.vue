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

export default {
  name: 'kyc-recovery-state-message',

  computed: {
    ...mapGetters({
      kycRecoveryState: vuexTypes.kycRecoveryState,
      kycRecoveryRejectReason: vuexTypes.kycRecoveryRejectReason,
    }),

    kycRecoveryTitleTranslationId () {
      return this.getKycRecoveryLocalizationSegment('title')
    },

    kycRecoveryDescriptionTranslationId () {
      return this.getKycRecoveryLocalizationSegment('desc')
    },

    kycRecoveryReasonTranslationId () {
      return this.getKycRecoveryLocalizationSegment('reason')
    },
  },
  methods: {
    getKycRecoveryLocalizationSegment (type) {
      const segment = 'kyc-recovery-state-message.'
      switch (this.kycRecoveryState) {
        case REQUEST_STATES_STR.permanentlyRejected:
          return segment + 'permanently-rejected-' + type
        case REQUEST_STATES_STR.pending:
          return segment + 'pending-' + type
        case REQUEST_STATES_STR.approved:
          return segment + 'approved-' + type
        case REQUEST_STATES_STR.rejected:
          return segment + 'rejected-' + type
        default:
          console.error(
            'Unknown kyc recovery state. kycRecoveryState = ' +
            this.kycRecoveryState
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
  color: $col-primary-txt;
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
