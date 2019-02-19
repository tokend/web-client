<template>
  <tbody>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.amount-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ amount | formatMoney }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.fixed-fee-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ fixedFee | formatMoney }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.calculated-percent-fee-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ calculatedPercentFee | formatMoney }}
      </td>
    </tr>
  </tbody>
</template>

<script>
import { BalanceChangedEffect } from '../../wrappers/effect'

export default {
  name: 'balance-changed',
  props: {
    effect: {
      type: BalanceChangedEffect,
      required: true,
    },
    assetCode: {
      type: String,
      required: true,
    },
  },
  computed: {
    amount () {
      return {
        currency: this.assetCode,
        value: this.effect.amount,
      }
    },
    fixedFee () {
      return {
        currency: this.assetCode,
        value: this.effect.fixedFee,
      }
    },
    calculatedPercentFee () {
      return {
        currency: this.assetCode,
        value: this.effect.calculatedPercentFee,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/attributes-viewer';
</style>
