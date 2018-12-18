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
            {{ fee.fixed | formatMoney({ currency: fee.feeAsset }) }}
          </table-custom-cell>
          <table-custom-cell>
            {{ fee.percent | formatPercent }}
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
  <loader
    v-else
    :message="'fee.lbl_loading' | globalize"
  />
</template>

<script>
import SelectFieldCustom from '../fields/SelectFieldCustom'
import TableCustom from '../common/TableCustom'
import TableCustomRow from '../common/TableCustomRow'
import TableCustomHead from '../common/TableCustomHead'
import TableCustomCell from '../common/TableCustomCell'
import Loader from '../common/Loader'

import { Sdk } from '@/sdk'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'fees',
  components: {
    SelectFieldCustom,
    TableCustom,
    TableCustomRow,
    TableCustomHead,
    TableCustomCell,
    Loader
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
    await this.fetchFees()
    this.currentAssetName = this.assetNames.length > 0
      ? this.assetNames[0] : ''
  },
  methods: {
    async fetchFees () {
      try {
        const response = await Sdk.horizon.fees.getAll({
          account_id: this[vuexTypes.wallet][vuexTypes.accountId]
        })
        this.fees = response._data.fees
      } catch (error) {
        console.error(error)
      }
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
