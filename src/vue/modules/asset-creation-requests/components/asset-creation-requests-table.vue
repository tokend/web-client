<template>
  <div class="asset-creation-requests__table">
    <div
      v-if="requests.length"
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <!-- eslint-disable max-len -->
            <th :title="'asset-creation-requests.asset-code-header' | globalize">
              {{ 'asset-creation-requests.asset-code-header' | globalize }}
            </th>
            <th :title="'asset-creation-requests.request-state-header' | globalize">
              {{ 'asset-creation-requests.request-state-header' | globalize }}
            </th>
            <th :title="'asset-creation-requests.created-header' | globalize">
              {{ 'asset-creation-requests.created-header' | globalize }}
            </th>
            <th :title="'asset-creation-requests.last-updated-header' | globalize">
              {{ 'asset-creation-requests.last-updated-header' | globalize }}
            </th>
            <!-- eslint-enable max-len -->
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="request in requests"
            :key="request.id"
          >
            <td :title="request.assetCode">
              {{ request.assetCode }}
            </td>

            <td
              v-if="request.isApproved"
              class="request-state request-state--approved"
              :title="'request-states.approved-state' | globalize"
            >
              {{ 'request-states.approved-state' | globalize }}
            </td>

            <td
              v-if="request.isPending"
              class="request-state request-state--pending"
              :title="'request-states.pending-state' | globalize"
            >
              {{ 'request-states.pending-state' | globalize }}
            </td>

            <td
              v-if="request.isRejected"
              class="request-state request-state--rejected"
              :title="'request-states.rejected-state' | globalize"
            >
              {{ 'request-states.rejected-state' | globalize }}
            </td>

            <td
              v-if="request.isCanceled"
              class="request-state request-state--canceled"
              :title="'request-states.canceled-state' | globalize"
            >
              {{ 'request-states.canceled-state' | globalize }}
            </td>

            <!-- eslint-disable max-len -->
            <td
              v-if="request.isPermanentlyRejected"
              class="request-state request-state--permanently-rejected"
              :title="'request-states.permanently-rejected-state' | globalize"
            >
              {{ 'request-states.permanently-rejected-state' | globalize }}
            </td>
            <!-- eslint-enable max-len -->

            <td :title="request.createdAt | formatCalendar">
              {{ request.createdAt | formatCalendar }}
            </td>

            <td :title="request.updatedAt | formatCalendar">
              {{ request.updatedAt | formatCalendar }}
            </td>

            <td>
              <a
                class="request-details-btn"
                @click="$emit(EVENTS.select, request)"
              >
                {{ 'asset-creation-requests.details-btn' | globalize }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <no-data-message
      v-else
      icon-name="trending-up"
      title-id="asset-creation-requests.no-request-history-title"
      message-id="asset-creation-requests.no-request-history-desc"
    />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'asset-creation-requests-table',
  components: {
    NoDataMessage,
  },

  props: {
    requests: {
      type: Array,
      required: true,
    },
  },

  data: _ => ({
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.asset-creation-requests__table {
  tr td:last-child {
    width: 3rem;
    text-align: right;
  }
}

.request-details-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
  cursor: pointer;
}

.request-state {
  padding-left: 3rem;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    width: 0.6rem;
    height: 0.6rem;
    top: 1.7rem;
    transform: translateY(-50%);
    left: 1.6rem;
    border-radius: 100%;
  }

  &--approved:before {
    background-color: $col-success;
  }

  &--pending:before {
    background-color: $col-warning;
  }

  &--rejected:before,
  &--canceled:before,
  &--permanently-rejected:before {
    background-color: $col-error;
  }
}
</style>
