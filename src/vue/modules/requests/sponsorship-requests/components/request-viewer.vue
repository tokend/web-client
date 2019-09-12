<template>
  <div class="request-viewer">
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
import RequestAttributesViewer from './request-attributes-viewer'
import RequestActions from './request-actions'

import { SponsorshipRequest } from '../wrappers/sponsorship-request'

const EVENTS = {
  requestUpdated: 'request-updated',
}

export default {
  name: 'request-viewer',
  components: {
    RequestAttributesViewer,
    RequestActions,
  },

  props: {
    request: { type: SponsorshipRequest, required: true },
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
