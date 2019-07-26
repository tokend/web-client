<template>
  <tbody>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'user-movements-history.asset-pair-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{
          'user-movements-history.asset-pair-value' | globalize({
            base: operationDetails.baseAssetCode,
            quote: operationDetails.quoteAssetCode,
          })
        }}
      </td>
    </tr>

    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'user-movements-history.physical-price-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{
          {
            value: operationDetails.physicalPrice,
            currency: operationDetails.quoteAssetCode
          } | formatMoney
        }}
      </td>
    </tr>

    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'user-movements-history.current-price-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{
          {
            value: operationDetails.currentPrice,
            currency: operationDetails.quoteAssetCode
          } | formatMoney
        }}
      </td>
    </tr>

    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        <template v-if="isTradeable">
          {{ 'user-movements-history.tradeable-lbl' | globalize }}
        </template>
        <template v-else>
          {{ 'user-movements-history.not-tradeable-lbl' | globalize }}
        </template>
      </td>
    </tr>

    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        <template v-if="isPhysicalPriceRestricted">
          {{ 'user-movements-history.restricted-on-ph-price-lbl' | globalize }}
        </template>
        <template v-else>
          <!-- eslint-disable-next-line max-len -->
          {{ 'user-movements-history.not-restricted-on-ph-price-lbl' | globalize }}
        </template>
      </td>
    </tr>

    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        <template v-if="isCurrentPriceRestricted">
          {{ 'user-movements-history.restricted-on-cur-price-lbl' | globalize }}
        </template>
        <template v-else>
          <!-- eslint-disable-next-line max-len -->
          {{ 'user-movements-history.not-restricted-on-cur-price-lbl' | globalize }}
        </template>
      </td>
    </tr>
  </tbody>
</template>

<script>
import { ManageAssetPairOp } from '../../wrappers/operation-details/manage-asset-pair'

export default {
  props: {
    operationDetails: {
      type: ManageAssetPairOp,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../../scss/attributes-viewer';
</style>
