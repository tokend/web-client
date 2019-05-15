<template>
  <div class="requests-table">
    <div
      v-if="requests.length"
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <!-- eslint-disable max-len -->
            <th :title="'incoming-withdrawal-requests.requestor-header' | globalize">
              {{ 'incoming-withdrawal-requests.requestor-header' | globalize }}
            </th>
            <th :title="'incoming-withdrawal-requests.amount-header' | globalize">
              {{ 'incoming-withdrawal-requests.amount-header' | globalize }}
            </th>
            <th :title="'incoming-withdrawal-requests.request-state-header' | globalize">
              {{ 'incoming-withdrawal-requests.request-state-header' | globalize }}
            </th>
            <th :title="'incoming-withdrawal-requests.created-header' | globalize">
              {{ 'incoming-withdrawal-requests.created-header' | globalize }}
            </th>
            <!-- eslint-enable max-len -->
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(request, index) in requests"
            :key="index"
          >
            <td :title="request.requestor">
              <email-getter :account-id="request.requestor" />
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

            <td>
              <a
                class="requests-table__review-btn"
                @click="$emit(EVENTS.select, request)"
              >
                {{ 'incoming-withdrawal-requests.review-btn' | globalize }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <no-data-message
      v-else
      icon-name="trending-up"
      :title="'incoming-withdrawal-requests.no-history-title' | globalize"
      :message="'incoming-withdrawal-requests.no-history-desc' | globalize"
    />
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import NoDataMessage from '@/vue/common/NoDataMessage'
import RequestStateViewer from '../../shared/components/request-state-viewer'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'requests-table',
  components: {
    EmailGetter,
    NoDataMessage,
    RequestStateViewer,
  },

  props: {
    requests: { type: Array, required: true },
  },

  data: _ => ({
    EVENTS,
  }),
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.requests-table tr td:last-child {
  width: 3rem;
  text-align: right;
}

.requests-table__review-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
  cursor: pointer;
}
</style>
