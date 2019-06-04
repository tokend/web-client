<template>
  <div class="requests-table">
    <div
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <!-- eslint-disable max-len -->
            <th :title="'incoming-withdrawal-requests.requestor-header' | globalize">
              {{ 'incoming-withdrawal-requests.requestor-header' | globalize }}
            </th>
            <th :title="'incoming-withdrawal-requests.asset-code-header' | globalize">
              {{ 'incoming-withdrawal-requests.asset-code-header' | globalize }}
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

        <tbody
          v-if="requests.length"
        >
          <tr
            v-for="(request, index) in requests"
            :key="index"
          >
            <td :title="request.requestor">
              <email-getter :account-id="request.requestor" />
            </td>

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
        <empty-tbody-placeholder
          v-else
          :colspan="5"
          :message="'incoming-withdrawal-requests.no-history-desc' | globalize"
        />
      </table>
    </div>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import RequestStateViewer from '../../shared/components/request-state-viewer'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'requests-table',
  components: {
    EmailGetter,
    RequestStateViewer,
    EmptyTbodyPlaceholder,
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
