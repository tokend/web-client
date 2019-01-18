<template>
  <div class="fees" v-if="fees">
    <div class="fees__assets">
      <!--
        :key is a hack to ensure that the component will be updated
        after computed calculated
      -->
      <select-field
        v-model="filters.asset"
        :values="assetCodes"
        :key="filters.asset"
        class="fees__assets-select"
      />
    </div>
    <div class="fees__table">
      <table class="app__table">
        <thead>
          <tr>
            <th>
              {{ 'fee-table.fee-type' | globalize }}
            </th>
            <th>
              {{ 'fee-table.subtype' | globalize }}
            </th>
            <th>
              {{ 'fee-table.fixed' | globalize }}
            </th>
            <th>
              {{ 'fee-table.percent' | globalize }}
            </th>
            <th>
              {{ 'fee-table.lower-bound' | globalize }}
            </th>
            <th>
              {{ 'fee-table.upper-bound' | globalize }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fee, i) in assetFees" :key="i">
            <td>
              {{ fee.feeType | formatFeeType }}
            </td>
            <td>
              {{
                { type: fee.feeType, subtype: fee.subtype } | formatFeeSubType
              }}
            </td>
            <td>
              {{
                { value: fee.fixed, currency: fee.feeAsset } | formatMoney
              }}
            </td>
            <td>
              {{ fee.percent | formatPercent }}
            </td>
            <td>
              {{ fee.lowerBound | formatMoney }}
            </td>
            <td>
              {{ fee.upperBound | formatMoney }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else-if="!isFailed">
    <loader
      :message-id="'fee-table.lbl-loading'"
    />
  </div>
  <div v-else>
    <p>
      {{ 'fee-table.lbl-loading-error' | globalize }}
    </p>
  </div>
</template>

<script>
import SelectField from '../fields/SelectField'
import Loader from '../common/Loader'

import { Sdk } from '@/sdk'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'fees',
  components: {
    SelectField,
    Loader
  },
  data: _ => ({
    fees: null,
    isFailed: false,
    filters: {
      asset: ''
    }
  }),
  computed: {
    ...mapGetters([
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
        this.isFailed = true
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.fees {
  width: 100%;
  max-width: 105rem;
}

.fees__assets {
  margin-bottom: 2.1rem;
}

.fees__assets-select {
  display: inline-block;
  width: auto;
}

.fees__table {
  overflow-x: auto;
  box-shadow: 0 0.6rem 1rem 0 $col-table-shadow;
}
</style>
