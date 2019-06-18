<template>
  <div class="request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <td>{{ 'poll-requests.start-time-title' | globalize }}</td>
          <td>{{ request.startTime | formatCalendar }}</td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.end-time-title' | globalize }}</td>
          <td>{{ request.endTime | formatCalendar }}</td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.number-of-choices-title' | globalize }}</td>
          <td>{{ request.numberOfChoices }}</td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.permission-type-title' | globalize }}</td>
          <td>
            {{ pollPermissionTypeTranslated }}
          </td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.result-provider' | globalize }}</td>
          <td>
            <email-getter :account-id="request.resultProvider" />
          </td>
        </tr>

        <tr>
          <!-- eslint-disable-next-line max-len -->
          <td>{{ 'poll-requests.vote-confirmation-required-title' | globalize }}</td>
          <td>
            <template v-if="request.voteConfirmationRequired">
              {{ 'poll-requests.yes-msg' | globalize }}
            </template>

            <template v-else>
              {{ 'poll-requests.no-msg' | globalize }}
            </template>
          </td>
        </tr>

        <tr>
          <td
            class="request-attributes-viewer__question"
            :colspan="isQuestionMaxLen ? 2 : 1"
          >
            {{ 'poll-requests.question-title' | globalize }}
            <template v-if="isQuestionMaxLen">
              <br>
              {{ request.question }}
            </template>
          </td>
          <template v-if="!isQuestionMaxLen">
            <td>
              {{ request.question }}
            </td>
          </template>
        </tr>
        <tr
          v-for="(choice, id) in request.choices"
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
import { PollRequest } from '../wrappers/poll-request'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import EmailGetter from '@/vue/common/EmailGetter'

const QUESTION_MAX_LEN = 20

export default {
  name: 'request-attributes-viewer',
  components: {
    EmailGetter,
  },
  props: {
    request: { type: PollRequest, required: true },
  },
  computed: {
    ...mapGetters({
      restrictedPollType: vuexTypes.kvPollTypeRestricted,
      unrestrictedPollType: vuexTypes.kvPollTypeUnrestricted,
    }),
    isQuestionMaxLen () {
      return this.request.question.length >= QUESTION_MAX_LEN
    },
    pollPermissionTypeTranslated () {
      let translationId

      switch (this.request.permissionType) {
        case this.restrictedPollType:
          translationId = 'poll-requests.restricted-type-desc'
          break

        case this.unrestrictedPollType:
          translationId = 'poll-requests.unrestricted-type-desc'
          break

        default:
          translationId = '[UNKNOWN_PERMISSION_TYPE]'
          break
      }

      return this.$options.filters.globalize(translationId)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.request-attributes-viewer .request-attributes-viewer__question:last-child {
  text-align: left;
  white-space: normal;
}

.request-attributes-viewer tr td:last-child {
  text-align: right;
}
</style>
