<template>
  <div class="details">
    <table class="details__table">
      <detail
        :label="'op-pages.id'| globalize"
        :value="operation.id"
      />
      <detail
        :label="'op-pages.date'| globalize"
        :value="operation.date | formatCalendar"
      />
      <detail
        :label="'op-pages.counterparty'| globalize"
        :value="operation.counterparty"
      />
      <tr>
        <td>{{ 'op-pages.counterparty-email' | globalize }}</td>
        <td>
          <email-getter :account-id="operation.counterparty" />
        </td>
      </tr>
      <detail
        :label="'op-pages.destination-asset'| globalize"
        :value="operation.destinationAsset"
      />
      <detail
        :label="'op-pages.destination-amount'| globalize"
        :value="{
          value: operation.destinationAmount,
          currency: operation.destinationAsset
        } | formatMoney"
      />
      <detail
        :label="'op-pages.amount'| globalize"
        :value="{
          value: operation.amount,
          currency: operation.asset
        } | formatMoney"
      />
      <detail
        :label="'op-pages.fixed-fee'| globalize"
        :value="{
          value: operation.fixedFee,
          currency: operation.feeAsset
        } | formatMoney"
      />
      <detail
        :label="'op-pages.percentFee'| globalize"
        :value="{
          value: operation.percentFee,
          currency: operation.feeAsset
        } | formatMoney"
      />
    </table>
  </div>
</template>

<script>
import Detail from './Detail'
import WithdrawRecord from '@/js/records/operations/withdraw.record'
import EmailGetter from '@/vue/common/EmailGetter'
export default {
  name: 'withdrawal-details',
  components: { Detail, EmailGetter },
  props: {
    operation: { type: WithdrawRecord, required: true },
  },
}
</script>

<style lang="scss" scoped>
  @import './operation-details';
</style>
