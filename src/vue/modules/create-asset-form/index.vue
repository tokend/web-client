<template>
  <form-stepper
    v-if="isLoaded"
    :steps="STEPS"
    :current-step.sync="currentStep"
  >
    <information-step-form
      v-show="currentStep === STEPS.information.number"
      :request="request"
      @submit="(information = $event) && next()"
    />
    <advanced-step-form
      v-show="currentStep === STEPS.advanced.number"
      :request="request"
      @submit="(advanced = $event) && submit()"
    />
  </form-stepper>

  <loader
    v-else
    message-id="asset-form.loading-msg" />
</template>

<script>
import ManageAssetRequestMixin from './mixins/manage-asset-request.mixin'

import InformationStepForm from './components/information-step-form'
import AdvancedStepForm from './components/advanced-step-form'

import FormStepper from '@/vue/common/FormStepper'
import Loader from '@/vue/common/Loader'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

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
    requestId: { type: String, default: '' },
  },

  data: _ => ({
    request: null,
    information: {},
    advanced: {},
    isLoaded: false,
    isLoadFailed: false,
    currentStep: 1,
    STEPS,
  }),

  async created () {
    try {
      // TODO: load request by ID
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
      // TODO: set disabled state
      try {
        // TODO: submit request
        Bus.success('asset-form.asset-request-submitted-msg')

        if (this.requestId) {
          this.$emit(EVENTS.requestUpdated)
        }
        this.$emit(EVENTS.close)
      } catch (e) {
        ErrorHandler.process(e)
      }
    },
  },
}
</script>
