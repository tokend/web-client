<template>
  <div class="fee" v-if="fees">
    <select-field-custom
      v-model="currentAssetCode"
      :values="assetCodes"
      :key="currentAssetCode"
    />
    <div class="fee__asset-info">
      <table-custom>
        <table-custom-row>
          <table-custom-head>
            {{ 'fee.fee-type' | globalize }}
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
            {{ 'fee.lower-bound' | globalize }}
          </table-custom-head>
          <table-custom-head>
            {{ 'fee.upper-bound' | globalize }}
          </table-custom-head>
        </table-custom-row>
        <table-custom-row v-for="(fee, i) in assetFees" :key="i">
          <table-custom-cell>
            {{ fee.feeType | globalizeFeeType }}
          </table-custom-cell>
          <table-custom-cell>
            {{ fee.subtype | globalizeFeeSubType }}
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
    :message="'fee.lbl-loading' | globalize"
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
    currentAssetCode: ''
  }),
  computed: {
    ...mapGetters('new-wallet', [
      vuexTypes.wallet
    ]),
    assetCodes () {
      return this.fees !== null
        ? Object.keys(this.fees).map(asset => asset.toUpperCase())
        : []
    },
    assetFees () {
      return this.fees !== null
        ? this.fees[this.currentAssetCode.toLowerCase()]
        : []
    }
  },
  async created () {
    await this.loadFees()
    if (this.assetCodes.length > 0) {
      this.currentAssetCode = this.assetCodes[0]
    }
  },
  methods: {
    async loadFees () {
      try {
        const response = await Sdk.horizon.fees.getAll({
          account_id: this[vuexTypes.wallet].accountId
        })
        this.fees = response.data.fees
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
  max-width: 105 * $point;
}

.fee__asset-info {
  margin: 2.1 * $point 0;
}
</style>
