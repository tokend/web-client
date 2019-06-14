<template>
  <div class="poll-participants-viewer app__table">
    <table>
      <thead>
        <tr>
          <th>
            {{ 'poll-participants.email-lbl' | globalize }}
          </th>
          <th>
            {{ 'poll-participants.choice-lbl' | globalize }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(participant, id) in poll.participants"
          :key="id"
        >
          <td>
            <email-getter :account-id="participant.id" />
          </td>
          <td>{{ getChoiceDescription(participant.choice) }}</td>
        </tr>
      </tbody>
      <empty-tbody-placeholder
        v-if="!poll.participants.length"
        :colspan="2"
        :message="'poll-participants.no-request-history-desc' | globalize"
      />
    </table>
  </div>
</template>

<script>
import { PollRecord } from '@/js/records/entities/poll.record'
import EmailGetter from '@/vue/common/EmailGetter'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'

export default {
  name: 'poll-participants',
  components: {
    EmailGetter,
    EmptyTbodyPlaceholder,
  },
  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
  },
  methods: {
    getChoiceDescription (value) {
      const choice = this.poll.choices.find(item => {
        return item.number === value
      })
      return choice.description
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
