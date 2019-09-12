<template>
  <div class="requests-table">
    <div
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <th :title="'sponsorship-requests.requestor-header' | globalize">
              {{ 'sponsorship-requests.requestor-header' | globalize }}
            </th>
            <th :title="'sponsorship-requests.asset-code-header' | globalize">
              {{ 'sponsorship-requests.asset-code-header' | globalize }}
            </th>
            <th :title="'sponsorship-requests.amount-header' | globalize">
              {{ 'sponsorship-requests.amount-header' | globalize }}
            </th>
            <!-- eslint-disable-next-line max-len -->
            <th :title="'sponsorship-requests.request-state-header' | globalize">
              {{ 'sponsorship-requests.request-state-header' | globalize }}
            </th>
            <th :title="'sponsorship-requests.created-header' | globalize">
              {{ 'sponsorship-requests.created-header' | globalize }}
            </th>
          </tr>
        </thead>

        <tbody
          v-if="requests.length && isLoaded"
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
                {{ 'sponsorship-requests.review-btn' | globalize }}
              </a>
            </td>
          </tr>
        </tbody>
        <empty-tbody-placeholder
          v-else-if="!requests.length && isLoaded"
          :colspan="5"
          :message="'sponsorship-requests.no-history-desc' | globalize"
        />
        <skeleton-loader-table-body
          v-else
          :cells="5"
        />
      </table>
    </div>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import RequestStateViewer from '../../shared/components/request-state-viewer'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'requests-table',
  components: {
    EmailGetter,
    RequestStateViewer,
    SkeletonLoaderTableBody,
    EmptyTbodyPlaceholder,
  },

  props: {
    requests: { type: Array, required: true },
    isLoaded: { type: Boolean, required: true },
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
