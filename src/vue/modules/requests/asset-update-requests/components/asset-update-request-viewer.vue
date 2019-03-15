<template>
  <div class="asset-update-request-viewer">
    <asset-name-viewer
      :config="config()"
      :request="request"
    />

    <request-message-viewer
      class="asset-update-request-viewer__state-message"
      :request="request"
    />

    <asset-update-request-attributes-viewer
      class="asset-update-request-viewer__table"
      :request="request"
    />

    <asset-update-request-actions-bar
      class="asset-update-request-viewer__actions"
      :request="request"
      @update-ask="$emit(EVENTS.updateAsk)"
      @cancel="$emit(EVENTS.cancel)"
    />
  </div>
</template>

<script>
import AssetNameViewer from '../../shared/components/asset-name-viewer'
import RequestMessageViewer from '../../shared/components/request-message-viewer'
import AssetUpdateRequestAttributesViewer from './asset-update-request-attributes-viewer'
import AssetUpdateRequestActionsBar from './asset-update-request-actions-bar'

import { AssetUpdateRequest } from '../wrappers/asset-update-request'

import { config } from '../_config'

const EVENTS = {
  updateAsk: 'update-ask',
  cancel: 'cancel',
}

export default {
  name: 'asset-update-request-viewer',
  components: {
    AssetNameViewer,
    RequestMessageViewer,
    AssetUpdateRequestAttributesViewer,
    AssetUpdateRequestActionsBar,
  },

  props: {
    request: { type: AssetUpdateRequest, required: true },
  },

  data: _ => ({
    config,
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
.asset-update-request-viewer__state-message {
  margin-top: 2rem;
}

.asset-update-request-viewer__table {
  margin-top: 2rem;
}

.asset-update-request-viewer__actions {
  margin-top: 4.9rem;
}
</style>
