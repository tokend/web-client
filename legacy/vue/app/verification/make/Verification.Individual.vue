<template>
  <div class="kyc-form app__page-content-wrp">
    <form
      novalidate
      @submit.prevent="submit">
      <md-progress-bar
        md-mode="indeterminate"
        v-if="isPending" />
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
            @kyc-update="handleKycUpdate($event, { step, i })"
            @kyc-edit-end="handleKycEditEnd"
          />
        </md-step>
      </md-steppers>
    </form>
  </div>
</template>

<script>
import FormMixin from 'L@/vue/common/mixins/form.mixin'
import steps from '../spec/kyc-steps.general.schema'

import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from 'L@/js/errors/error_handler'
import { EventDispatcher } from 'L@/js/events/event_dispatcher'
import { vuexTypes } from 'L@/vuex/types'
import { i18n } from 'L@/js/i18n'

import { KycTemplateParser } from '../spec/kyc-template-parser'
import { accountsService } from 'L@/js/services/accounts.service'

import { userTypes, blobTypes, ACCOUNT_TYPES, ACCOUNT_STATES } from 'L@/js/const/const'
import { confirmAction } from 'L@/js/modals/confirmation_message'

const KYC_LEVEL_TO_SET = 0

export default {
  name: 'verification-individual',
  mixins: [FormMixin],
  data: _ => ({
    isDialogOpened: false,
    kyc: null,
    activeStep: steps[0].name,
    finalStep: steps[steps.length - 1].name,
    i18n,
    steps,
    ACCOUNT_STATES,
    userTypes
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountLatestBlobId,
      vuexTypes.accountId,
      vuexTypes.accountKycData,
      vuexTypes.accountKycDocuments,
      vuexTypes.accountState,
      vuexTypes.accountKycLatestRequest
    ]),
    verificationKey () {
      return this.accountId.slice(1, 6)
    }
  },
  created () {
    this.kyc = KycTemplateParser.fromTemplate(
      this.accountKycData,
      userTypes.general
    )
  },
  methods: {
    ...mapActions({
      loadKycRequests: vuexTypes.GET_ACCOUNT_KYC_REQUESTS,
      updateDocuments: vuexTypes.UPDATE_ACCOUNT_KYC_DOCUMENTS,
      updateKycData: vuexTypes.UPDATE_ACCOUNT_KYC_DATA
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
          details: KycTemplateParser.toTemplate(
            this.kyc,
            userTypes.general
          ),
          documents: KycTemplateParser.getSaveableDocuments(
            this.kyc.documents
          ),
          blobType: blobTypes.kycForm.str
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
        accountTypeToSet: ACCOUNT_TYPES.general,
        kycLevelToSet: KYC_LEVEL_TO_SET,
        kycData: { blob_id: blobId }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';

  .kyc-form__verification-key {
    font-size: 2rem;
    font-weight: bold;
    margin: 2rem 0;
    text-align: center;
  }
</style>
