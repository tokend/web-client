<template>
  <div class="sale-creation-requests-table">
    <div
      v-if="requests.length"
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <!-- eslint-disable max-len -->
            <th :title="'sale-creation-requests.sale-name-header' | globalize">
              {{ 'sale-creation-requests.sale-name-header' | globalize }}
            </th>
            <th :title="'sale-creation-requests.asset-code-header' | globalize">
              {{ 'sale-creation-requests.asset-code-header' | globalize }}
            </th>
            <th :title="'sale-creation-requests.request-state-header' | globalize">
              {{ 'sale-creation-requests.request-state-header' | globalize }}
            </th>
            <th :title="'sale-creation-requests.created-header' | globalize">
              {{ 'sale-creation-requests.created-header' | globalize }}
            </th>
            <th :title="'sale-creation-requests.last-updated-header' | globalize">
              {{ 'sale-creation-requests.last-updated-header' | globalize }}
            </th>
            <!-- eslint-enable max-len -->
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="request in requests"
            :key="request.id"
          >
            <td :title="request.name">
              {{ request.name }}
            </td>

            <td :title="request.baseAsset">
              {{ request.baseAsset }}
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
                class="sale-creation-requests-table__details-btn"
                @click="$emit(EVENTS.select, request)"
              >
                {{ 'sale-creation-requests.details-btn' | globalize }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <no-data-message
      v-else
      icon-name="trending-up"
      :title="'sale-creation-requests.no-request-history-title' | globalize"
      :message="'sale-creation-requests.no-request-history-desc' | globalize"
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
  name: 'sale-creation-requests-table',
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

.sale-creation-requests-table {
  tr td:last-child {
    width: 3rem;
    text-align: right;
  }
}

.sale-creation-requests-table__details-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
  cursor: pointer;
}
</style>
