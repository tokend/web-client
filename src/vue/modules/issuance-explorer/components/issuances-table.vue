<template>
  <div class="issuances-table">
    <template>
      <div class="app__table app__table--with-shadow">
        <table>
          <thead>
            <tr>
              <!-- eslint-disable-next-line max-len -->
              <th :title="'issuance-explorer.table.counterparty-th' | globalize">
                {{ 'issuance-explorer.table.counterparty-th' | globalize }}
              </th>
              <th :title="'issuance-explorer.table.amount-th' | globalize">
                {{ 'issuance-explorer.table.amount-th' | globalize }}
              </th>
              <th :title="'issuance-explorer.table.asset-code-th' | globalize">
                {{ 'issuance-explorer.table.asset-code-th' | globalize }}
              </th>
              <!-- eslint-disable-next-line max-len -->
              <th :title="'issuance-explorer.table.state-header-th' | globalize">
                {{ 'issuance-explorer.table.state-header-th' | globalize }}
              </th>
              <th :title="'issuance-explorer.table.date-th' | globalize">
                {{ 'issuance-explorer.table.date-th' | globalize }}
              </th>
              <th :title="'issuance-explorer.table.reference-th' | globalize">
                {{ 'issuance-explorer.table.reference-th' | globalize }}
              </th>
            </tr>
          </thead>
          <tbody v-if="issuances.length">
            <tr v-for="issuance in issuances" :key="issuance.id">
              <td>
                <email-getter :balance-id="issuance.counterparty" />
              </td>

              <td :title="issuance.amount | formatMoney">
                {{ issuance.amount | formatMoney }}
              </td>

              <td :title="issuance.asset">
                {{ issuance.asset }}
              </td>

              <td>
                <request-state-viewer :request="issuance" />
              </td>

              <td :title="issuance.date | formatCalendar">
                {{ issuance.date | formatCalendar }}
              </td>

              <td :title="issuance.reference">
                {{ issuance.reference }}
              </td>
            </tr>
          </tbody>
          <skeleton-loader-table-body
            v-else-if="!isLoaded"
            :cells="6"
          />
          <empty-tbody-placeholder
            v-else
            :colspan="6"
            :message="'issuance-explorer.table.no-issuances-msg' | globalize"
          />
        </table>
      </div>
    </template>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import RequestStateViewer from './request-state-viewer'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'
import EmptyTbodyPlaceholder from '@/vue/common/EmptyTbodyPlaceholder'

export default {
  name: 'issuanes-table',
  components: {
    EmailGetter,
    RequestStateViewer,
    SkeletonLoaderTableBody,
    EmptyTbodyPlaceholder,
  },

  props: {
    issuances: {
      type: Array, /** {@link Issuance} **/
      required: true,
    },
    isLoaded: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
