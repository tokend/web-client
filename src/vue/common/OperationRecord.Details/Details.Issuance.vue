<template>
  <div class="details">
    <table class="details__table">
      <tr>
        <td>{{ 'tx-pages.date' | globalize }}</td>
        <td>{{ operation.id }}</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.counterparty' | globalize }}</td>
        <td>{{ operation.counterparty }}</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.counterpartyEmail' | globalize }}</td>
        <td>{{ operation.counterparty }} Email</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.amount' | globalize }}</td>
        <td>
          {{
            { value: operation.amount, currency: operation.asset } |
              formatMoney
          }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.convertedAmount' | globalize }}</td>
        <td>convert ammount</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.fixedFee' | globalize }}</td>
        <td>
          {{
            { value: operation.fixedFee, currency: operation.feeAsset } |
              formatMoney
          }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.percentFee' | globalize }}</td>
        <td>
          {{
            { value: operation.percentFee, currency: operation.feeAsset } |
              formatMoney
          }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.asset' | globalize }}</td>
        <td>{{ operation.asset }}</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.date' | globalize }}</td>
        <td>{{ operation.date | formatCalendar }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'trade-orders-buy',
  components: {},
  mixins: [],
  props: {
    operation: { type: Object, required: true }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {
  },
  destroyed () {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  @import '@/scss/variables';

  .details {
    margin: 9px 15px 0 15px;
    padding: 7px 0 7px 0;
    border-top: 1px solid $col-button-flat-disabled-txt;
  }
  .details__table {
    td {
      padding: 7px 15px 7px 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &:first-child {
        color: $col-table-head-text;
      }
    }
  }
</style>
