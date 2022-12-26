<template>
  <div class="requests-table">
    <div
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <!-- eslint-disable max-len -->
            <th :title="'poll-requests.poll-header' | globalize">
              {{ 'poll-requests.poll-header' | globalize }}
            </th>
            <th :title="'poll-requests.request-state-header' | globalize">
              {{ 'poll-requests.request-state-header' | globalize }}
            </th>
            <th :title="'poll-requests.created-header' | globalize">
              {{ 'poll-requests.created-header' | globalize }}
            </th>
            <th :title="'poll-requests.last-updated-header' | globalize">
              {{ 'poll-requests.last-updated-header' | globalize }}
            </th>
            <!-- eslint-enable max-len -->
          </tr>
        </thead>

        <tbody
          v-if="requests.length"
        >
          <tr
            v-for="request in requests"
            :key="request.id"
          >
            <td :title="request.question">
              {{ request.question }}
            </td>

            <td>
              <request-state-viewer :request="request" />
            </td>

            <td :title="formatCalendar(request.createdAt)">
              {{ formatCalendar(request.createdAt) }}
            </td>

            <td :title="formatCalendar(request.updatedAt)">
              {{ formatCalendar(request.updatedAt) }}
            </td>

            <td>
              <a
                class="requests-table__details-btn"
                @click="$emit(EVENTS.select, request)"
              >
                {{ 'poll-requests.details-btn' | globalize }}
              </a>
            </td>
          </tr>
        </tbody>
        <empty-tbody-placeholder
          v-else-if="!requests.length && isLoaded"
          :colspan="5"
          :message="'poll-requests.no-request-history-desc' | globalize"
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
import RequestStateViewer from '../../shared/components/request-state-viewer'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'

import { formatCalendar } from '@/js/helpers/date-helpers'

const EVENTS = {
  select: 'select',
}

export default {
  name: 'requests-table',
  components: {
    RequestStateViewer,
    SkeletonLoaderTableBody,
    EmptyTbodyPlaceholder,
  },

  props: {
    requests: {
      type: Array,
      required: true,
    },
    isLoaded: {
      type: Boolean,
      required: true,
    },
  },

  data: _ => ({
    EVENTS,
  }),

  setup () {
    return {
      formatCalendar,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.requests-table tr td:last-child {
  width: 3rem;
  text-align: right;
}

.requests-table__details-btn {
  font-size: 1.2rem;
  color: $col-btn;
  cursor: pointer;
}
</style>
