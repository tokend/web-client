<template>
  <div class="fee" v-if="fees">
    <select-field-custom
      v-model="currentAssetName"
      :values="assetNames"
      :key="currentAssetName"
    />
    <div class="fee__asset-info">
      <md-table>
        <md-table-row>
          <md-table-head>
            {{ 'fee.fee_type' | globalize }}
          </md-table-head>
          <md-table-head>
            {{ 'fee.subtype' | globalize }}
          </md-table-head>
          <md-table-head>
            {{ 'fee.fixed' | globalize }}
          </md-table-head>
          <md-table-head>
            {{ 'fee.percent' | globalize }}
          </md-table-head>
          <md-table-head>
            {{ 'fee.lower_bound' | globalize }}
          </md-table-head>
          <md-table-head>
            {{ 'fee.upper_bound' | globalize }}
          </md-table-head>
        </md-table-row>
        <md-table-row v-for="(fee, i) in assetFees" :key="i">
          <md-table-cell>
            {{ fee.feeType | localizeFeeType }}
          </md-table-cell>
          <md-table-cell>
            {{ fee.subtype | localizeFeeSubType }}
          </md-table-cell>
          <md-table-cell>
            {{ fee.fixed | formatMoney }} {{ fee.feeAsset }}
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
  </div>
  <div v-else>
    <p>{{ 'fee.lbl_loading' | globalize }}</p>
  </div>
</template>

<script>
import SelectFieldCustom from '../fields/SelectFieldCustom'

import { Sdk } from '@/sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'my-fees',
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
      return Object.keys(this.fees).map(asset => asset.toUpperCase())
    },
    assetFees () {
      return this.fees[this.currentAssetName.toLowerCase()]
    }
  },
  async created () {
    try {
      this.fees = (await Sdk.horizon.fees.getAll({
        account_id: this.wallet.account_id
      }))._data.fees
      this.currentAssetName = this.assetNames[0].toUpperCase()
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "L@/scss/variables";

.fee {
  width: 100%;
  max-width: 1100px;
}

.fee__asset-info {
  margin-top: 1.5rem;
  margin-bottom: 2rem;
}

.fee__header {
  padding-left: 1.5rem;
  font-weight: 600;
}
</style>
