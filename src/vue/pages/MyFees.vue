<template>
  <div class="fee" v-if="fees">
    <select-field-custom
      v-model="currentAssetName"
      :values="assetNames"
      :key="currentAssetName"
    />
    <div class="fee__asset-info">
      <table-custom>
        <table-custom-row>
          <table-custom-head>
            {{ 'fee.fee_type' | globalize }}
          </table-custom-head>
          <table-custom-head>
            {{ 'fee.subtype' | globalize }}
          </table-custom-head>
          <table-custom-head>
            {{ 'fee.fixed' | globalize }}
          </table-custom-head>
          <table-custom-head>
            {{ 'fee.percent' | globalize }}
          </table-custom-head>
          <table-custom-head>
            {{ 'fee.lower_bound' | globalize }}
          </table-custom-head>
          <table-custom-head>
            {{ 'fee.upper_bound' | globalize }}
          </table-custom-head>
        </table-custom-row>
        <table-custom-row v-for="(fee, i) in assetFees" :key="i">
          <table-custom-cell>
            {{ fee.feeType | localizeFeeType }}
          </table-custom-cell>
          <table-custom-cell>
            {{ fee.subtype | localizeFeeSubType }}
          </table-custom-cell>
          <table-custom-cell>
            {{ fee.fixed | formatMoney }} {{ fee.feeAsset }}
          </table-custom-cell>
          <table-custom-cell>
            {{ fee.percent | formatMoney }}%
          </table-custom-cell>
          <table-custom-cell>
            {{ fee.lowerBound | formatMoney }}
          </table-custom-cell>
          <table-custom-cell>
            {{ fee.upperBound | formatMoney }}
          </table-custom-cell>
        </table-custom-row>
      </table-custom>
    </div>
  </div>
  <div v-else>
    <p>{{ 'fee.lbl_loading' | globalize }}</p>
  </div>
</template>

<script>
import SelectFieldCustom from '../fields/SelectFieldCustom'
import TableCustom from '../common/TableCustom'
import TableCustomRow from '../common/TableCustomRow'
import TableCustomHead from '../common/TableCustomHead'
import TableCustomCell from '../common/TableCustomCell'

import { Sdk } from '@/sdk'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'my-fees',
  components: {
    SelectFieldCustom,
    TableCustom,
    TableCustomRow,
    TableCustomHead,
    TableCustomCell
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
@import "@/scss/variables";

.fee {
  width: 100%;
  max-width: 110 * $point;
}

.fee__asset-info {
  margin: 2.1 * $point 0;
}
</style>
