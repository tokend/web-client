<template>
  <div class="fee">
    <select-field-custom
      v-if="fees"
      v-model="currentAssetName"
      :values="assetNames"
      :key="currentAssetName"
    />
    <md-card>
      <md-card-content v-if="fees">
        <div class="fee__asset-info">
          <md-table>
            <md-table-row>
              <md-table-head>
                {{ 'fee.fees_fee_type' | globalize }}
              </md-table-head>
              <md-table-head>
                {{ 'fee.fees_subtype' | globalize }}
              </md-table-head>
              <md-table-head>
                {{ 'fee.fees_fixed' | globalize }}
              </md-table-head>
              <md-table-head>
                {{ 'fee.fees_percent' | globalize }}
              </md-table-head>
              <md-table-head>
                {{ 'fee.fees_lower_bound' | globalize }}
              </md-table-head>
              <md-table-head>
                {{ 'fee.fees_upper_bound' | globalize }}
              </md-table-head>
            </md-table-row>
            <md-table-row
              v-for="(fee, i) in assetFees"
              :key="i"
            >
              <md-table-cell>
                {{ fee.feeType | localizeFeeType }}
              </md-table-cell>
              <md-table-cell>
                {{ fee.subtype | localizeFeeSubType }}
              </md-table-cell>
              <md-table-cell>
                {{ fee.fixed | formatMoney }} {{ fee.fee_asset }}
              </md-table-cell>
              <md-table-cell>
                {{ fee.percent | formatMoney }}%
              </md-table-cell>
              <md-table-cell>
                {{ fee.lowerBound | formatMoney }}
              </md-table-cell>
              <md-table-cell>
                {{ fee.upperBound | formatMoney }}
              </md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </md-card-content>
      <md-card-content v-else>
        {{ 'fee.lbl_loading' | globalize }}
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import SelectFieldCustom from '../fields/SelectFieldCustom'

import { Sdk } from '@/sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  components: {
    SelectFieldCustom
  },
  data: _ => ({
    fees: null,
    currentAssetName: ''
  }),
  computed: {
    ...mapGetters('new-wallet', [
      vuexTypes.wallet
    ]),
    assetNames () {
      return Object.keys(this.fees)
    },
    assetFees () {
      return this.fees[this.currentAssetName]
    }
  },
  async created () {
    try {
      this.fees = (await Sdk.horizon.fees.getAll({
        account_id: this.wallet.account_id
      }))._data.fees
      this.currentAssetName = this.assetNames[0]
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "L@/scss/variables";

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
