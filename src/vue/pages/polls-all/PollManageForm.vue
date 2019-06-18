<template>
  <div class="poll-manage-form">
    <poll-update-end-time-form
      v-if="isPollOwner"
      :poll="poll"
      @end-time-updated="$emit(EVENTS.endTimeUpdated)"
    />

    <close-poll-form
      v-if="isPollResultProvider"
      :poll="poll"
      @poll-closed="$emit(EVENTS.pollClosed)"
    />

    <cancel-poll-form
      v-if="isPollOwner"
      :poll="poll"
      @poll-canceled="$emit(EVENTS.pollCanceled)"
    />
  </div>
</template>

<script>
import { PollRecord } from '@/js/records/entities/poll.record'
import PollUpdateEndTimeForm from './PollUpdateEndTimeForm'
import CancelPollForm from './CancelPollForm'
import ClosePollForm from './ClosePollForm'

const EVENTS = {
  endTimeUpdated: 'end-time-updated',
  pollClosed: 'poll-closed',
  pollCanceled: 'poll-canceled',
}

export default {
  name: 'poll-manage-form',
  components: {
    PollUpdateEndTimeForm,
    CancelPollForm,
    ClosePollForm,
  },
  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
    isPollOwner: {
      type: Boolean,
      default: false,
    },
    isPollResultProvider: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      EVENTS,
    }
  },
}
</script>

<style lang="scss" scoped>
.poll-manage-form {
  & > *:not(:first-child) {
    margin-top: 5rem;
  }
}
</style>
