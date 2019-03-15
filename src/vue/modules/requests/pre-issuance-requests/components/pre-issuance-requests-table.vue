<template>
  <div class="pre-issuance-requests-table">
    <div
      v-if="requests.length"
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

        <tbody>
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
      </table>
    </div>

    <no-data-message
      v-else
      icon-name="trending-up"
      :title="'pre-issuance-requests.no-request-history-title' | globalize"
      :message="'pre-issuance-requests.no-request-history-desc' | globalize"
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
  name: 'pre-issuance-requests-table',
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
