<template>
  <div class="kyc-recovery-unverified">
    <i
      class="mdi kyc-recovery-unverified__icon"
      :class="{
        'mdi-restart-off': isRejected,
        'mdi-restart': !isRejected,
      }"
    />
    <template v-if="kycRecoveryRequest.isExists">
      <h2 class="kyc-recovery-unverified__msg">
        {{ kycRecoveryMessageTranslationId | globalize }}
      </h2>
    </template>
    <button
      v-if="isRejected"
      @click="sendRequest"
      class="app__button-raised kyc-recovery-unverified__button"
      :disabled="isSubmitting"
    >
      {{ 'kyc-recovery.submit-again-lbl' | globalize }}
    </button>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { delay } from '@/js/helpers/delay'
import { buildKycRecoveryOp } from '@/js/helpers/kyc-helpers'
import { Bus } from '@/js/helpers/event-bus'
import { api } from '@/api'
import config from '@/config'

export default {
  name: 'kyc-recovery-unverified',
  data: _ => ({
    isSubmitting: false,
  }),

  computed: {
    ...mapGetters({
      kycRecoveryRequest: vuexTypes.kycRecoveryRequest,
      isAccountKycRecoveryInitiated: vuexTypes.isAccountKycRecoveryInitiated,
    }),

    isRejected () {
      const request = this.kycRecoveryRequest
      return request.isRejected || request.isPermanentlyRejected
    },

    kycRecoveryMessageTranslationId () {
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
  },

  created () {
    if (this.isAccountKycRecoveryInitiated) {
      this.sendRequest()
    }
  },

  methods: {
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKycRecovery: vuexTypes.LOAD_KYC_RECOVERY,
    }),

    async sendRequest () {
      this.isSubmitting = true
      try {
        const requestId = this.kycRecoveryRequest.updatableId
        const op = buildKycRecoveryOp({ requestId })
        await api.postOperations(op)

        await delay(config.RELOAD_TIMEOUT)
        await this.loadAccount()
        await this.loadKycRecovery()
        Bus.success('kyc-recovery.request-submitted-msg')
        this.$emit('submitted')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isSubmitting = false
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
