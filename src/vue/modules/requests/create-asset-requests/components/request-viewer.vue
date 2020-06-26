<template>
  <div class="request-viewer">
    <asset-summary-viewer
      :asset-code="request.assetCode"
      :asset-name="request.assetName"
      :asset-logo-url="assetLogoUrl"
    />

    <request-message-viewer
      class="request-viewer__state-message"
      :request="request"
    />

    <request-attributes-viewer
      class="request-viewer__table"
      :request="request"
      :kyc-required-asset-type="kycRequiredAssetType"
      :security-asset-type="securityAssetType"
    />

    <request-actions
      class="request-viewer__actions"
      :request="request"
      @update-click="$emit(EVENTS.updateClick)"
      @cancel="$emit(EVENTS.cancel)"
    />
  </div>
</template>

<script>
import AssetSummaryViewer from '../../shared/components/asset-summary-viewer'
import RequestMessageViewer from '../../shared/components/request-message-viewer'
import RequestAttributesViewer from './request-attributes-viewer'
import RequestActions from './request-actions'

import { AssetRequest } from '@/js/records/requests/asset-request.record'

import { mapGetters } from 'vuex'
import { types } from '../store/types'

import { documentsManager } from '@/api'

const EVENTS = {
  updateClick: 'update-click',
  cancel: 'cancel',
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
    request: { type: AssetRequest, required: true },
  },

  data: _ => ({
    EVENTS,
  }),

  computed: {
    ...mapGetters('create-asset-requests', {
      kycRequiredAssetType: types.kycRequiredAssetType,
      securityAssetType: types.securityAssetType,
    }),

    assetLogoUrl () {
      return documentsManager.getDocumentUrlByKey(this.request.logoKey)
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
