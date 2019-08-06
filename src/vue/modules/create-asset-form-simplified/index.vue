<template>
  <div class="create-asset-form">
    <template v-if="isLoaded">
      <information-step-form
        :request="request"
        :is-disabled.sync="isDisabled"
        @submit="submit"
      />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="create-asset-form__error-msg">
        {{ 'create-asset-form.load-failed-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <skeleton-loader-step-form />
    </template>
  </div>
</template>

<script>
import ManageAssetRequestMixin from './mixins/manage-asset-request.mixin'

import InformationStepForm from './components/information-step-form'
import SkeletonLoaderStepForm from './components/skeleton-loader-step-form'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  requestUpdated: 'request-updated',
  submitted: 'submitted',
}

export default {
  name: 'create-asset-form-simplified-module',
  components: {
    InformationStepForm,
    SkeletonLoaderStepForm,
  },
  mixins: [ManageAssetRequestMixin],
  props: {
    requestId: {
      type: String,
      default: '',
    },
  },

  data: _ => ({
    request: null,
    isLoaded: false,
    isLoadFailed: false,
    isDisabled: false,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
      vuexTypes.statsQuoteAsset,
    ]),
  },

  async created () {
    await this.init()
  },

  methods: {
    async init () {
      try {
        await this.tryLoadRequest()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    async tryLoadRequest () {
      if (this.requestId) {
        this.request = await this.getCreateAssetRequestById(
          this.requestId,
          this.accountId
        )
      }
    },

    async submit (form) {
      this.isDisabled = true
      try {
        this.collectAssetAttributes(form)
        await this.submitCreateAssetRequest(this.requestId)
        Bus.success('create-asset-form.request-submitted-msg')
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
