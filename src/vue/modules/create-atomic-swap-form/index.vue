<template>
  <div class="create-atomic-swap">
    <template
      v-if="isLoaded &&
        baseAtomicSwapBalancesAssets.length &&
        quoteAtomicSwapAssets.length"
    >
      <form-stepper
        :steps="STEPS"
        :current-step.sync="currentStep"
        :disabled="isDisabled"
      >
        <create-atomic-swap-form
          v-show="currentStep === STEPS.information.number"
          @submit="collectAssetAttributes($event) || moveToNextStep()"
        />
        <atomic-swap-quote-assets-form
          v-show="currentStep === STEPS.advanced.number"
          :is-disabled.sync="isDisabled"
          @submit="collectAssetAttributes($event) || submit()"
        />
      </form-stepper>
    </template>
    <!-- eslint-disable max-len -->
    <no-data-message
      v-else-if="isLoaded && !baseAtomicSwapBalancesAssets.length"
      icon-name="alert-circle"
      :title="'create-atomic-swap-form.no-base-atomic-swap-assets-title' | globalize"
      :message="'create-atomic-swap-form.no-base-atomic-swap-assets-msg' | globalize"
    />

    <no-data-message
      v-else-if="isLoaded && !quoteAtomicSwapAssets.length"
      icon-name="alert-circle"
      :title="'create-atomic-swap-form.no-quote-atomic-swap-assets-title' | globalize"
      :message="'create-atomic-swap-form.no-quote-atomic-swap-assets-msg' | globalize"
    />
    <!-- eslint-enable max-len -->

    <template v-else-if="isLoadFailed">
      <p class="create-atomic-swap-form__error-msg">
        {{ 'create-atomic-swap-form.load-failed-msg' | globalize }}
      </p>
    </template>

    <create-atomic-swap-form-skeleton-loader
      v-else
    />
  </div>
</template>

<script>

import CreateAtomicSwapFormSkeletonLoader from './components/create-atomic-swap-form-skeleton-loader'
import CreateAtomicSwapForm from './components/create-atomic-swap-form'
import AtomicSwapQuoteAssetsForm from '@/vue/forms/AtomicSwapQuoteAssetsForm'
import FormStepper from '@/vue/common/FormStepper'
import NoDataMessage from '@/vue/common/NoDataMessage'
import ManageAtomicSwapMixin from './mixins/manage-atomic-swap.mixin'
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  createdAtomicSwap: 'created-atomic-swap',
}

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

export default {
  name: 'create-atomic-swap-form-module',
  components: {
    NoDataMessage,
    CreateAtomicSwapFormSkeletonLoader,
    CreateAtomicSwapForm,
    AtomicSwapQuoteAssetsForm,
    FormStepper,
  },
  mixins: [ManageAtomicSwapMixin],
  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    currentStep: 1,
    isDisabled: false,
    EVENTS,
    STEPS,
  }),

  computed: {
    ...mapGetters({
      baseAtomicSwapBalancesAssets: vuexTypes.baseAtomicSwapBalancesAssets,
      quoteAtomicSwapAssets: vuexTypes.quoteAtomicSwapAssets,
    }),
  },

  async created () {
    try {
      await this.loadAssets()
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback()
    }
  },
  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    moveToNextStep () {
      this.currentStep++
      if (this.$el.parentElement) {
        this.$el.parentElement.scrollTop = 0
      }
    },

    async submit () {
      this.isDisabled = true
      try {
        await this.submitCreateAtomicSwapRequest()
        Bus.success('create-atomic-swap-form.created-atomic-swap-msg')
        this.$emit(EVENTS.createdAtomicSwap)
      } catch (e) {
        this.isDisabled = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>
