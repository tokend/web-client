<template>
  <div class="request-viewer">
    <template v-if="isLoaded">
      <asset-summary-viewer
        :asset-code="baseAsset.code"
        :asset-name="baseAsset.name"
        :asset-logo-url="assetLogoUrl"
      />

      <request-message-viewer
        class="request-viewer__state-message"
        :request="request"
      />

      <request-attributes-viewer
        class="request-viewer__table"
        :request="request"
      />

      <request-actions
        class="request-viewer__actions"
        :request="request"
        @update-click="$emit(EVENTS.updateClick)"
        @cancel="$emit(EVENTS.cancel)"
      />
    </template>

    <p v-else-if="isLoadingFailed">
      {{ 'create-sale-requests.loading-error-msg' | globalize }}
    </p>

    <load-spinner v-else message-id="create-sale-requests.loading-msg" />
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'

import AssetSummaryViewer from '../../shared/components/asset-summary-viewer'
import RequestMessageViewer from '../../shared/components/request-message-viewer'
import RequestAttributesViewer from './request-attributes-viewer'
import RequestActions from './request-actions'

import { CreateSaleRequest } from '../wrappers/create-sale-request'

import { config } from '../_config'

import { mapActions } from 'vuex'
import { types } from '../store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  updateClick: 'update-click',
  cancel: 'cancel',
}

export default {
  name: 'request-viewer',
  components: {
    LoadSpinner,
    AssetSummaryViewer,
    RequestMessageViewer,
    RequestAttributesViewer,
    RequestActions,
  },

  props: {
    request: { type: CreateSaleRequest, required: true },
  },

  data: _ => ({
    baseAsset: null,
    isLoaded: false,
    isLoadingFailed: false,
    config,
    EVENTS,
  }),

  computed: {
    assetLogoUrl () {
      if (this.baseAsset) {
        return this.baseAsset.logoUrl(config().storageURL)
      } else {
        return ''
      }
    },
  },

  async created () {
    await this.loadBaseAsset()
  },

  methods: {
    ...mapActions('create-sale-requests', {
      loadAssetById: types.LOAD_ASSET_BY_ID,
    }),

    async loadBaseAsset () {
      this.isLoaded = false
      try {
        this.baseAsset = await this.loadAssetById(this.request.baseAsset)
        this.isLoaded = true
      } catch (e) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.request-viewer__state-message {
  margin-top: 2rem;
}

.request-viewer__table {
  margin-top: 2rem;
}

.request-viewer__actions {
  margin-top: 4.9rem;
}
</style>
