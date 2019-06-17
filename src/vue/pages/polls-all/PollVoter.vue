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
        v-if="(isPollOwner() || isPollResultProvider()) && poll.isOpen"
        :name="'poll-voter.manage-tab' | globalize"
        id="poll-voter__poll-manage-form"
      >
        <poll-manage-form
          :poll="poll"
          :is-poll-owner="isPollOwner()"
          :is-poll-result-provider="isPollResultProvider()"
          @submitted="loadPoll()"
          @closed="$emit(EVENTS.closed)"
          @canceled="$emit(EVENTS.canceled)"
        />
      </tab>

      <tab
        v-if="isPollOwner()"
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
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  close: 'close',
  closed: 'closed',
  canceled: 'canceled',
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
      EVENTS,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
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

    isPollOwner () {
      return this.accountId === this.poll.ownerId
    },

    isPollResultProvider () {
      return this.accountId === this.poll.resultProviderId
    },
  },
}
</script>
