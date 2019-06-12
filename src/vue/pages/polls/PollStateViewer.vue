<template>
  <div class="poll-state-viewer">
    <div
      v-if="pollState === POLL_STATES.open"
      class="poll-state-viewer--open"
    >
      <p class="poll-state-viewer__content">
        {{ 'poll-state-messages.open-msg' | globalize }}
      </p>
    </div>

    <div
      v-else-if="pollState === POLL_STATES.passed"
      class="poll-state-viewer--passed"
    >
      <p class="poll-state-viewer__content">
        {{ 'poll-state-messages.passed-msg' | globalize }}
      </p>
    </div>

    <div
      v-else-if="pollState === POLL_STATES.failed"
      class="poll-state-viewer--failed"
    >
      <p class="poll-state-viewer__content">
        {{
          'poll-state-messages.failed-msg' | globalize
        }}
      </p>
    </div>

    <div
      v-else-if="pollState === POLL_STATES.canceled"
      class="poll-state-viewer--canceled"
    >
      <p class="poll-state-viewer__content">
        {{ 'poll-state-messages.canceled-msg' | globalize }}
      </p>
    </div>
  </div>
</template>

<script>

const POLL_STATES = {
  open: 1,
  passed: 2,
  failed: 3,
  canceled: 4,
}

export default {
  name: 'poll-state-viewer',
  props: {
    pollState: { type: Number, required: true },
  },
  data () {
    return {
      POLL_STATES,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.poll-state-viewer {
  min-height: 6.4rem;

  &--open { background-color: $col-request-approved; }
  &--passed { background-color: $col-request-pending; }

  &--failed,
  &--canceled {
    background-color: $col-request-rejected;
  }
}

.poll-state-viewer__content {
  padding: 2.4rem;
  font-size: 1.3rem;
  font-weight: 400;
  color: $col-primary-txt;
}
</style>
