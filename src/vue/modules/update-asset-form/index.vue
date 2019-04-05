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
          @submit="setInformationStepForm($event) || moveToNextStep()"
        />

        <advanced-step-form
          v-show="currentStep === STEPS.advanced.number"
          :record="request || asset"
          :is-disabled.sync="isDisabled"
          @submit="setAdvancedStepForm($event) || submit()"
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

import { Wallet } from '@tokend/js-sdk'

import { initApi } from './_api'
import { initConfig } from './_config'

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
const EVENTS = {
  requestUpdated: 'request-updated',
  close: 'close',
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
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     * @property config.storageURL - the url of file storage server
     */
    config: {
      type: Object,
      required: true,
    },
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
    informationStepForm: {},
    advancedStepForm: {},
    isLoaded: false,
    isLoadFailed: false,
    isDisabled: false,
    currentStep: 1,
    STEPS,
  }),

  async created () {
    await this.init()
  },

  methods: {
    async init () {
      try {
        initApi(this.wallet, this.config)
        initConfig(this.config)
        await this.loadUpdateAssetRecord()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async loadUpdateAssetRecord () {
      const request = await this.getUpdateRequest()

      if (request) {
        this.request = request
      } else {
        this.asset = await this.getAssetByCode(this.assetCode)
      }
    },

    async getUpdateRequest () {
      let request

      if (this.requestId) {
        request = await this.getUpdateAssetRequestById(this.requestId)
      } else if (this.assetCode) {
        request = await this.getUpdatableRequest()
      }

      return request
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
        await this.submitUpdateAssetRequest()
        Bus.success('update-asset-form.request-submitted-msg')
        this.$emit(EVENTS.requestUpdated)
        this.$emit(EVENTS.close)
      } catch (e) {
        this.isDisabled = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>
