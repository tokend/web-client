<template>
  <div class="fee">
    <md-card>
      <md-card-content v-if="overviewFees">
        <div
          class="fee__asset-info"
          v-for="(assetFees, asset) in overviewFees"
          :key="asset"
        >
          <div class="fee__header">
            {{ i18n.fees_your_fees({ asset: asset }) }}
          </div>
          <md-table>
            <md-table-row>
              <md-table-head>
                {{ i18n.fees_fee_type() }}
              </md-table-head>
              <md-table-head>
                {{ i18n.fees_subtype() }}
              </md-table-head>
              <md-table-head>
                {{ i18n.fees_fixed() }}
              </md-table-head>
              <md-table-head>
                {{ i18n.fees_percent() }}
              </md-table-head>
              <md-table-head>
                {{ i18n.fees_lower_bound() }} ({{ asset }})
              </md-table-head>
              <md-table-head>
                {{ i18n.fees_upper_bound() }} ({{ asset }})
              </md-table-head>
            </md-table-row>
            <md-table-row
              v-for="(fee, i) in assetFees"
              :key="i"
            >
              <md-table-cell>
                {{ fee.fee_type | localizeFeeType }}
              </md-table-cell>
              <md-table-cell>
                {{ fee.subtype | localizeFeeSubType }}
              </md-table-cell>
              <md-table-cell>
                {{ i18n.c(fee.fixed) }} {{ fee.fee_asset }}
              </md-table-cell>
              <md-table-cell>
                {{ i18n.c(fee.percent) }}%
              </md-table-cell>
              <md-table-cell>
                {{ i18n.c(fee.lower_bound) }}
              </md-table-cell>
              <md-table-cell>
                {{ i18n.c(fee.upper_bound) }}
              </md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </md-card-content>
      <md-card-content v-else>
        {{ i18n.lbl_loading() }}
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import { i18n } from '../../../../js/i18n/index'
import { feeService } from '../../../../js/services/fees.service'

export default {
  data: _ => ({
    i18n,
    overviewFees: null
  }),
  async created () {
    try {
      this.overviewFees = await feeService.loadAccountFees()
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../scss/variables";

.fee {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 1100px;
}

.fee__asset-info {
  margin-bottom: 2rem;
}

.fee__header {
  padding-left: 1.5rem;
  font-weight: 600;
}
</style>
