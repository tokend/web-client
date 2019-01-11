<template>
  <div class="details">
    <table class="details__table">
      <tr>
        <td>{{ 'tx-pages.id' | globalize }}</td>
        <td>{{ operation.id }}</td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.date' | globalize }}</td>
        <td>{{ operation.date | formatCalendar }}</td>
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
        <td>{{ 'tx-pages.asset' | globalize }}</td>
        <td>{{ operation.asset }}</td>
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
  @import './OperationDetails';
</style>
