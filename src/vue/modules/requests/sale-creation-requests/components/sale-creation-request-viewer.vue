<template>
  <div class="sale-creation-request-viewer">
    <asset-name-viewer
      :config="config()"
      :request="request"
    />

    <request-message-viewer
      class="sale-creation-request-viewer__state-message"
      :request="request"
    />

    <sale-creation-request-attributes-viewer
      class="sale-creation-request-viewer__table"
      :request="request"
      :kyc-required-sale-type="kycRequiredSaleType"
    />

    <sale-creation-request-actions-bar
      class="sale-creation-request-viewer__actions"
      :request="request"
      @update-ask="$emit(EVENTS.updateAsk)"
      @cancel="$emit(EVENTS.cancel)"
    />
  </div>
</template>

<script>
import AssetNameViewer from '../../shared/components/asset-name-viewer'
import RequestMessageViewer from '../../shared/components/request-message-viewer'
import SaleCreationRequestAttributesViewer from './sale-creation-request-attributes-viewer'
import SaleCreationRequestActionsBar from './sale-creation-request-actions-bar'

import { SaleCreationRequest } from '../wrappers/sale-creation-request'

import { config } from '../_config'

const EVENTS = {
  updateAsk: 'update-ask',
  cancel: 'cancel',
}

export default {
  name: 'sale-creation-request-viewer',
  components: {
    AssetNameViewer,
    RequestMessageViewer,
    SaleCreationRequestAttributesViewer,
    SaleCreationRequestActionsBar,
  },

  props: {
    request: { type: SaleCreationRequest, required: true },
    kycRequiredSaleType: { type: Number, required: true },
  },

  data: _ => ({
    config,
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
.sale-creation-request-viewer__state-message {
  margin-top: 2rem;
}

.sale-creation-request-viewer__table {
  margin-top: 2rem;
}

.sale-creation-request-viewer__actions {
  margin-top: 4.9rem;
}
</style>
