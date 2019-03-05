<template>
  <tbody>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.reason-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ operationDetails.reason }}
      </td>
    </tr>
  </tbody>
</template>

<script>
import { CheckSaleStateOp } from '../../wrappers/operation-details/check-sale-state'

export default {
  props: {
    operationDetails: {
      type: CheckSaleStateOp,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/attributes-viewer';
</style>
