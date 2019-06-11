<template>
  <div class="request-viewer">
    <request-message-viewer
      class="request-viewer__state-message"
      :request="request"
    />

    <request-attributes-viewer
      class="request-viewer__table"
      :request="request"
      :restricted-poll-type="restrictedPollType"
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
import { mapGetters } from 'vuex'
import { types } from '../store/types'

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
  computed: {
    ...mapGetters('poll-requests', {
      restrictedPollType: types.restrictedPollType,
    }),
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
