<template>
  <div class="asset-creation-request-viewer">
    <asset-name-viewer
      :config="config()"
      :request="request"
    />

    <request-message-viewer
      class="asset-creation-request-viewer__state-message"
      :request="request"
    />

    <asset-creation-request-attributes-viewer
      class="asset-creation-request-viewer__table"
      :request="request"
      :kyc-required-asset-type="kycRequiredAssetType"
    />

    <asset-creation-request-actions-bar
      class="asset-creation-request-viewer__actions"
      :request="request"
      @update-ask="$emit(EVENTS.updateAsk)"
      @cancel="$emit(EVENTS.cancel)"
    />
  </div>
</template>

<script>
import AssetNameViewer from '../../shared/components/asset-name-viewer'
import RequestMessageViewer from '../../shared/components/request-message-viewer'
import AssetCreationRequestAttributesViewer from './asset-creation-request-attributes-viewer'
import AssetCreationRequestActionsBar from './asset-creation-request-actions-bar'

import { AssetCreationRequest } from '../wrappers/asset-creation-request'

import { config } from '../_config'

const EVENTS = {
  updateAsk: 'update-ask',
  cancel: 'cancel',
}

export default {
  name: 'asset-creation-request-viewer',
  components: {
    AssetNameViewer,
    RequestMessageViewer,
    AssetCreationRequestAttributesViewer,
    AssetCreationRequestActionsBar,
  },

  props: {
    request: { type: AssetCreationRequest, required: true },
    kycRequiredAssetType: { type: Number, required: true },
  },

  data: _ => ({
    config,
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
.asset-creation-request-viewer__state-message {
  margin-top: 2rem;
}

.asset-creation-request-viewer__table {
  margin-top: 2rem;
}

.asset-creation-request-viewer__actions {
  margin-top: 4.9rem;
}
</style>
