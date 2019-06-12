<template>
  <div class="poll-card">
    <p class="polls-all__poll-card-question">
      <span class="polls-all__poll-card-number">
        {{ 'poll-card.id-prefix' | globalize({ id: poll.id }) }}
      </span>
      {{ poll.question }}
    </p>

    <template v-if="poll.isOpen && poll.isStarted">
      <vue-markdown
        class="polls-all__poll-card-state"
        :html="true"
        :source="'poll-card.ends-at-row' | globalize({
          time: poll.endsAt
        })"
      />
    </template>

    <template v-else>
      <vue-markdown
        class="polls-all__poll-card-state"
        :html="true"
        :source="'poll-card.ended-at-row' | globalize({
          time: poll.endsAt,
          state: translatePollStateInline(poll.stateI),
        })"
      />
    </template>

    <p class="polls-all__poll-card-time">
      {{ 'poll-card.author-prefix' | globalize }}

      <email-getter
        is-titled
        :account-id="poll.ownerId"
        :is-copy-button="false"
      />
    </p>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import VueMarkdown from 'vue-markdown'

import { PollRecord } from '@/js/records/entities/poll.record'

export default {
  components: {
    EmailGetter,
    VueMarkdown,
  },

  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
  },

  methods: {
    translatePollStateInline (poll) {
      let translationId

      if (poll.isOpen) {
        translationId = 'poll-card.state-inline-open'
      } else if (poll.isPassed) {
        translationId = 'poll-card.state-inline-passed'
      } else if (poll.isFailed) {
        translationId = 'poll-card.state-inline-failed'
      } else if (poll.isCanceled) {
        translationId = 'poll-card.state-inline-canceled'
      }

      return this.$options.filters.globalize(translationId)
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
