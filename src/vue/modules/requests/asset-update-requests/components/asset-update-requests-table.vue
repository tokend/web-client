<template>
  <div class="asset-update-requests-table">
    <div
      v-if="requests.length"
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <!-- eslint-disable max-len -->
            <th :title="'asset-update-requests.asset-code-header' | globalize">
              {{ 'asset-update-requests.asset-code-header' | globalize }}
            </th>
            <th :title="'asset-update-requests.request-state-header' | globalize">
              {{ 'asset-update-requests.request-state-header' | globalize }}
            </th>
            <th :title="'asset-update-requests.created-header' | globalize">
              {{ 'asset-update-requests.created-header' | globalize }}
            </th>
            <th :title="'asset-update-requests.last-updated-header' | globalize">
              {{ 'asset-update-requests.last-updated-header' | globalize }}
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

            <td>
              <request-state-viewer :request="request" />
            </td>

            <td :title="request.createdAt | formatCalendar">
              {{ request.createdAt | formatCalendar }}
            </td>

            <td :title="request.updatedAt | formatCalendar">
              {{ request.updatedAt | formatCalendar }}
            </td>

            <td>
              <a
                class="asset-update-requests-table__details-btn"
                @click="$emit(EVENTS.select, request)"
              >
                {{ 'asset-update-requests.details-btn' | globalize }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <no-data-message
      v-else
      icon-name="trending-up"
      :title="'asset-update-requests.no-request-history-title' | globalize"
      :message="'asset-update-requests.no-request-history-desc' | globalize"
    />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import RequestStateViewer from '../../shared/components/request-state-viewer'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'asset-update-requests-table',
  components: {
    NoDataMessage,
    RequestStateViewer,
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

.asset-update-requests-table {
  tr td:last-child {
    width: 3rem;
    text-align: right;
  }
}

.asset-update-requests-table__details-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
  cursor: pointer;
}
</style>
