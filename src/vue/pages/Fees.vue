<template>
  <div class="fees">
    <template v-if="isLoaded">
      <top-bar>
        <template slot="main">
          <div class="fees__filters">
            <div class="fees__filter">
              <span class="fees__filters-prefix">
                {{ 'fee-page.asset-filter-prefix' | globalize }}
              </span>
              <select-field
                v-model="filters.asset"
                :values="assets"
                key-as-value-text="nameAndCode"
                class="fees__assets-select app__select app__select--no-border"
              />
            </div>

            <div class="fees__filter">
              <span class="fees__filters-prefix">
                {{ 'fee-page.scope-filter-prefix' | globalize }}
              </span>
              <select-field
                :is-value-translatable="true"
                v-model="filters.scope"
                :values="Object.values(FEE_SCOPES)"
                class="app__select app__select--no-border"
              />
            </div>
          </div>
        </template>
      </top-bar>

      <template v-if="valuableAssetFees.length">
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
                v-for="(fee, i) in valuableAssetFees"
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

      <template v-else-if="isFeesLoaded">
        <no-data-message
          icon-name="trending-up"
          title-id="fee-page.no-valuable-fees-title"
          message-id="fee-page.no-valuable-fees-msg"
          :message-id-keys="{ asset: filters.asset.code }"
        />
      </template>

      <template v-else-if="!isLoadingFailed">
        <loader message-id="fee-table.loading-msg" />
      </template>

      <template v-else>
        <p>
          {{ 'fee-table.loading-error-msg' | globalize }}
        </p>
      </template>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader message-id="fee-table.loading-msg" />
    </template>

    <template v-else>
      <p>
        {{ 'fee-table.loading-error-msg' | globalize }}
      </p>
    </template>
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

const FEE_SCOPES = {
  global: 'fee-page.scope-global',
  accountType: 'fee-page.scope-account-type',
  account: 'fee-page.scope-account',
}

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
    isFeesLoaded: false,
    isLoadingFailed: false,
    filters: {
      asset: {},
      scope: FEE_SCOPES.account,
    },
    assets: [],
    FEE_SCOPES,
  }),
  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
      accountId: vuexTypes.accountId,
      accountTypeI: vuexTypes.accountTypeI,
    }),

    valuableAssetFees () {
      const selectedAsset = (this.filters.asset.code || '').toLowerCase()
      return this.fees[selectedAsset]
        ? this.fees[selectedAsset]
          .filter(fee => Number(fee.fixed) || Number(fee.percent))
        : []
    },

    feeRequestOpts () {
      let opts = {}

      switch (this.filters.scope) {
        case FEE_SCOPES.accountType:
          opts.account_type = this.accountTypeI
          break
        case FEE_SCOPES.account:
          opts.account_id = this.accountId
          break
      }

      return opts
    },
  },

  watch: {
    'filters.scope': async function () {
      this.fees = []
      this.isFeesLoaded = false
      this.isLoadingFailed = false
      await this.loadFees()
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
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async initAssetSelector () {
      await this.loadAssets()
      if (this.assets.length) {
        this.filters.asset = this.assets[0]
      }
    },

    async loadAssets () {
      await this.loadBalances()
      this.assets = this.balances
        .map(item => item.assetDetails)
    },

    async loadFees () {
      try {
        const { data: { fees: fees = {} } } =
          await Sdk.horizon.fees.getAll(this.feeRequestOpts)
        this.fees = fees
        this.isFeesLoaded = true
      } catch (e) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
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
  margin: -0.8rem;
}

.fees__filter {
  display: inline-flex;
  align-items: center;
  margin: 0.8rem;
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
