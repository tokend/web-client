<template>
  <div class="asset-form">
    <form-stepper
      :steps="STEPS"
      :current-step.sync="currentStep"
      :disabled="isDisabled"
    >
      <information-step-form
        v-show="currentStep === STEPS.information.number"
        :collector="collector"
        @next="toNextStep()"
      />

      <advanced-step-form
        v-show="currentStep === STEPS.advanced.number"
        :collector="collector"
        :is-disabled.sync="isDisabled"
        @next="submit()"
      />
    </form-stepper>
  </div>
</template>

<script>
import ManageAssetRequestMixin from './mixins/manage-asset-request.mixin'

import InformationStepForm from './components/information-step-form'
import AdvancedStepForm from './components/advanced-step-form'

import FormStepper from '@/vue/common/FormStepper'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { AssetCollector } from '@/js/collectors/AssetCollector'
import { api } from '@/api'

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

export default {
  name: 'asset-form',
  components: {
    FormStepper,
    InformationStepForm,
    AdvancedStepForm,
  },
  mixins: [ManageAssetRequestMixin],
  props: {
    collector: {
      type: AssetCollector,
      default: () => new AssetCollector('create'),
    },
  },

  data: _ => ({
    isDisabled: false,
    currentStep: 1,
    STEPS,
  }),

  methods: {
    toNextStep () {
      this.currentStep++
      if (this.$el.parentElement) {
        this.$el.parentElement.scrollTop = 0
      }
    },

    async submit () {
      this.isDisabled = true
      try {
        const ops = await this.collector.buildOps()
        await api.postOperations(...ops)
        Bus.success('asset-form.request-submitted-msg')
        this.$emit('submitted')
      } catch (e) {
        this.isDisabled = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>
