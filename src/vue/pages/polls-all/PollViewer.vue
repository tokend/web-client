<template>
  <div class="poll-viewer">
    <tabs>
      <tab
        :name="'poll-viewer.vote-tab' | globalize"
        id="poll-viewer__poll-vote-form"
      >
        <poll-vote-form
          :poll="poll"
          @submitted="voteFormSubmitted"
        />
      </tab>

      <tab
        :name="'poll-viewer.details-tab' | globalize"
        id="poll-viewer"
      >
        <poll-attributes :poll="poll" />
      </tab>
    </tabs>
  </div>
</template>

<script>
import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'

import { PollRecord } from '@/js/records/entities/poll.record'

import PollVoteForm from './PollVoteForm.vue'
import PollAttributes from './PollAttributes.vue'

const EVENTS = {
  close: 'close',
}

export default {
  name: 'poll-viewer',

  components: {
    Tabs,
    Tab,
    PollVoteForm,
    PollAttributes,
  },

  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
  },

  methods: {
    voteFormSubmitted (event) {
      this.$emit(EVENTS.close)
    },
  },
}
</script>
