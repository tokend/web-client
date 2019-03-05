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
import { ParticularBalanceChangeEffect } from '../../wrappers/effect'

export default {
  props: {
    effect: {
      type: ParticularBalanceChangeEffect,
      required: true,
    },
  },
  computed: {
    amount () {
      return {
        value: this.effect.amount,
        currency: this.effect.assetCode,
      }
    },
    fixedFee () {
      return {
        currency: this.effect.assetCode,
        value: this.effect.fixedFee,
      }
    },
    calculatedPercentFee () {
      return {
        currency: this.effect.assetCode,
        value: this.effect.calculatedPercentFee,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/attributes-viewer';
</style>
