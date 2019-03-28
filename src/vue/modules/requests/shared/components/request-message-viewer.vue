<template>
  <div class="request-message-viewer">
    <div
      v-if="request.isApproved"
      class="request-message-viewer--approved"
    >
      <p class="request-message-viewer__content">
        <template v-if="direction === REQUEST_DIRECTIONS.incoming">
          {{ 'request-messages.approved-incoming-msg' | globalize }}
        </template>
        <template v-else>
          {{ 'request-messages.approved-outgoing-msg' | globalize }}
        </template>
      </p>
    </div>

    <div
      v-else-if="request.isPending"
      class="request-message-viewer--pending"
    >
      <p class="request-message-viewer__content">
        <template v-if="direction === REQUEST_DIRECTIONS.incoming">
          {{ 'request-messages.pending-incoming-msg' | globalize }}
        </template>
        <template v-else>
          {{ 'request-messages.pending-outgoing-msg' | globalize }}
        </template>
      </p>
    </div>

    <div
      v-else-if="request.isRejected"
      class="request-message-viewer--rejected"
    >
      <p class="request-message-viewer__content">
        <!-- eslint-disable max-len -->
        <template v-if="direction === REQUEST_DIRECTIONS.incoming">
          {{ 'request-messages.rejected-incoming-msg' | globalize({ reason: request.rejectReason }) }}
        </template>
        <template v-else>
          {{ 'request-messages.rejected-outgoing-msg' | globalize({ reason: request.rejectReason }) }}
        </template>
        <!-- eslint-enable max-len -->
      </p>
    </div>

    <div
      v-else-if="request.isCanceled"
      class="request-message-viewer--canceled"
    >
      <p class="request-message-viewer__content">
        <template v-if="direction === REQUEST_DIRECTIONS.incoming">
          {{ 'request-messages.canceled-incoming-msg' | globalize }}
        </template>
        <template v-else>
          {{ 'request-messages.canceled-outgoing-msg' | globalize }}
        </template>
      </p>
    </div>

    <div
      v-else-if="request.isPermanentlyRejected"
      class="request-message-viewer--permanently-rejected"
    >
      <p class="request-message-viewer__content">
        <!-- eslint-disable max-len -->
        <template v-if="direction === REQUEST_DIRECTIONS.incoming">
          {{ 'request-messages.permanently-rejected-incoming-msg' | globalize({ reason: request.rejectReason }) }}
        </template>
        <template v-else>
          {{ 'request-messages.permanently-rejected-outgoing-msg' | globalize({ reason: request.rejectReason }) }}
        </template>
        <!-- eslint-enable max-len -->
      </p>
    </div>
  </div>
</template>

<script>
import { Request } from '../wrappers/request'

const REQUEST_DIRECTIONS = {
  incoming: 'incoming',
  outgoing: 'outgoing',
}

export default {
  name: 'request-message-viewer',
  props: {
    request: { type: Request, required: true },
    direction: { type: String, default: REQUEST_DIRECTIONS.outgoing },
  },
  data: _ => ({
    REQUEST_DIRECTIONS,
  }),
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.request-message-viewer {
  min-height: 6.4rem;

  .request-message-viewer__content {
    padding: 2.4rem;
    font-size: 1.3rem;
    font-weight: normal;
    color: $col-primary-txt;
  }

  &--approved { background-color: $col-request-approved }
  &--pending { background-color: $col-request-pending }
  &--rejected, &--canceled, &--permanently-rejected {
    background-color: $col-request-rejected;
  }
}
</style>
