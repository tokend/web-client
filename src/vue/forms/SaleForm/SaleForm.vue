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
            @next="moveToNextStep()"
          />

          <short-blurb-step-form
            v-if="currentStep === STEPS.shortBlurb.number"
            :request="request"
            :former="former"
            @next="moveToNextStep()"
          />

          <full-description-step-form
            v-if="currentStep === STEPS.fullDescription.number"
            :request="request"
            :former="former"
            :is-disabled.sync="isDisabled"
            @submit="submit()"
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
import { SaleFormer } from '@/js/formers/SaleFormer'
import { createBalancesIfNotExist } from '@/js/helpers/sale-helper'

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
    former: { type: SaleFormer, default: () => new SaleFormer() },
  },

  data: _ => ({
    request: null,
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
    ...mapGetters({
      balancesAssets: vuexTypes.balancesAssets,
      ownedAssets: vuexTypes.ownedAssets,
    }),
  },

  async created () {
    try {
      this.former.setAttr('creatorAccountId', this.accountId)
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    moveToNextStep () {
      this.currentStep++
      if (this.$el.parentElement) {
        this.$el.parentElement.scrollTop = 0
      }
    },

    async submit () {
      this.isDisabled = true
      try {
        await createBalancesIfNotExist({
          balanceAssets: this.balancesAssets.map(asset => asset.code),
          quoteAssets: this.former.attrs.quoteAssetsCodes,
          accountId: this.accountId,
        })

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
      if (this.former.attrs.requestId) {
        this.$emit(EVENTS.requestUpdated)
      }
      this.$emit(EVENTS.submitted)
    },
  },
}
</script>
