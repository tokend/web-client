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
        :label="'op-pages.asset'| globalize"
        :value="operation.asset"
      />
      <detail
        :label="'op-pages.amount'| globalize"
        :value="{
          value: operation.amount,
          currency: operation.asset
        } | formatMoney"
      />
      <detail
        :label="'op-pages.destination-fees'| globalize"
        :value="{
          value: operation.fees.destination,
          currency: operation.sourceFeeAsset
        } | formatMoney"
      />
      <detail
        :label="'op-pages.source-fees'| globalize"
        :value="{
          value: operation.fees.source,
          currency: operation.destinationFeeAsset
        } | formatMoney"
      />
      <detail
        :label="'op-pages.subject'| globalize"
        :value="operation.subject"
      />
    </table>
  </div>
</template>

<script>
import Detail from './Detail'
import PaymentRecord from '@/js/records/operations/payment.record'
import EmailGetter from '@/vue/common/EmailGetter'
export default {
  name: 'payment-details',
  components: { Detail, EmailGetter },
  props: {
    operation: { type: PaymentRecord, required: true },
  },
}
</script>

<style lang="scss" scoped>
  @import './operation-details';
</style>
