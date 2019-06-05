<template>
  <div class="fees-table">
    <div
      class="app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <th :title="'fees.table.type-th' | globalize">
              {{ 'fees.table.type-th' | globalize }}
            </th>
            <th :title="'fees.table.direction-th' | globalize">
              {{ 'fees.table.direction-th' | globalize }}
            </th>
            <th :title="'fees.table.fixed-th' | globalize">
              {{ 'fees.table.fixed-th' | globalize }}
            </th>
            <th :title="'fees.table.percent-th' | globalize">
              {{ 'fees.table.percent-th' | globalize }}
            </th>
            <th :title="'fees.table.lower-bound-th' | globalize">
              {{ 'fees.table.lower-bound-th' | globalize }}
            </th>
            <th :title="'fees.table.upper-bound-th' | globalize">
              {{ 'fees.table.upper-bound-th' | globalize }}
            </th>
          </tr>
        </thead>
        <tbody v-if="isLoaded && fees.length">
          <tr
            v-for="(fee, i) in fees"
            :key="i"
          >
            <td>
              <fee-type-viewer :fee="fee" />
            </td>

            <td>
              <fee-subtype-viewer :fee="fee" />
            </td>

            <!-- eslint-disable-next-line -->
            <td :title="{ value: fee.fixed, currency: fee.asset } | formatMoney">
              {{ { value: fee.fixed, currency: fee.asset } | formatMoney }}
            </td>

            <td :title="fee.percent | formatPercent">
              {{ fee.percent | formatPercent }}
            </td>

            <!-- eslint-disable-next-line -->
            <td :title="{ value: fee.lowerBound, currency: fee.asset } | formatMoney">
              {{ { value: fee.lowerBound, currency: fee.asset } | formatMoney }}
            </td>

            <!-- eslint-disable-next-line -->
            <td :title="{ value: fee.upperBound, currency: fee.asset } | formatMoney">
              {{ { value: fee.upperBound, currency: fee.asset } | formatMoney }}
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="isLoaded">
          <tr>
            <td
              class="fees-table__empty-list-placeholder"
              colspan="6"
            >
              <!-- eslint-disable-next-line -->
              {{ 'fees.no-valuable-fees-msg' | globalize({ asset: assetCode }) }}
            </td>
          </tr>
        </tbody>

        <skeleton-loader-table-body
          v-else
          :cells="6"
        />
      </table>
    </div>
  </div>
</template>

<script>
import FeeTypeViewer from './viewers/fee-type-viewer'
import FeeSubtypeViewer from './viewers/fee-subtype-viewer'
import SkeletonLoaderTableBody from '@/vue/common/skeleton-loader/SkeletonLoaderTableBody'

export default {
  name: 'fees-table',
  components: {
    FeeTypeViewer,
    FeeSubtypeViewer,
    SkeletonLoaderTableBody,
  },

  props: {
    fees: {
      type: Array, /** {@link Fee} **/
      required: true,
    },
    assetCode: {
      type: String,
      default: '',
    },
    isLoaded: {
      type: Boolean,
      require: true,
    },
  },
}
</script>

<style scoped lang="scss">
  .fees-table__empty-list-placeholder {
    text-align: center;
  }
</style>
