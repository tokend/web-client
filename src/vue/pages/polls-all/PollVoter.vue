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
        TODO
      </tab>
    </tabs>
  </div>
</template>

<script>
import PollVoteForm from './PollVoteForm'
import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'

const EVENTS = {
  close: 'close',
}

export default {
  name: 'poll-voter',

  components: {
    PollVoteForm,
    Tabs,
    Tab,
  },

  props: {
    poll: {
      type: Object,
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
