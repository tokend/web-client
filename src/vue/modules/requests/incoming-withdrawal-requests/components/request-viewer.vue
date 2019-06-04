<template>
  <div class="request-viewer">
    <asset-summary-viewer
      :asset-code="requestAsset.code"
      :asset-name="requestAsset.name"
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
      @request-updated="$emit(EVENTS.requestUpdated)"
    />
  </div>
</template>

<script>
import AssetSummaryViewer from '../../shared/components/asset-summary-viewer'

import RequestMessageViewer from './request-message-viewer'
import RequestAttributesViewer from './request-attributes-viewer'
import RequestActions from './request-actions'

import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'

import { documentsManager } from '@/api'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  requestUpdated: 'request-updated',
}

export default {
  name: 'request-viewer',
  components: {
    AssetSummaryViewer,
    RequestMessageViewer,
    RequestAttributesViewer,
    RequestActions,
  },

  props: {
    request: { type: IncomingWithdrawalRequest, required: true },
  },

  data: _ => ({
    EVENTS,
  }),

  computed: {
    ...mapGetters({
      assetByCode: vuexTypes.assetByCode,
    }),
    requestAsset () {
      return this.assetByCode(this.request.assetCode)
    },

    assetLogoUrl () {
      if (this.requestAsset) {
        return documentsManager.getDocumentUrlByKey(this.requestAsset.logoKey)
      } else {
        return ''
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
