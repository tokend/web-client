<template>
  <div class="requests-table">
    <div
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <th :title="'pre-issuance-requests.asset-code-header' | globalize">
              {{ 'pre-issuance-requests.asset-code-header' | globalize }}
            </th>
            <th :title="'pre-issuance-requests.amount-header' | globalize">
              {{ 'pre-issuance-requests.amount-header' | globalize }}
            </th>
            <!-- eslint-disable-next-line max-len -->
            <th :title="'pre-issuance-requests.request-state-header' | globalize">
              {{ 'pre-issuance-requests.request-state-header' | globalize }}
            </th>
            <th :title="'pre-issuance-requests.created-header' | globalize">
              {{ 'pre-issuance-requests.created-header' | globalize }}
            </th>
          </tr>
        </thead>

        <tbody
          v-if="requests.length"
        >
          <tr
            v-for="request in requests"
            :key="request.id"
          >
            <td :title="request.assetCode">
              {{ request.assetCode }}
            </td>

            <td :title="request.amount | formatMoney">
              {{ request.amount | formatMoney }}
            </td>

            <td>
              <request-state-viewer :request="request" />
            </td>

            <td :title="request.createdAt | formatCalendar">
              {{ request.createdAt | formatCalendar }}
            </td>
          </tr>
        </tbody>
        <empty-list-placeholder
          v-else
          :colspan="4"
          :message="'pre-issuance-requests.no-request-history-desc' | globalize"
        />
      </table>
    </div>
  </div>
</template>

<script>
import RequestStateViewer from '../../shared/components/request-state-viewer'
import EmptyListPlaceholder from '@/vue/common/EmptyListPlaceholder'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'requests-table',
  components: {
    RequestStateViewer,
    EmptyListPlaceholder,
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
