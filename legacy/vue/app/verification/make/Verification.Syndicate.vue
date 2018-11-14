<template>
  <div class="app__page-content-wrp">
    <md-steppers
      md-vertical
      :md-active-step.sync="activeStep">
      <md-step
        v-for="(step, i) in steps"
        :key="i"
        :id="step.name"
        :md-label="step.label"
        :md-done.sync="step.done"
      >
        <component
          :is="step.component"
          :schema="step.schema"
          :active-step="activeStep"
          :final-step="finalStep"
          :kyc="kyc"
          :is-request-pending="isPending"
          @kyc-update="handleKycUpdate($event, { step, i })"
          @kyc-edit-end="handleKycEditEnd"
        />
      </md-step>
    </md-steppers>
  </div>
</template>

<script>
import FormMixin from 'L@/vue/common/mixins/form.mixin'
import steps from '../spec/kyc-steps.syndicate.schema'
import { i18n } from 'L@/js/i18n'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'
import { accountsService } from 'L@/js/services/accounts.service'
import {
  userTypes,
  blobTypes,
  ACCOUNT_TYPES,
  ACCOUNT_STATES
} from 'L@/js/const/const'
import { confirmAction } from 'L@/js/modals/confirmation_message'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { KycTemplateParser } from '../spec/kyc-template-parser'

const KYC_LEVEL_TO_SET = 0
export default {
  name: 'verification-index',
  components: {},
  mixins: [FormMixin],
  data: _ => ({
    activeStep: steps[0].name,
    finalStep: steps[steps.length - 1].name,
    kyc: null,
    i18n,
    steps,
    ACCOUNT_TYPES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.accountTypeI,
      vuexTypes.accountKycLatestRequest,
      vuexTypes.accountKycData,
      vuexTypes.accountState
    ])
  },
  async created () {
    await Promise.all([
      this.loadTokens(),
      this.loadBalances()
    ])
    this.kyc = KycTemplateParser.fromTemplate(
      this.accountKycData,
      userTypes.syndicate
    )
  },
  methods: {
    ...mapActions({
      loadTokens: vuexTypes.GET_ALL_TOKENS,
      loadBalances: vuexTypes.GET_ACCOUNT_BALANCES,
      loadKycRequests: vuexTypes.GET_ACCOUNT_KYC_REQUESTS,
      updateKycData: vuexTypes.UPDATE_ACCOUNT_KYC_DATA,
      updateDocuments: vuexTypes.UPDATE_ACCOUNT_KYC_DOCUMENTS
    }),

    handleKycUpdate ({ form, documents }, { step, i }) {
      form = form || {}
      documents = documents || {}
      Object.entries(form).forEach(([key, value]) => {
        this.kyc[key] = value
      })
      Object.entries(documents).forEach(([key, value]) => {
        this.kyc.documents[key] = value
      })
      if (this.activeStep === steps[steps.length - 1].name) {
        this.handleKycEditEnd()
      }
      step.done = true
      this.activeStep = (steps[i + 1] || steps[0]).name
    },
    async handleKycEditEnd () {
      if (!await confirmAction()) return
      this.disable()
      try {
        await this.updateDocuments(this.kyc.documents)
        const blobId = await this.updateKycData({
          details: KycTemplateParser.fromTemplate(
            this.kyc,
            userTypes.syndicate
          ),
          documents: KycTemplateParser.getSaveableDocuments(
            this.kyc.documents
          ),
          blobType: blobTypes.syndicate_kyc.str
        })
        await this.submitRequest(blobId)
        await this.loadKycRequests()
        EventDispatcher.dispatchShowSuccessEvent(i18n.kyc_upload_success())
      } catch (error) {
        console.error(error)
        ErrorHandler.processUnexpected(error)
      }
      this.enable()
    },

    async submitRequest (blobId) {
      await accountsService.createKycRequest({
        requestID: this.accountState === ACCOUNT_STATES.rejected
          ? this.accountKycLatestRequest.id
          : '0',
        accountToUpdateKYC: this.accountId,
        accountTypeToSet: ACCOUNT_TYPES.syndicate,
        kycLevelToSet: KYC_LEVEL_TO_SET,
        kycData: { blob_id: blobId }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
