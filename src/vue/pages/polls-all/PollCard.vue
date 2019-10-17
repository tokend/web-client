<template>
  <div class="poll-card">
    <p class="poll-card__title">
      <span class="poll-card__number">
        {{ 'poll-card.id-prefix' | globalize({ id: poll.id }) }}
      </span>
      <span class="poll-card__question">
        {{ poll.question }}
      </span>
    </p>

    <template v-if="poll.isOpen && !poll.isEnded">
      <vue-markdown
        class="poll-card__status"
        :html="true"
        :source="'poll-card.ends-at-row' | globalize({ time: poll.endsAt })"
      />
    </template>

    <template v-else>
      <vue-markdown
        class="poll-card__status"
        :html="true"
        :source="'poll-card.ended-at-row' | globalize({
          time: poll.endsAt,
          state: translatePollStateInline(poll),
        })"
      />
    </template>

    <p class="poll-card__author">
      <span class="poll-card__author-prefix">
        {{ 'poll-card.author-prefix' | globalize }}
      </span>
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
  name: 'poll-card',

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
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.poll-card {
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
  background-color: $col-sale-card-background;
  padding: 1.6rem;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  overflow-x: hidden;
}

.poll-card__title {
  margin-bottom: 1.6rem;
  font-size: 1.6rem;

  @include multi-line-ellipsis(1.6rem * 1.5, 2, true);
}

.poll-card__number {
  color: $col-text-secondary;
  font-size: inherit;
  margin-right: 0.5ch;
}

.poll-card__status,
.poll-card__author {
  color: $col-text-secondary;
  font-size: 1.3rem;
  line-height: 1.5;
}

.poll-card__author {
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
}

.poll-card__question {
  color: $col-text;
}
</style>
