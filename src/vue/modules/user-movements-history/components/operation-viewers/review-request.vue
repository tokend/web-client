<template>
  <tbody>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'user-movements-history.request-state-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        <template
          v-if="
            operationDetails.isReject ||
              operationDetails.isPermanentReject
          "
        >
          {{ 'user-movements-history.request-rejected-msg' | globalize }}
        </template>
        <template
          v-else-if="
            operationDetails.isFulfilled &&
              operationDetails.isApproved
          "
        >
          {{ 'user-movements-history.request-approved-msg' | globalize }}
        </template>
        <template v-else>
          {{ 'user-movements-history.request-reviewed-msg' | globalize }}
        </template>
      </td>
    </tr>
    <tr
      v-if="operationDetails.isReject || operationDetails.isPermanentReject"
      class="attributes-viewer__table-row"
    >
      <td class="attributes-viewer__table-cell">
        {{ 'user-movements-history.reason-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ operationDetails.reason }}
      </td>
    </tr>
  </tbody>
</template>

<script>
import { ReviewRequestOp } from '../../wrappers/operation-details/review-request'

export default {
  props: {
    operationDetails: {
      type: ReviewRequestOp,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '../../scss/attributes-viewer';
</style>
