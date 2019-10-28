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
          v-if="kycRequestExternalDetails &&
            Object.keys(kycRequestExternalDetails).length > 0"
          class="verification-state-message__external-details"
        >
          <h4 class="verification-state-message__external-details-title">
            {{ 'verification-state-message.additional-info-title' | globalize }}
          </h4>
          <p
            v-for="(value, key) in kycRequestExternalDetails"
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

import { REQUEST_STATES_STR } from '@tokend/js-sdk/lib/const'

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
      kycState: vuexTypes.kycState,

      kycRejectReason: vuexTypes.kycRequestRejectReason,
      kycResetReason: vuexTypes.kycRequestResetReason,
      kycBlockReason: vuexTypes.kycRequestBlockReason,
      kycRequestExternalDetails: vuexTypes.kycRequestExternalDetails,

      isAccountRoleReseted: vuexTypes.isAccountRoleReseted,
      isAccountBlocked: vuexTypes.isAccountBlocked,
    }),

    verificationState () {
      let state

      if (this.isAccountBlocked) {
        state = VERIFICATION_STATES.blocked
      } else if (this.isAccountRoleReseted) {
        state = VERIFICATION_STATES.reset
      } else if (this.kycState === REQUEST_STATES_STR.approved) {
        state = VERIFICATION_STATES.approved
      } else if (this.kycState === REQUEST_STATES_STR.pending) {
        return VERIFICATION_STATES.pending
      } else if (this.kycState === REQUEST_STATES_STR.rejected) {
        state = VERIFICATION_STATES.rejected
      } else if (this.kycState === REQUEST_STATES_STR.permanentlyRejected) {
        state = VERIFICATION_STATES.permanentlyRejected
      }

      return state
    },

    verificationReason () {
      switch (this.verificationState) {
        case VERIFICATION_STATES.blocked:
          return this.kycBlockReason
        case VERIFICATION_STATES.reset:
          return this.kycResetReason
        case VERIFICATION_STATES.rejected:
        case VERIFICATION_STATES.permanentlyRejected:
          return this.kycRejectReason
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
  &--approved { background-color: $col-request-approved; }
  &--pending { background-color: $col-request-pending; }

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
