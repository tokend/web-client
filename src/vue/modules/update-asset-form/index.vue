<template>
  <div class="update-asset-form">
    <template v-if="isLoaded">
      <form-stepper
        :steps="STEPS"
        :current-step.sync="currentStep"
        :disabled="isDisabled"
      >
        <information-step-form
          v-show="currentStep === STEPS.information.number"
          :record="request || asset"
          @next="toNextStep()"
        />

        <advanced-step-form
          v-show="currentStep === STEPS.advanced.number"
          :record="request || asset"
          :is-disabled.sync="isDisabled"
          @next="submit()"
        />
      </form-stepper>
    </template>

    <template v-else-if="isLoadFailed">
      <p class="update-asset-form__error-msg">
        {{ 'update-asset-form.load-failed-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="update-asset-form.loading-msg" />
    </template>
  </div>
</template>

<script>
import ManageAssetRequestMixin from './mixins/manage-asset-request.mixin'
import LoadAssetsMixin from './mixins/load-assets.mixin'

import InformationStepForm from './components/information-step-form'
import AdvancedStepForm from './components/advanced-step-form'

import FormStepper from '@/vue/common/FormStepper'
import LoadSpinner from '@/vue/common/Loader'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { api } from '@/api'

const STEPS = {
  information: {
    number: 1,
    titleId: 'update-asset-form.information-step',
  },
  advanced: {
    number: 2,
    titleId: 'update-asset-form.advanced-step',
  },
}

export default {
  name: 'update-asset-form-module',
  components: {
    FormStepper,
    LoadSpinner,
    InformationStepForm,
    AdvancedStepForm,
  },
  mixins: [ManageAssetRequestMixin, LoadAssetsMixin],
  props: {
    requestId: {
      type: String,
      default: '',
    },
    assetCode: {
      type: String,
      default: '',
    },
  },

  data: _ => ({
    request: null,
    asset: null,
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
    toNextStep () {
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
        const ops = await this.collector.buildOps()
        await api.postOperations(...ops)
        Bus.success('update-asset-form.request-submitted-msg')
        this.$emit('submitted')
      } catch (e) {
        this.isDisabled = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>
