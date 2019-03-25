<template>
  <div class="request-viewer">
    <asset-summary-viewer
      :config="config()"
      :request="request"
    />

    <request-message-viewer
      class="request-viewer__state-message"
      :request="request"
    />

    <request-attributes-viewer
      class="request-viewer__table"
      :request="request"
      :kyc-required-asset-type="kycRequiredAssetType"
    />

    <actions-bar
      class="request-viewer__actions"
      :request="request"
      @update-ask="$emit(EVENTS.updateAsk)"
      @cancel="$emit(EVENTS.cancel)"
    />
  </div>
</template>

<script>
import AssetSummaryViewer from '../../shared/components/asset-summary-viewer'
import RequestMessageViewer from '../../shared/components/request-message-viewer'
import RequestAttributesViewer from './request-attributes-viewer'
import ActionsBar from './actions-bar'

import { CreateAssetRequest } from '../wrappers/create-asset-request'

import { config } from '../_config'

const EVENTS = {
  updateAsk: 'update-ask',
  cancel: 'cancel',
}

export default {
  name: 'request-viewer',
  components: {
    AssetSummaryViewer,
    RequestMessageViewer,
    RequestAttributesViewer,
    ActionsBar,
  },

  props: {
    request: { type: CreateAssetRequest, required: true },
    kycRequiredAssetType: { type: Number, required: true },
  },

  data: _ => ({
    config,
    EVENTS,
  }),
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
