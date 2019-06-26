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

    <request-actions
      class="request-viewer__actions"
      :request="request"
      @cancel="$emit(EVENTS.cancel)"
    />
  </div>
</template>

<script>
import RequestMessageViewer from '../../shared/components/request-message-viewer'
import RequestActions from './request-actions'
import RequestAttributesViewer from './request-attributes-viewer'
import { PollRequest } from '../wrappers/poll-request'

const EVENTS = {
  cancel: 'cancel',
}

export default {
  name: 'request-viewer',
  components: {
    RequestMessageViewer,
    RequestActions,
    RequestAttributesViewer,
  },
  props: {
    request: { type: PollRequest, required: true },
  },

  data: _ => ({
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
