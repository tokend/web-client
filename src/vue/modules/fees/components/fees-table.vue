<template>
  <div class="fees-table">
    <div
      v-if="fees.length"
      class="fees-table__wrp app__table app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <th :title="'fees.table.fee-type' | globalize">
              {{ 'fees.table.fee-type' | globalize }}
            </th>
            <th :title="'fees.table.subtype' | globalize">
              {{ 'fees.table.subtype' | globalize }}
            </th>
            <th :title="'fees.table.fixed' | globalize">
              {{ 'fees.table.fixed' | globalize }}
            </th>
            <th :title="'fees.table.percent' | globalize">
              {{ 'fees.table.percent' | globalize }}
            </th>
            <th :title="'fees.table.lower-bound' | globalize">
              {{ 'fees.table.lower-bound' | globalize }}
            </th>
            <th :title="'fees.table.upper-bound' | globalize">
              {{ 'fees.table.upper-bound' | globalize }}
            </th>
          </tr>
        </thead>

        <tbody>
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
import FeeTypeViewer from './fee-type-viewer'
import FeeSubtypeViewer from './fee-subtype-viewer'

export default {
  name: 'fees-table',
  components: {
    NoDataMessage,
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
