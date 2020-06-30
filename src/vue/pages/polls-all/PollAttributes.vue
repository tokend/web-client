<template>
  <div class="poll-attributes">
    <div class="app__table app__table--last-td-to-right">
      <table>
        <tbody>
          <tr>
            <td>
              {{ 'poll-attributes.id-key' | globalize }}
            </td>
            <td>
              {{ poll.id }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'poll-attributes.owner-key' | globalize }}
            </td>
            <td>
              <email-getter
                right-side
                :account-id="poll.ownerId"
              />
            </td>
          </tr>

          <tr>
            <td>
              {{ 'poll-attributes.start-time-key' | globalize }}
            </td>
            <td>
              {{ poll.startsAt | formatDateDMYT }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'poll-attributes.end-time-key' | globalize }}
            </td>
            <td>
              {{ poll.endsAt | formatDateDMYT }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'poll-attributes.state-key' | globalize }}
            </td>
            <td>
              {{ pollStateTranslated }}
            </td>
          </tr>

          <!-- Temp. hidden -->
          <tr v-if="false">
            <td>
              {{ 'poll-attributes.is-ongoing-key' | globalize }}
            </td>
            <td>
              <template v-if="poll.isInProgress">
                {{ 'poll-attributes.yes-val' | globalize }}
              </template>
              <template v-else>
                {{ 'poll-attributes.no-val' | globalize }}
              </template>
            </td>
          </tr>

          <tr>
            <td>
              {{ 'poll-attributes.permission-type-key' | globalize }}
            </td>
            <td>
              {{ pollPermissionTypeTranslated }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'poll-attributes.number-of-choices-key' | globalize }}
            </td>
            <td>
              {{ poll.numberOfChoices | formatNumber }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { PollRecord } from '@/js/records/entities/poll.record'
import EmailGetter from '@/vue/common/EmailGetter'
import { keyValues } from '@/key-values'

export default {
  name: 'poll-attributes',

  components: {
    EmailGetter,
  },

  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
  },

  computed: {
    pollStateTranslated () {
      let translationId

      if (this.poll.isOpen) {
        translationId = 'poll-attributes.state-open-val'
      } else if (this.poll.isPassed) {
        translationId = 'poll-attributes.state-passed-val'
      } else if (this.poll.isFailed) {
        translationId = 'poll-attributes.state-failed-val'
      } else if (this.poll.isCanceled) {
        translationId = 'poll-attributes.state-canceled-val'
      } else {
        translationId = '[UNKNOWN_STATE]'
      }

      return this.$options.filters.globalize(translationId)
    },

    pollPermissionTypeTranslated () {
      let translationId

      switch (this.poll.permissionType) {
        case keyValues.restrictedPollType:
          translationId = 'poll-attributes.permission-type-restricted-val'
          break

        case keyValues.unrestrictedPollType:
          translationId = 'poll-attributes.permission-type-unrestricted-val'
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
</style>
