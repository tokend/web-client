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
            :former="former"
            :base-assets="baseAssets"
            :owned-assets="ownedAssets"
            :default-quote-asset="defaultQuoteAsset"
            @next="setInformationStepForm($event) || moveToNextStep()"
          />

          <short-blurb-step-form
            v-if="currentStep === STEPS.shortBlurb.number"
            :request="request"
            :former="former"
            @next="setShortBlurbStepForm($event) || moveToNextStep()"
          />

          <full-description-step-form
            v-if="currentStep === STEPS.fullDescription.number"
            :request="request"
            :former="former"
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
import InformationStepForm from './components/InformationStepForm'
import ShortBlurbStepForm from './components/ShortBlurbStepForm'
import FullDescriptionStepForm from './components/FullDescriptionStepForm'
import SkeletonLoaderStepForm from './components/SkeletonLoaderStepForm'

import FormStepper from '@/vue/common/FormStepper'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { loadAssets,
  findBaseAssets,
  findOwnedAssets,
  findDefaultQuoteAsset } from '@/js/helpers/load-asset-helper'
import { SaleFormer } from '@/js/formers/SaleFormer'
import { getCreateSaleRequestById } from '@/js/helpers/sale-helper'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { api } from '@/api'

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
  submitted: 'submitted',
  requestUpdated: 'request-updated',
}

export default {
  name: 'create-sale-form',
  components: {
    FormStepper,
    NoDataMessage,
    InformationStepForm,
    ShortBlurbStepForm,
    FullDescriptionStepForm,
    SkeletonLoaderStepForm,
  },
  props: {
    requestId: {
      type: String,
      default: '',
    },
    former: { type: SaleFormer, default: () => new SaleFormer() },
  },

  data: _ => ({
    ownedAssets: [],
    baseAssets: [],
    defaultQuoteAsset: '',
    request: null,
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
    try {
      let assets = await loadAssets(this.accountId)
      this.ownedAssets = findOwnedAssets(assets, this.accountId)
      this.baseAssets = findBaseAssets(assets)
      this.defaultQuoteAsset = findDefaultQuoteAsset(assets)

      this.former.setAttr('assets', assets)
      this.former.setAttr('accountId', this.accountId)
      this.former.setAttr('requestId', this.requestId)

      await this.tryLoadRequest()
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    async tryLoadRequest () {
      if (this.requestId) {
        this.request = await getCreateSaleRequestById(
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

    setShortBlurbStepForm (value) {
      this.shortBlurbStepForm = value
    },

    setFullDescriptionStepForm (value) {
      this.fullDescriptionStepForm = value
    },

    async submit () {
      this.isDisabled = true
      try {
        const operation = await this.former.buildOps()
        await api.postOperations(...operation)
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
      this.$emit(EVENTS.submitted)
    },
  },
}
</script>
