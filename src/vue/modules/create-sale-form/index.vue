<template>
  <div class="create-sale-form">
    <template v-if="isLoaded && ownedAssets.length">
      <form-stepper
        :steps="STEPS"
        :current-step.sync="currentStep"
        :disabled="isDisabled"
      >
        <keep-alive>
          <information-step-form
            v-if="currentStep === STEPS.information.number"
            :request="request"
            :base-assets="baseAssets"
            :owned-assets="ownedAssets"
            @submit="setInformationStepForm($event) || moveToNextStep()"
          />

          <short-blurb-step-form
            v-if="currentStep === STEPS.shortBlurb.number"
            :request="request"
            @submit="setShortBlurbStepForm($event) || moveToNextStep()"
          />

          <full-description-step-form
            v-if="currentStep === STEPS.fullDescription.number"
            :request="request"
            :sale-description="saleDescription"
            :is-disabled.sync="isDisabled"
            @submit="setFullDescriptionStepForm($event) || submit()"
          />
        </keep-alive>
      </form-stepper>
    </template>

    <template v-else-if="isLoaded">
      <no-data-message
        icon-name="plus-network"
        :title="'create-sale-form.no-owned-assets-title' | globalize"
        :message="'create-sale-form.no-owned-assets-desc' | globalize"
      />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="create-sale-form__error-msg">
        {{ 'create-sale-form.load-failed-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <skeleton-loader-step-form />
    </template>
  </div>
</template>

<script>
import LoadAssetsMixin from './mixins/load-assets.mixin'
import ManageSaleRequestMixin from './mixins/manage-sale-request.mixin'

import InformationStepForm from './components/information-step-form'
import ShortBlurbStepForm from './components/short-blurb-step-form'
import FullDescriptionStepForm from './components/full-description-step-form'
import SkeletonLoaderStepForm from './components/skeleton-loader-step-form'

import FormStepper from '@/vue/common/FormStepper'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const STEPS = {
  information: {
    number: 1,
    titleId: 'create-sale-form.main-information-step-title',
  },
  shortBlurb: {
    number: 2,
    titleId: 'create-sale-form.short-blurb-step-title',
  },
  fullDescription: {
    number: 3,
    titleId: 'create-sale-form.full-description-step-title',
  },
}
const EVENTS = {
  close: 'close',
  requestUpdated: 'request-updated',
}

export default {
  name: 'create-sale-form-module',
  components: {
    FormStepper,
    NoDataMessage,
    InformationStepForm,
    ShortBlurbStepForm,
    FullDescriptionStepForm,
    SkeletonLoaderStepForm,
  },
  mixins: [LoadAssetsMixin, ManageSaleRequestMixin],
  props: {
    requestId: {
      type: String,
      default: '',
    },
  },

  data: _ => ({
    request: null,
    saleDescription: '',
    informationStepForm: {},
    shortBlurbStepForm: {},
    fullDescriptionStepForm: {},
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
        await this.loadAssets(this.accountId)
        await this.tryLoadRequest()

        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async tryLoadRequest () {
      if (this.requestId) {
        this.request = await this.getCreateSaleRequestById(
          this.requestId,
          this.accountId
        )
        this.saleDescription = await this.getSaleDescription(
          this.request.descriptionBlobId,
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

    setShortBlurbStepForm (value) {
      this.shortBlurbStepForm = value
    },

    setFullDescriptionStepForm (value) {
      this.fullDescriptionStepForm = value
    },

    async submit () {
      this.isDisabled = true
      try {
        await this.submitCreateSaleRequest(this.accountId)
        Bus.success('create-sale-form.request-submitted-msg')
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
