<template>
  <tbody>
    <tr class="attributes-viewer__table-row">
      <td class="attributes-viewer__table-cell">
        {{ 'movements-history.reference-lbl' | globalize }}
      </td>
      <td class="attributes-viewer__table-cell">
        {{ operationDetails.reference }}
      </td>
    </tr>
    <template v-if="isGrainCoin">
      <tr class="attributes-viewer__table-row">
        <td class="attributes-viewer__table-cell">
          {{ 'movements-history.actual-weight-lbl' | globalize }}
        </td>
        <td class="attributes-viewer__table-cell">
          {{ operationDetails.creatorDetails.physicalWeight }}
        </td>
      </tr>
      <tr class="attributes-viewer__table-row">
        <td class="attributes-viewer__table-cell">
          {{ 'movements-history.garbage' | globalize }}
        </td>
        <td class="attributes-viewer__table-cell">
          {{ operationDetails.creatorDetails.garbage }}%
        </td>
      </tr>
      <tr class="attributes-viewer__table-row">
        <td class="attributes-viewer__table-cell">
          {{ 'movements-history.humidity' | globalize }}
        </td>
        <td class="attributes-viewer__table-cell">
          {{ operationDetails.creatorDetails.humidity }}%
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script>
import { CreateIssuanceRequestOp } from '../../wrappers/operation-details/create-issuance-request'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  props: {
    operationDetails: {
      type: CreateIssuanceRequestOp,
      required: true,
    },
    assetCode: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      assetByCode: vuexTypes.assetByCode,
    }),
    isGrainCoin () {
      return this.assetByCode(this.assetCode).isGrainCoin
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/attributes-viewer';
</style>
