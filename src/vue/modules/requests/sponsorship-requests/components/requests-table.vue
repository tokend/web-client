<template>
  <div class="requests-table">
    <div
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <template v-if="isIncomingRequests">
              <!-- eslint-disable max-len -->
              <th :title="'sponsorship-requests.sponsor-business-header' | globalize">
                {{ 'sponsorship-requests.sponsor-business-header' | globalize }}
              </th>
            </template>
            <template v-else>
              <th :title="'sponsorship-requests.consumer-business-header' | globalize">
                {{ 'sponsorship-requests.consumer-business-header' | globalize }}
              </th>
            </template>

            <th :title="'sponsorship-requests.sponsor-asset-name-header' | globalize">
              {{ 'sponsorship-requests.sponsor-asset-name-header' | globalize }}
            </th>
            <!-- eslint-enable max-len -->

            <th :title="'sponsorship-requests.amount-header' | globalize">
              {{ 'sponsorship-requests.amount-header' | globalize }}
            </th>
            <!-- eslint-disable-next-line max-len -->
            <th :title="'sponsorship-requests.request-state-header' | globalize">
              {{ 'sponsorship-requests.request-state-header' | globalize }}
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
            <template v-if="isIncomingRequests">
              <td :title="request.sponsorBusiness">
                <email-getter :account-id="request.sponsorBusiness" />
              </td>
            </template>
            <template v-else>
              <td :title="request.consumerBusiness">
                <email-getter :account-id="request.consumerBusiness" />
              </td>
            </template>

            <td :title="request.consumerAsset.name">
              {{ request.consumerAsset.name }}
            </td>

            <td :title="request.amount | formatMoney">
              {{ request.amount | formatMoney }}
              {{ request.sponsorAsset.name }}
            </td>

            <td>
              <request-state-viewer :request="request" />
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
    isIncomingRequests: { type: Boolean, default: false },
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
