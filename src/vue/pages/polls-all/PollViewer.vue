<template>
  <div class="poll-viewer">
    <tabs v-if="isLoaded">
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

      <tab
        v-if="(isPollOwner() || isPollResultProvider()) && poll.isOpen"
        :name="'poll-viewer.manage-tab' | globalize"
        id="poll-viewer__poll-manage-form"
      >
        <poll-manage-form
          :poll="poll"
          :is-poll-owner="isPollOwner()"
          :is-poll-result-provider="isPollResultProvider()"
          @end-time-updated="updatedEndTimeFormSubmitted()"
          @poll-closed="$emit(EVENTS.pollClosed)"
          @poll-canceled="$emit(EVENTS.pollCanceled)"
        />
      </tab>

      <tab
        v-if="isPollOwner()"
        :name="'poll-viewer.participants-tab' | globalize"
        id="poll-viewer__poll-participants"
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
  closeDrawer: 'close-drawer',
  pollClosed: 'poll-closed',
  pollCanceled: 'poll-canceled',
  endTimeUpdated: 'end-time-updated',
}

export default {
  name: 'poll-viewer',

  components: {
    Tabs,
    Tab,
    PollVoteForm,
    PollAttributes,
    PollManageForm,
    PollParticipants,
  },

  props: {
    currentPoll: {
      type: PollRecord,
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
      const endpoint = `/v3/polls/${this.currentPoll.id}`

      if (this.isPollResultProvider() || this.isPollOwner()) {
        try {
          const { data } = await api.getWithSignature(endpoint, {
            include: ['participation', 'participation.votes'],
          })
          this.poll = new PollRecord(data)
        } catch (error) {
          ErrorHandler.processWithoutFeedback(error)
        }
      } else {
        this.poll = this.currentPoll
      }
    },

    voteFormSubmitted (event) {
      this.$emit(EVENTS.closeDrawer)
    },

    async updatedEndTimeFormSubmitted () {
      this.$emit(EVENTS.endTimeUpdated)
      await this.loadPoll()
    },

    isPollOwner () {
      return this.accountId === this.currentPoll.ownerId
    },

    isPollResultProvider () {
      return this.accountId === this.currentPoll.resultProviderId
    },
  },
}
</script>
