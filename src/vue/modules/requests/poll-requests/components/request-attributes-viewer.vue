<template>
  <div class="request-attributes-viewer app__table">
    <table>
      <tbody>
        <tr>
          <td>{{ 'poll-requests.start-time-title' | globalize }}</td>
          <td>{{ request.startTime | formatCalendar }}</td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.close-time-title' | globalize }}</td>
          <td>{{ request.closeTime | formatCalendar }}</td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.number-of-choices-title' | globalize }}</td>
          <td>{{ request.numberOfChoices }}</td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.permission-type-title' | globalize }}</td>
          <td>{{ request.permissionType }}</td>
        </tr>

        <tr>
          <td>{{ 'poll-requests.provider-id' | globalize }}</td>
          <td>{{ request.resultProvider }}</td>
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
          <td>
            {{ 'poll-requests.question-title' | globalize }}
          </td>
          <td>{{ request.question }}</td>
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

export default {
  name: 'request-attributes-viewer',
  props: {
    request: { type: PollRequest, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.request-attributes-viewer tr td:last-child {
  text-align: right;
}

.request-attributes-viewer__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}
</style>
