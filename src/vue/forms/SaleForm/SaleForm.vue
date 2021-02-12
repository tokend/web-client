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
            :former="former"
            @next="moveToNextStep()"
          />

          <short-blurb-step-form
            v-if="currentStep === STEPS.shortBlurb.number"
            :former="former"
            @next="moveToNextStep()"
          />

          <full-description-step-form
            v-if="currentStep === STEPS.fullDescription.number"
            :former="former"
            :is-disabled.sync="isDisabled"
            @next="submit()"
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

import { mapGetters, mapActions } from 'vuex'
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
    isLoaded: false,
    isLoadFailed: false,
    isDisabled: false,
    currentStep: 1,
    STEPS,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      balancesAssets: vuexTypes.balancesAssets,
      ownedAssets: vuexTypes.ownedAssets,
    }),
  },

  async created () {
    try {
      this.former.setAttr('creatorAccountId', this.accountId)
      if (this.former.attrs.saleDescriptionBlobId !== '') {
        this.former.setAttr('fullDescription',
          await this.getSaleFullDescription(
            this.former.attrs.saleDescriptionBlobId,
            this.former.attrs.creatorAccountId
          )
        )
      }

      await Promise.all([
        this.loadBalances(),
        this.loadAssets(),
      ])
      this.isLoaded = true
    } catch (e) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
      loadAssets: vuexTypes.LOAD_ASSETS,
      createBalance: vuexTypes.CREATE_BALANCE,
    }),

    moveToNextStep () {
      this.currentStep++
      if (this.$el.parentElement) {
        this.$el.parentElement.scrollTop = 0
      }
    },

    async getSaleFullDescription (blobId, accountId) {
      try {
        const endpoint = `/accounts/${accountId}/blobs/${blobId}`
        const { data: blob } = await api.getWithSignature(endpoint)
        return JSON.parse(blob.value)
      } catch {
        return ''
      }
    },

    async submit () {
      this.isDisabled = true
      try {
        let quoteAssets = this.former.attrs.quoteAssetsAndPrices
          .map(assetCode => assetCode.asset)
        await this.createBalance(quoteAssets)

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
      if (+this.former.attrs.requestId) {
        this.$emit(EVENTS.requestUpdated)
      }
      this.$emit(EVENTS.submitted)
    },
  },
}
</script>
