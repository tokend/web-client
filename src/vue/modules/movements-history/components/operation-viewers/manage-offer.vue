<template>
  <tbody>
    <tr
      class="attributes-viewer__table-row"
      v-if="operationDetails.offerId">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.offer-id-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ operationDetails.offerId }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.offer-direction-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        <template v-if="operationDetails.isBuy">
          {{
            'movements-history.offer-buy-asset-msg' | globalize({
              asset: operationDetails.baseAssetCode,
            })
          }}
        </template>
        <template v-else>
          {{
            'movements-history.offer-sell-asset-msg' | globalize({
              asset: operationDetails.baseAssetCode,
            })
          }}
        </template>
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.order-book-id-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        <template v-if="operationDetails.isSecondaryMarket">
          {{ 'movements-history.secondary-market-msg' | globalize }}
        </template>
        <template v-else>
          {{ operationDetails.orderBookId }}
        </template>
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.base-amount-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ formatMoney(baseAmount) }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.quote-amount-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ formatMoney(quoteAmount) }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.price-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ formatMoney(price) }}
      </td>
    </tr>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.offer-state-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        <template v-if="operationDetails.isDeleted">
          {{ 'movements-history.offer-deleted-msg' | globalize }}
        </template>
        <template v-else>
          {{ 'movements-history.offer-still-placed-msg' | globalize }}
        </template>
      </td>
    </tr>
  </tbody>
</template>

<script>
import { ManageOfferOp } from '../../wrappers/operation-details/manage-offer'
import { formatMoney } from '@/js/helpers/money-helper'

export default {
  props: {
    operationDetails: {
      type: ManageOfferOp,
      required: true,
    },
  },
  computed: {
    quoteAmount () {
      return {
        currency: this.operationDetails.quoteAssetCode,
        value: this.operationDetails.quoteAmount,
      }
    },
    baseAmount () {
      return {
        currency: this.operationDetails.baseAssetCode,
        value: this.operationDetails.baseAmount,
      }
    },
    price () {
      return {
        currency: this.operationDetails.quoteAssetCode,
        value: this.operationDetails.price,
      }
    },
  },
  setup () {
    return {
      formatMoney,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/attributes-viewer';
</style>
