<template>
  <div class="my-poll">
    <tabs>
      <tab
        :name="'my-poll.manage-tab' | globalize"
        id="manage-poll"
      >
        <my-poll-manage-form
          v-if="isLoaded"
          :poll="poll"
          @submitted="manageFormSubmitted"
        />
      </tab>

      <tab
        :name="'my-poll.participants-tab' | globalize"
        id="participants"
      >
        TODO
      </tab>
    </tabs>
  </div>
</template>

<script>
import MyPollManageForm from './MyPollManageForm'
import Tabs from '@/vue/common/tabs/Tabs'
import Tab from '@/vue/common/tabs/Tab'
import { errors } from '@tokend/js-sdk'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { PollRecord } from '@/js/records/entities/poll.record'

const EVENTS = {
  close: 'close',
}

export default {
  name: 'my-poll',

  components: {
    MyPollManageForm,
    Tabs,
    Tab,
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
    try {
      await this.loadPoll()
      this.isLoaded = true
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
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
        if (!(error instanceof errors.NotFoundError)) {
          throw error
        }
      }
    },
    manageFormSubmitted (event) {
      this.$emit(EVENTS.close)
    },
  },
}
</script>
