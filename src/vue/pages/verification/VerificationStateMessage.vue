<template>
  <div
    v-if="verificationState"
    class="verification-state-message"
    :class="`verification-state-message--${verificationState}`"
  >
    <div class="verification-state-message__content">
      <h3 class="verification-state-message__title">
        {{ verificationTitleTranslationId | globalize }}
      </h3>

      <p class="verification-state-message__description">
        {{ verificationDescriptionTranslationId | globalize }}
      </p>

      <div
        v-if="verificationReason"
        class="verification-state-message__reason"
      >
        <p class="verification-state-message__reason-title">
          {{ verificationReasonTranslationId | globalize }}
        </p>

        <p class="verification-state-message__reason-msg">
          {{ verificationReason }}
        </p>

        <div
          v-if="Object.keys(kycRequest.externalDetails || {}).length > 0"
          class="verification-state-message__external-details"
        >
          <h4 class="verification-state-message__external-details-title">
            {{ 'verification-state-message.additional-info-title' | globalize }}
          </h4>
          <p
            v-for="(value, key) in kycRequest.externalDetails"
            class="verification-state-message__external-detail-msg"
            :key="key"
          >
            {{ key }}: {{ value }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const VERIFICATION_STATES = {
  blocked: 'blocked',
  reset: 'reset',
  approved: 'approved',
  pending: 'pending',
  rejected: 'rejected',
  permanentlyRejected: 'permanently-rejected',
}

export default {
  name: 'verification-state-message',

  computed: {
    ...mapGetters({
      kycRequest: vuexTypes.kycRequest,
      isAccountBlocked: vuexTypes.isAccountBlocked,
    }),

    verificationState () {
      switch (true) {
        case this.isAccountBlocked: return VERIFICATION_STATES.blocked
        case this.kycRequest.isReset: return VERIFICATION_STATES.reset
        case this.kycRequest.isApproved: return VERIFICATION_STATES.approved
        case this.kycRequest.isPending: return VERIFICATION_STATES.pending
        case this.kycRequest.isRejected: return VERIFICATION_STATES.rejected
        case this.kycRequest.isPermanentlyRejected:
          return VERIFICATION_STATES.permanentlyRejected
        default: return ''
      }
    },

    verificationReason () {
      switch (this.verificationState) {
        case VERIFICATION_STATES.blocked:
          return this.kycRequest.blockReason
        case VERIFICATION_STATES.reset:
          return this.kycRequest.resetReason
        case VERIFICATION_STATES.rejected:
        case VERIFICATION_STATES.permanentlyRejected:
          return this.kycRequest.rejectReason
        default:
          return ''
      }
    },

    verificationTitleTranslationId () {
      return `verification-state-message.${this.verificationState}-title`
    },

    verificationDescriptionTranslationId () {
      return `verification-state-message.${this.verificationState}-desc`
    },

    verificationReasonTranslationId () {
      return `verification-state-message.${this.verificationState}-reason`
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.verification-state-message {
  &--approved {
    background-color: $col-request-approved;
  }

  &--pending {
    background-color: $col-request-pending;
  }

  &--rejected,
  &--blocked,
  &--reset,
  &--permanently-rejected {
    background-color: $col-request-rejected;
  }
}

.verification-state-message__content {
  padding: 2.4rem;
  font-size: 1.4rem;
  color: $col-message-box-text;
  word-wrap: break-word;
  line-height: 1.25;
}

.verification-state-message__title {
  font-size: 1.6rem;
}

.verification-state-message__description {
  margin-top: 0.4rem;
  color: $col-message-box-text;
}

.verification-state-message__reason {
  margin-top: 1.6rem;
}

.verification-state-message__reason-msg {
  margin-bottom: 1rem;
}

.verification-state-message__reason-title {
  font-weight: 700;
}
</style>
