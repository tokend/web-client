<template>
  <div class="asset-form">
    <form-stepper
      :steps="STEPS"
      :current-step.sync="currentStep"
      :disabled="isDisabled"
    >
      <basic-step
        v-show="currentStep === STEPS.information.number"
        :former="former"
        @next="toNextStep()"
      />

      <advanced-step
        v-show="currentStep === STEPS.advanced.number"
        :former="former"
        :is-disabled.sync="isDisabled"
        @next="submit()"
      />
    </form-stepper>
  </div>
</template>

<script>
import BasicStep from './components/BasicStep'
import AdvancedStep from './components/AdvancedStep'

import FormStepper from '@/vue/common/FormStepper'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { AssetFormer } from '@/js/formers/AssetFormer'
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
    BasicStep,
    AdvancedStep,
  },
  props: {
    former: {
      type: AssetFormer,
      default: () => new AssetFormer(),
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
        const ops = await this.former.buildOps()
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
