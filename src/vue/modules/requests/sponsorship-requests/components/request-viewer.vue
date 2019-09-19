<template>
  <div class="request-viewer">
    <request-status
      v-if="isIncomingRequests"
      class="request-viewer__state-message"
      :request="request"
    />

    <request-attributes-viewer
      class="request-viewer__table"
      :request="request"
      :is-incoming-requests="isIncomingRequests"
    />

    <request-actions
      v-if="isIncomingRequests"
      class="request-viewer__actions"
      :request="request"
      @request-updated="$emit(EVENTS.requestUpdated)"
    />
  </div>
</template>

<script>
import RequestAttributesViewer from './request-attributes-viewer'
import RequestActions from './request-actions'
import RequestStatus from './request-status'

import { SponsorshipRequest } from '../wrappers/sponsorship-request'

const EVENTS = {
  requestUpdated: 'request-updated',
}

export default {
  name: 'request-viewer',
  components: {
    RequestAttributesViewer,
    RequestActions,
    RequestStatus,
  },

  props: {
    request: { type: SponsorshipRequest, required: true },
    isIncomingRequests: { type: Boolean, default: false },

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
