<template>
  <div class="update-asset-form-simplified">
    <template v-if="isLoaded">
      <information-step-form
        :record="request || asset"
        :is-disabled.sync="isDisabled"
        @submit="submit"
      />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="update-asset-form-simplified__error-msg">
        {{ 'update-asset-form-simplified.load-failed-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <skeleton-loader-step-form />
    </template>
  </div>
</template>

<script>
import ManageAssetRequestMixin from './mixins/manage-asset-request.mixin'
import LoadAssetsMixin from './mixins/load-assets.mixin'
import SkeletonLoaderStepForm from './components/skeleton-loader-step-form'

import InformationStepForm from './components/information-step-form'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'update-asset-form-module',
  components: {
    InformationStepForm,
    SkeletonLoaderStepForm,
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
    price: 0,
    informationStepForm: {},
    isLoaded: false,
    isLoadFailed: false,
    isDisabled: false,
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
        this.price = await this.getAssetPrice(this.request.code)
      } else {
        this.asset = await this.getAssetByCode(this.assetCode)
        this.price = await this.getAssetPrice(this.assetCode)
      }
    },

    async getUpdateRequest () {
      let request

      if (this.requestId) {
        request = await this.getUpdateAssetRequestById(
          this.requestId,
          this.accountId
        )
      } else if (this.assetCode) {
        request = await this.getUpdatableRequest(this.assetCode, this.accountId)
      }

      return request
    },

    async submit (form) {
      this.isDisabled = true
      try {
        this.collectAssetAttributes(form)
        await this.submitUpdateAssetRequest(this.requestId)
        Bus.success('update-asset-form-simplified.request-submitted-msg')
        this.$emit(EVENTS.submitted)
      } catch (e) {
        this.isDisabled = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>
