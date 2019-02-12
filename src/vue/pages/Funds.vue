<template>
  <div class="funds">
    <top-bar>
      <template slot="main">
        <div class="funds__asset-filter">
          <input-field
            :disabled="!isLoaded"
            v-model="filters.baseAsset"
            :label="'funds.asset-code-label' | globalize"
          />
        </div>

        <div class="funds__state-filter">
          <select-field
            :disabled="!isLoaded"
            v-model="filters.state"
            :values="FUND_STATES"
            class="app__select app__select--no-border"
          />
        </div>
      </template>

      <template
        slot="extra"
        v-if="account.accountTypeI === ACCOUNT_TYPES.syndicate"
      >
        <button
          v-ripple
          class="app__button-raised"
          @click="isCreateFundDrawerShown = true"
        >
          <i class="mdi mdi-plus funds__btn-icon" />
          {{ 'funds.create-fund' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isCreateFundDrawerShown">
      <template slot="heading">
        {{ 'funds.create-fund' | globalize }}
      </template>
      <create-fund-form />
    </drawer>

    <template v-if="filteredFunds.length">
      <div class="funds__fund-cards">
        <drawer :is-shown.sync="isDetailsDrawerShown">
          <template slot="heading">
            {{ 'funds.short-details-title' | globalize }}
          </template>
          <fund-short-details :fund="selectedFund" />
        </drawer>

        <fund-card
          class="funds__fund-card"
          v-for="fund in filteredFunds"
          :key="fund.id"
          :fund="fund"
          @select="selectFund(fund)"
        />
      </div>
    </template>

    <template v-else-if="isLoaded">
      <no-data-message
        icon-name="inbox"
        title-id="funds.no-funds-title"
        message-id="funds.no-funds-desc"
      />
    </template>

    <template v-else>
      <loader :message-id="'funds.loading-msg'" />
    </template>

    <collection-loader
      v-show="filteredFunds.length"
      class="funds__loader"
      :first-page-loader="recordsLoader"
      @first-page-load="setRecords"
      @next-page-load="extendRecords"
    />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import Loader from '@/vue/common/Loader'
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import InputField from '@/vue/fields/InputField'
import SelectField from '@/vue/fields/SelectField'
import CreateFundForm from '@/vue/forms/CreateFundForm'
import FundShortDetails from '@/vue/pages/funds/FundShortDetails'
import FundCard from '@/vue/pages/funds/FundCard'

import { Sdk } from '@/sdk'
import { ACCOUNT_TYPES } from '@tokend/js-sdk'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { SaleRecord } from '@/js/records/entities/sale.record'

import config from '@/config'

const FUND_STATES = {
  live: {
    label: 'funds.fund-live-state',
    value: 'live',
  },
  upcoming: {
    label: 'funds.fund-upcoming-state',
    value: 'upcoming',
  },
  all: {
    label: 'funds.fund-all-state',
    value: 'all',
  },
}

export default {
  name: 'funds',
  components: {
    TopBar,
    Drawer,
    Loader,
    CollectionLoader,
    NoDataMessage,
    SelectField,
    InputField,
    CreateFundForm,
    FundShortDetails,
    FundCard,
  },
  data: _ => ({
    fundRecords: [],
    filters: {
      baseAsset: '',
      state: FUND_STATES.live.value,
    },
    isLoaded: false,
    isCreateFundDrawerShown: false,
    isDetailsDrawerShown: false,
    selectedFund: null,
    config,
    FUND_STATES,
    ACCOUNT_TYPES,
  }),

  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),

    fundAssets () {
      return this.fundRecords
        .map(fund => fund.baseAsset)
        .filter((asset, i, self) => self.indexOf(asset) === i)
    },

    filteredFunds () {
      if (this.filters.baseAsset === '') {
        return this.fundRecords
      } else {
        return this.fundRecords
          .filter(fund => {
            return fund.baseAsset.toLowerCase()
              .includes(this.filters.baseAsset.toLowerCase())
          })
      }
    },

    recordsLoader () {
      const fundState = this.filters.state

      return function () {
        return Sdk.horizon.sales.getPage({
          open_only: fundState === FUND_STATES.upcoming.value ||
            fundState === FUND_STATES.live.value,
          upcoming: fundState === FUND_STATES.upcoming.value,
        })
      }
    },
  },

  watch: {
    'recordsLoader': function () {
      this.fundRecords = []
      this.isLoaded = false
    },
  },

  methods: {
    setRecords (data) {
      this.fundRecords = data.map(fund => new SaleRecord(fund))
      this.isLoaded = true
    },

    extendRecords (data) {
      this.fundRecords = this.fundRecords
        .concat(data.map(fund => new SaleRecord(fund)))
    },

    selectFund (fund) {
      this.selectedFund = fund
      this.isDetailsDrawerShown = true
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.funds__btn-icon {
  display: flex;
  font-size: 1.8rem;
  margin-right: 0.5rem;
}

.funds__asset-filter {
  margin-top: -.6rem;
}

.funds__state-filter {
  margin-top: 1rem;
}

.funds__fund-cards {
  display: flex;
  flex-wrap: wrap;
  margin: -1rem;
}

.funds__fund-card {
  flex: 0 1 calc(25% - 2rem);

  @include respond-to($large) {
    flex: 0 1 calc(33.3% - 2rem);
  }

  @include respond-to($x-medium) {
    flex: 0 1 calc(50% - 2rem);
  }

  @include respond-to($x-small) {
    flex: 0 1 calc(100% - 2rem);
  }
}

.funds__loader {
  margin-top: 1rem;
}
</style>
