<template>
  <div
    class="fees"
    v-if="isLoaded"
  >
    <template v-if="fees">
      <top-bar>
        <div
          slot="main"
          class="fees__filters"
        >
          <span class="fees__filters-prefix">
            {{ 'fee-page.filters-prefix' | globalize }}
          </span>
          <select-field
            v-model="filters.asset"
            :values="assets"
            key-as-value-text="nameAndCode"
            class="fees__assets-select app__select app__select--no-border"
          />
        </div>
      </top-bar>
      <div class="app__table app__table--with-shadow">
        <table>
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
            <tr
              v-for="(fee, i) in selectedFees"
              :key="i"
            >
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
        :title-id="'fee-table.no-fees-title'"
        :message-id="'fee-table.no-fees-msg'"
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

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'

export default {
  name: 'fees',
  components: {
    SelectField,
    Loader,
    TopBar,
    NoDataMessage,
  },
  data: _ => ({
    fees: {},
    isLoaded: false,
    isLoadingFailed: false,
    filters: { asset: {} },
    assets: [],
  }),
  computed: {
    ...mapGetters([
      vuexTypes.account,
      vuexTypes.accountId,
    ]),

    selectedFees () {
      const selected = (this.filters.asset.code || '').toLowerCase()
      return this.fees[selected]
    },
  },

  async created () {
    try {
      await this.initAssetSelector()
      await this.loadFees()
      this.isLoaded = true
    } catch (error) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },

  methods: {
    ...mapActions({
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),

    async initAssetSelector () {
      await this.loadAssets()
      if (this.assets.length) {
        this.filters.asset = this.assets[0]
      }
    },

    async loadAssets () {
      await this.loadAccount()
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets
        .map(item => new AssetRecord(item, this.account.balances))
        .filter(item => item.balance.id)
    },

    async loadFees () {
      const { data: { fees: fees = {} } } = await Sdk.horizon.fees.getAll({
        account_id: this.accountId,
      })
      this.fees = fees
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.fees {
  width: 100%;
}

.fees__filters {
  display: inline-flex;
  align-items: center;
}

.fees__filters-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}

.fees__assets {
  margin-bottom: 2.1rem;
}

.fees__assets-select {
  display: inline-block;
  width: auto;
}
</style>
