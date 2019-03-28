<template>
  <div class="request-viewer">
    <request-message-viewer
      class="request-viewer__state-message"
      :request="request"
      direction="incoming"
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
import RequestMessageViewer from '../../shared/components/request-message-viewer'
import RequestAttributesViewer from './request-attributes-viewer'
import RequestActions from './request-actions'

import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'

const EVENTS = {
  requestUpdated: 'request-updated',
}

export default {
  name: 'request-viewer',
  components: {
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
