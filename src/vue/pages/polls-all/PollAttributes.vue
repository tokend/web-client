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
              {{ pollStateTranslated | globalize }}
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
              {{ pollPermissionTypeTranslated | globalize }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'poll-attributes.number-of-choices-key' | globalize }}
            </td>
            <td>
              {{ formatNumber(poll.numberOfChoices) }}
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
import { defineComponent, computed } from 'vue'
import { formatNumber } from '@/js/helpers/number-helper'

export default defineComponent({
  components: {
    EmailGetter,
  },

  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
  },

  setup (props) {
    const pollStateTranslated = computed(() => {
      let translationId

      if (props.poll.isOpen) {
        translationId = 'poll-attributes.state-open-val'
      } else if (props.poll.isPassed) {
        translationId = 'poll-attributes.state-passed-val'
      } else if (props.poll.isFailed) {
        translationId = 'poll-attributes.state-failed-val'
      } else if (props.poll.isCanceled) {
        translationId = 'poll-attributes.state-canceled-val'
      } else {
        translationId = '[UNKNOWN_STATE]'
      }
      return translationId
    })

    const pollPermissionTypeTranslated = computed(() => {
      let translationId
      switch (props.poll.permissionType) {
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
      return translationId
    })

    return {
      pollStateTranslated,
      pollPermissionTypeTranslated,
      formatNumber,
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
