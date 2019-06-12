<template>
  <div class="poll-details app__table">
    <table>
      <tbody>
        <tr>
          <td>{{ 'poll-requests.start-time-title' | globalize }}</td>
          <td>{{ poll.startTime | formatCalendar }}</td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.end-time-title' | globalize }}</td>
          <td>{{ poll.endTime | formatCalendar }}</td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.number-of-choices-title' | globalize }}</td>
          <td>{{ poll.numberOfChoices }}</td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.permission-type-title' | globalize }}</td>
          <td>
            <template v-if="poll.permissionType === restrictedPollType">
              {{ 'poll-requests.restricted-type-desc' | globalize }}
            </template>
          </td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.provider-id' | globalize }}</td>
          <td>{{ poll.resultProvider.id }}</td>
        </tr>

        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'poll-requests.vote-confirmation-required-title' | globalize }}</td>
          <td>
            <template v-if="poll.voteConfirmationRequired">
              {{ 'poll-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'poll-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>

        <tr>
          <td
            class="poll-details__question"
            :colspan="isQuestionMaxLen ? 2 : 1"
          >
            {{ 'poll-requests.question-title' | globalize }}
            <template v-if="isQuestionMaxLen">
              <br>
              {{ poll.creatorDetails.question }}
            </template>
          </td>
          <template v-if="!isQuestionMaxLen">
            <td>
              {{ poll.creatorDetails.question }}
            </td>
          </template>
        </tr>
        <tr
          v-for="(choice, id) in poll.creatorDetails.choices"
          :key="id">
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'poll-requests.choice-title' | globalize({ number: choice.number }) }}</td>
          <td>{{ choice.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const QUESTION_MAX_LEN = 20

export default {
  name: 'poll-details',
  props: {
    poll: { type: Object, required: true },
  },
  computed: {
    ...mapGetters({
      restrictedPollType: vuexTypes.kvPollTypeRestricted,
    }),
    isQuestionMaxLen () {
      return this.poll.creatorDetails.question.length >= QUESTION_MAX_LEN
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.poll-details .poll-details__question:last-child {
  text-align: left;
  white-space: normal;
}

.poll-details tr td:last-child {
  text-align: right;
}
</style>
