<template>
  <div class="create-asset-form">
    <template v-if="isLoaded">
      <form-stepper
        :steps="STEPS"
        :current-step.sync="currentStep"
        :disabled="isDisabled"
      >
        <information-step-form
          v-show="currentStep === STEPS.information.number"
          :request="request"
          :kyc-required-asset-type="kycRequiredAssetType"
          :security-asset-type="securityAssetType"
          @submit="setInformationStepForm($event) || moveToNextStep()"
        />

        <advanced-step-form
          v-show="currentStep === STEPS.advanced.number"
          :request="request"
          :is-disabled.sync="isDisabled"
          :main-signer-account-id="accountId"
          :max-issuance-amount="informationStepForm.maxIssuanceAmount"
          @submit="setAdvancedStepForm($event) || submit()"
        />
      </form-stepper>
    </template>

    <template v-else-if="isLoadFailed">
      <p class="create-asset-form__error-msg">
        {{ 'create-asset-form.load-failed-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <skeleton-loader-step-form />
    </template>
  </div>
</template>

<script>
import LoadAssetTypesMixin from './mixins/load-asset-types.mixin'
import ManageAssetRequestMixin from './mixins/manage-asset-request.mixin'

import InformationStepForm from './components/information-step-form'
import SkeletonLoaderStepForm from './components/skeleton-loader-step-form'
import AdvancedStepForm from './components/advanced-step-form'

import FormStepper from '@/vue/common/FormStepper'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const STEPS = {
  information: {
    number: 1,
    titleId: 'create-asset-form.information-step',
  },
  advanced: {
    number: 2,
    titleId: 'create-asset-form.advanced-step',
  },
}
const EVENTS = {
  requestUpdated: 'request-updated',
  close: 'close',
}

export default {
  name: 'create-asset-form-module',
  components: {
    FormStepper,
    InformationStepForm,
    AdvancedStepForm,
    SkeletonLoaderStepForm,
  },
  mixins: [LoadAssetTypesMixin, ManageAssetRequestMixin],
  props: {
    requestId: {
      type: String,
      default: '',
    },
  },

  data: _ => ({
    request: null,
    informationStepForm: {},
    advancedStepForm: {},
    isLoaded: false,
    isLoadFailed: false,
    isDisabled: false,
    currentStep: 1,
    STEPS,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },

  async created () {
    await this.init()
  },

  methods: {
    async init () {
      try {
        await this.loadKycRequiredAssetType()
        await this.loadSecurityAssetType()

        await this.tryLoadRequest()

        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async tryLoadRequest () {
      if (this.requestId) {
        this.request = await this.getCreateAssetRequestById(
          this.requestId,
          this.accountId
        )
      }
    },

    moveToNextStep () {
      this.currentStep++
      if (this.$el.parentElement) {
        this.$el.parentElement.scrollTop = 0
      }
    },

    setInformationStepForm (value) {
      this.informationStepForm = value
    },

    setAdvancedStepForm (value) {
      this.advancedStepForm = value
    },

    async submit () {
      this.isDisabled = true
      try {
        await this.submitCreateAssetRequest()
        Bus.success('create-asset-form.request-submitted-msg')
        this.emitSubmitEvents()
      } catch (e) {
        this.isDisabled = false
        ErrorHandler.process(e)
      }
    },

    emitSubmitEvents () {
      if (this.requestId) {
        this.$emit(EVENTS.requestUpdated)
      }
      this.$emit(EVENTS.close)
    },
  },
}
</script>
