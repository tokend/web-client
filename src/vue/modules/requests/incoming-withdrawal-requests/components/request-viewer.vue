<template>
  <div class="request-viewer">
    <request-message-viewer
      class="request-viewer__state-message"
      :request="request"
    />

    <request-attributes-viewer
      class="request-viewer__table"
      :request="request"
    />

    <actions-bar
      class="request-viewer__actions"
      :request="request"
      @request-updated="$emit(EVENTS.requestUpdated)"
    />
  </div>
</template>

<script>
import RequestMessageViewer from '../../shared/components/request-message-viewer'
import RequestAttributesViewer from './request-attributes-viewer'
import ActionsBar from './actions-bar'

import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'

import { config } from '../_config'

const EVENTS = {
  requestUpdated: 'request-updated',
}

export default {
  name: 'request-viewer',
  components: {
    RequestMessageViewer,
    RequestAttributesViewer,
    ActionsBar,
  },

  props: {
    request: { type: IncomingWithdrawalRequest, required: true },
  },

  data: _ => ({
    config,
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
.request-viewer__table {
  margin-top: 2rem;
}

.request-viewer__actions {
  margin-top: 4.9rem;
}
</style>
