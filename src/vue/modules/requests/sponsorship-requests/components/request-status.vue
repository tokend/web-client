<template>
  <div class="request-status">
    <div
      v-if="request.isApproved"
      class="request-status--approved"
    >
      <p class="request-status__content">
        {{ 'request-status.approved-incoming-msg' | globalize }}
      </p>
    </div>

    <div
      v-else-if="request.isPending"
      class="request-status--pending"
    >
      <p class="request-status__content">
        {{ 'request-status.pending-incoming-msg' | globalize }}
      </p>
    </div>

    <div
      v-else-if="request.isPermanentlyRejected"
      class="request-status--permanently-rejected"
    >
      <p class="request-status__content">
        {{
          'request-status.permanently-rejected-incoming-msg' | globalize
        }}
      </p>
    </div>
  </div>
</template>

<script>
import { SponsorshipRequest } from '../wrappers/sponsorship-request'

export default {
  name: 'request-status',
  props: {
    request: { type: SponsorshipRequest, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.request-status {
  min-height: 6.4rem;

  &--approved { background-color: $col-request-approved; }
  &--pending { background-color: $col-request-pending; }

  &--permanently-rejected {
    background-color: $col-request-rejected;
  }
}

.request-status__content {
  padding: 2.4rem;
  font-size: 1.3rem;
  font-weight: 400;
  color: $col-primary-txt;
}
</style>
