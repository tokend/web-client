<template>
  <div class="fee" v-if="fees">
    <!--
      :key is a hack to ensure that the component will be updated
      after computed calculated
      -->
    <select-field-custom
      v-model="filters.asset"
      :values="assetCodes"
      :key="filters.asset"
    />
    <div class="fee__asset-info">
      <table-custom>
        <table-custom-row slot="header">
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
            {{ fee.feeType | formatFeeType }}
          </table-custom-cell>
          <table-custom-cell>
            <!-- eslint-disable-next-line -->
            {{ { type: fee.feeType, subtype: fee.subtype } | formatFeeSubType }}
          </table-custom-cell>
          <table-custom-cell>
            {{ { value: fee.fixed, currency: fee.feeAsset } | formatMoney }}
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
  <div v-else>
    <loader
      v-if="!loadingError"
      :message="'fee.lbl-loading' | globalize"
    />
    <p v-else>
      {{ 'fee.lbl-loading-error' | globalize }}
    </p>
  </div>
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
    loadingError: false,
    filters: {
      asset: ''
    }
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
        ? this.fees[this.filters.asset.toLowerCase()]
        : []
    }
  },
  async created () {
    await this.loadFees()
    if (this.assetCodes.length > 0) {
      this.filters.asset = this.assetCodes[0]
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
        this.loadingError = true
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
