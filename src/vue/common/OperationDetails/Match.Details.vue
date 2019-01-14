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
        <td>{{ 'tx-pages.fundName' | globalize }}</td>
        <td>
          {{ 'tx-pages.tokenFund' | globalize({asset: operation.baseAsset}) }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.baseAsset' | globalize }}</td>
        <td>{{ operation.baseAsset }}</td>
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
        <td>{{ 'tx-pages.feePaid' | globalize }}</td>
        <td>
          {{
            { value: operation.feePaid, currency: operation.asset } |
              formatMoney
          }}
        </td>
      </tr>
      <tr>
        <td>{{ 'tx-pages.price' | globalize }}</td>
        <td>
          {{
            { value: operation.price, currency: operation.quoteAsset } |
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
  created () {},
  destroyed () {},
  methods: {}
}
</script>

<style lang="scss" scoped>
  @import './OperationDetails';
</style>
