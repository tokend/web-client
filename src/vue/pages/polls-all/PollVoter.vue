<template>
  <div class="poll-voter">
    <tabs>
      <tab
        :name="'poll-voter.vote-tab' | globalize"
        id="poll-voter__poll-vote-form"
      >
        <poll-vote-form
          :poll="poll"
          @submitted="voteFormSubmitted"
        />
      </tab>

      <tab
        :name="'poll-voter.details-tab' | globalize"
        id="poll-voter"
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
  name: 'poll-voter',

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
