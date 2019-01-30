<template>
  <div class="fees" v-if="isLoaded">
    <template v-if="fees">
      <top-bar>
        <template slot="main">
          <!--
            :key is a hack to ensure that the component will be updated
            after computed calculated
          -->
          <select-field
            v-model="filters.asset"
            :values="assetCodes"
            :key="filters.asset"
            class="fees__assets-select app__select app__select--no-border"
          />
        </template>
      </top-bar>
      <div class="fees__table">
        <table class="app__table">
          <thead>
            <tr>
              <th :title="'fee-table.fee-type' | globalize">
                {{ 'fee-table.fee-type' | globalize }}
              </th>
              <th :title="'fee-table.subtype' | globalize">
                {{ 'fee-table.subtype' | globalize }}
              </th>
              <th :title="'fee-table.fixed' | globalize">
                {{ 'fee-table.fixed' | globalize }}
              </th>
              <th :title="'fee-table.percent' | globalize">
                {{ 'fee-table.percent' | globalize }}
              </th>
              <th :title="'fee-table.lower-bound' | globalize">
                {{ 'fee-table.lower-bound' | globalize }}
              </th>
              <th :title="'fee-table.upper-bound' | globalize">
                {{ 'fee-table.upper-bound' | globalize }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(fee, i) in assetFees" :key="i">
              <td :title="fee.feeType | formatFeeType">
                {{ fee.feeType | formatFeeType }}
              </td>
              <!-- eslint-disable max-len -->
              <td :title="{ type: fee.feeType, subtype: fee.subtype } | formatFeeSubType">
                {{ { type: fee.feeType, subtype: fee.subtype } | formatFeeSubType }}
              </td>
              <td :title="{ value: fee.fixed, currency: fee.feeAsset } | formatMoney">
                {{ { value: fee.fixed, currency: fee.feeAsset } | formatMoney }}
              </td>
              <!-- eslint-enable max-len -->
              <td :title="fee.percent | formatPercent">
                {{ fee.percent | formatPercent }}
              </td>
              <td :title="fee.lowerBound | formatMoney">
                {{ fee.lowerBound | formatMoney }}
              </td>
              <td :title="fee.upperBound | formatMoney">
                {{ fee.upperBound | formatMoney }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>
      <no-data-message
        icon-name="trending-up"
        :msg-title="'fee-table.no-fees-title' | globalize"
        :msg-message="'fee-table.no-fees-msg' | globalize"
      />
    </template>
  </div>
  <div v-else-if="!isLoadingFailed">
    <loader :message-id="'fee-table.loading-msg'" />
  </div>
  <div v-else>
    <p>
      {{ 'fee-table.loading-error-msg' | globalize }}
    </p>
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'
import TopBar from '@/vue/common/TopBar'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import { Sdk } from '@/sdk'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'fees',
  components: {
    SelectField,
    Loader,
    TopBar,
    NoDataMessage,
  },
  data: _ => ({
    fees: null,
    isLoaded: false,
    isLoadingFailed: false,
    filters: {
      asset: '',
    },
  }),
  computed: {
    ...mapGetters([
      vuexTypes.wallet,
    ]),
    assetCodes () {
      return this.fees
        ? Object.keys(this.fees).map(asset => asset.toUpperCase())
        : []
    },
    assetFees () {
      return this.fees
        ? this.fees[this.filters.asset.toLowerCase()]
        : []
    },
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
        const { data } = await Sdk.horizon.fees.getAll({
          account_id: this[vuexTypes.wallet].accountId,
        })
        this.fees = data.fees
        this.isLoaded = true
      } catch (error) {
        this.isFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/mixins";

.fees__table {
  overflow-x: auto;
  @include box-shadow();
}
</style>
