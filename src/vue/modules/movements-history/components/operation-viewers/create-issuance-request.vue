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
      <template v-if="cornType === CORN_TYPE.wheat">
        <tr class="attributes-viewer__table-row">
          <td class="attributes-viewer__table-cell">
            {{ 'movements-history.fusarium' | globalize }}
          </td>
          <td class="attributes-viewer__table-cell">
            {{ operationDetails.creatorDetails.fusarium }}%
          </td>
        </tr>
        <tr class="attributes-viewer__table-row">
          <td class="attributes-viewer__table-cell">
            {{ 'movements-history.contamination' | globalize }}
          </td>
          <td class="attributes-viewer__table-cell">
            {{ operationDetails.creatorDetails.contamination }}
          </td>
        </tr>
        <tr class="attributes-viewer__table-row">
          <td class="attributes-viewer__table-cell">
            {{ 'movements-history.protein' | globalize }}
          </td>
          <td class="attributes-viewer__table-cell">
            {{ operationDetails.creatorDetails.protein }}%
          </td>
        </tr>
        <tr class="attributes-viewer__table-row">
          <td class="attributes-viewer__table-cell">
            {{ 'movements-history.gluten-percent' | globalize }}
          </td>
          <td class="attributes-viewer__table-cell">
            {{ operationDetails.creatorDetails.glutenPercent }}%
          </td>
        </tr>
        <tr class="attributes-viewer__table-row">
          <td class="attributes-viewer__table-cell">
            {{ 'movements-history.gluten-comment' | globalize }}
          </td>
          <td class="attributes-viewer__table-cell">
            {{ operationDetails.creatorDetails.glutenComment }}
          </td>
        </tr>
      </template>
      <template v-if="cornType === CORN_TYPE.barley">
        <tr class="attributes-viewer__table-row">
          <td class="attributes-viewer__table-cell">
            {{ 'movements-history.contamination' | globalize }}
          </td>
          <td class="attributes-viewer__table-cell">
            {{ operationDetails.creatorDetails.contamination }}%
          </td>
        </tr>
      </template>
    </template>
  </tbody>
</template>

<script>
import { CreateIssuanceRequestOp } from '../../wrappers/operation-details/create-issuance-request'

import { CORN_TYPE } from '@/js/const/corn'

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
  data: _ => ({
    CORN_TYPE,
  }),
  computed: {
    ...mapGetters({
      assetByCode: vuexTypes.assetByCode,
    }),
    isGrainCoin () {
      return this.assetByCode(this.assetCode).isGrainCoin
    },
    cornType () {
      return this.assetByCode(this.assetCode).details.cornType
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../scss/attributes-viewer';
</style>
