<template>
  <div
    class="fees-table app__table app__table--with-shadow"
    v-if="fees.length"
  >
    <table>
      <thead>
        <tr>
          <th :title="'fee-table.fee-type' | globalize">
            {{ 'fee-table.fee-type' | globalize }}
          </th>
          <th :title="'fee-table.subtype' | globalize">
            {{ 'fee-table.subtype' | globalize }}
          </th>
          <th :title="'fee-table.fixed' | globalize">
            {{ 'fee-table.fixed' | globalize }}
          </th>
          <th :title="'fee-table.percent' | globalize">
            {{ 'fee-table.percent' | globalize }}
          </th>
          <th :title="'fee-table.lower-bound' | globalize">
            {{ 'fee-table.lower-bound' | globalize }}
          </th>
          <th :title="'fee-table.upper-bound' | globalize">
            {{ 'fee-table.upper-bound' | globalize }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(fee, i) in fees"
          :key="i"
        >
          <td :title="fee.type | formatFeeType">
            {{ fee.type | formatFeeType }}
          </td>

          <!-- eslint-disable max-len -->
          <td :title="{ type: fee.type, subtype: fee.subtype } | formatFeeSubType">
            {{ { type: fee.type, subtype: fee.subtype } | formatFeeSubType }}
          </td>

          <td :title="{ value: fee.fixed, currency: fee.asset } | formatMoney">
            {{ { value: fee.fixed, currency: fee.asset } | formatMoney }}
          </td>

          <!-- eslint-enable max-len -->
          <td :title="fee.percent | formatPercent">
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
    title-id="fee-page.no-valuable-fees-title"
    message-id="fee-page.no-valuable-fees-msg"
  />
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'

export default {
  name: 'fees-table',
  components: {
    NoDataMessage,
  },

  props: {
    fees: {
      type: Array, /** {@link Fee} **/
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
