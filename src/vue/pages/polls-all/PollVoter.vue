<template>
  <div class="poll-voter">
    <tabs v-if="isLoaded">
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

      <tab
        :name="'poll-voter.manage-tab' | globalize"
        id="poll-voter__poll-manage-form"
      >
        <poll-manage-form :poll="poll" />
      </tab>

      <tab
        :name="'poll-voter.participants-tab' | globalize"
        id="poll-voter__poll-participants"
      >
        <poll-participants :poll="poll" />
      </tab>
    </tabs>
  </div>
</template>

<script>
import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'

import { PollRecord } from '@/js/records/entities/poll.record'

import PollVoteForm from './PollVoteForm'
import PollAttributes from './PollAttributes'
import PollManageForm from './PollManageForm'
import PollParticipants from './PollParticipants'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'

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
    PollManageForm,
    PollParticipants,
  },

  props: {
    pollId: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      poll: {},
      isLoaded: false,
    }
  },

  async created () {
    await this.loadPoll()
    this.isLoaded = true
  },

  methods: {
    async loadPoll () {
      const endpoint = `/v3/polls/${this.pollId}`
      try {
        const { data } = await api.getWithSignature(endpoint, {
          include: ['participation', 'participation.votes'],
        })
        this.poll = new PollRecord(data)
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    },
    voteFormSubmitted (event) {
      this.$emit(EVENTS.close)
    },
  },
}
</script>
