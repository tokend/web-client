<template>
  <form-stepper
    v-if="isLoaded"
    :steps="STEPS"
    :current-step.sync="currentStep"
    :disabled="isDisabled"
  >
    <information-step-form
      v-show="currentStep === STEPS.information.number"
      :request="request"
      @submit="(information = $event) && next()"
    />

    <advanced-step-form
      v-show="currentStep === STEPS.advanced.number"
      :request="request"
      :is-disabled.sync="isDisabled"
      @submit="(advanced = $event) && submit()"
    />
  </form-stepper>

  <loader
    v-else
    message-id="asset-form.loading-msg"
  />
</template>

<script>
import ManageAssetRequestMixin from './mixins/manage-asset-request.mixin'

import InformationStepForm from './components/information-step-form'
import AdvancedStepForm from './components/advanced-step-form'

import FormStepper from '@/vue/common/FormStepper'
import Loader from '@/vue/common/Loader'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

const STEPS = {
  information: {
    number: 1,
    titleId: 'asset-form.information-step',
  },
  advanced: {
    number: 2,
    titleId: 'asset-form.advanced-step',
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
    Loader,
    InformationStepForm,
    AdvancedStepForm,
  },
  mixins: [ManageAssetRequestMixin],
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
    requestId: { type: String, default: '' },
  },

  data: _ => ({
    request: null,
    information: {},
    advanced: {},
    isLoaded: false,
    isLoadFailed: false,
    isDisabled: false,
    currentStep: 1,
    STEPS,
  }),

  async created () {
    initApi(this.wallet, this.config)

    try {
      if (this.requestId) {
        this.request = await this.getRequestById(this.requestId)
      }
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    next () {
      this.$el.parentElement.scrollTop = 0
      this.currentStep++
    },

    async submit () {
      this.isDisabled = true
      try {
        await this.submitCreateAssetRequest()
        Bus.success('asset-form.asset-request-submitted-msg')

        if (this.requestId) {
          this.$emit(EVENTS.requestUpdated)
        }
        this.$emit(EVENTS.close)
      } catch (e) {
        this.isDisabled = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>
