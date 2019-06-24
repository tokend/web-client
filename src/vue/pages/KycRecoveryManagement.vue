<template>
  <div class="kyc-recovery-management">
    <kyc-recovery-general-form
      @submit="submit"
      :is-disabled="isSubmitting"
    />
  </div>
</template>

<script>
import { base } from '@tokend/js-sdk'
import { api } from '@/api'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

import KycRecoveryGeneralForm from './KycRecovery/KycRecovery.GeneralForm'

export default {
  name: 'kyc-recovery-management',
  components: {
    KycRecoveryGeneralForm,
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
      vuexTypes.walletAccountId,
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

    async submit (requestData) {
      this.isSubmitting = true
      try {
        await this.createRequest(requestData)
        Bus.success('Request sent successfully')
      } catch (error) {
        this.isSubmitting = false
        ErrorHandler.process(error)
      }
      this.isSubmitting = false
    },

    async createRequest (requestData) {
      const isExistingRequest =
        this.kycRecoveryState === REQUEST_STATES_STR.rejected ||
        this.kycRecoveryState === REQUEST_STATES_STR.pending
      const newSigner = base.Keypair.random()
      const opts = {
        targetAccount: this.accountId,
        signers: [
          {
            publicKey: newSigner.accountId(),
            roleID: '1',
            weight: '1000',
            identity: '1',
            details: {},
          },
          {
            publicKey: this.walletAccountId,
            roleID: `${this.kvDefaultSignerRoleId}`,
            weight: '1000',
            identity: '1',
            details: {},
          },
        ],
        creatorDetails: {
          verification_data: JSON.stringify(requestData),
        },
      }

      const operation = isExistingRequest
        ? base.CreateKYCRecoveryRequestBuilder.update(opts,
          this.kycRecoveryRequestId)
        : base.CreateKYCRecoveryRequestBuilder.create(opts)
      await api.postOperations(operation)
    },
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
