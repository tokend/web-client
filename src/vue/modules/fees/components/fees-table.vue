<template>
  <div class="fees-table">
    <div
      v-if="fees.length"
      class="fees-table__wrp app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <th :title="'fees.table.scope-th' | globalize">
              {{ 'fees.table.scope-th' | globalize }}
            </th>
            <th :title="'fees.table.type-th' | globalize">
              {{ 'fees.table.type-th' | globalize }}
            </th>
            <th :title="'fees.table.subtype-th' | globalize">
              {{ 'fees.table.subtype-th' | globalize }}
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

        <tbody>
          <tr
            v-for="(fee, i) in fees"
            :key="i"
          >
            <td>
              <fee-scope-viewer :fee="fee" />
            </td>

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

            <td :title="(fee.percent / 100) | formatPercent">
              {{ (fee.percent / 100) | formatPercent }}
            </td>

            <td :title="fee.lowerBound | formatMoney">
              {{ fee.lowerBound | formatMoney }}
            </td>

            <td :title="fee.upperBound | formatMoney">
              {{ fee.upperBound | formatMoney }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <no-data-message
      v-else
      icon-name="trending-up"
      title-id="fees.no-valuable-fees-title"
      message-id="fees.no-valuable-fees-msg"
      :message-id-keys="{ asset: assetCode }"
    />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'

import FeeScopeViewer from './viewers/fee-scope-viewer'
import FeeTypeViewer from './viewers/fee-type-viewer'
import FeeSubtypeViewer from './viewers/fee-subtype-viewer'

export default {
  name: 'fees-table',
  components: {
    NoDataMessage,
    FeeScopeViewer,
    FeeTypeViewer,
    FeeSubtypeViewer,
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
  },
}
</script>

<style lang="scss" scoped>

</style>
