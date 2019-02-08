<template>
  <div class="funds">
    <top-bar>
      <template slot="main">
        <select-field
          :disabled="!isLoaded"
          v-model="filters.baseAsset"
          :values="fundAssets"
          class="app__select app__select--no-border"
        />

        <select-field
          :disabled="!isLoaded"
          v-model="filters.state"
          :values="FUND_STATES"
          class="app__select app__select--no-border"
        />

        <select-field
          :disabled="!isLoaded"
          v-model="filters.sort"
          :values="FUND_SORT_STATES"
          class="app__select app__select--no-border"
        />
      </template>

      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isCreateFundDrawerShown = true"
        >
          <i class="mdi mdi-plus funds__btn-icon" />
          {{ 'funds.create-fund-title' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isCreateFundDrawerShown">
      <template slot="heading">
        {{ 'funds.create-fund-title' | globalize }}
      </template>
      <create-fund-form @cancel="isCreateFundDrawerShown = false" />
    </drawer>

    <drawer :is-shown.sync="isDetailsDrawerShown">
      <template slot="heading">
        {{ 'funds.short-details-title' | globalize }}
      </template>
      <fund-short-details :fund="selectedFund" />
    </drawer>

    <template v-if="filteredFunds.length">
      <div class="fund-cards">
        <a
          class="fund-card"
          v-for="fund in filteredFunds"
          :key="fund.id"
          @click="selectFund(fund)"
        >
          <div class="fund-card__header">
            <img
              class="fund-card__logo"
              :src="fund.logoUrl(config.FILE_STORAGE)"
            >
          </div>

          <div class="fund-card__info">
            <p class="fund-card__name">
              {{ fund.name }}
            </p>

            <p class="fund-card__desc">
              {{ fund.shortDescription }}
            </p>

            <div class="fund-card__progress-bar">
              <div
                class="fund-card__progress"
                :style="`width: ${getCapProgress(fund)}%`"
              />
            </div>

            <p class="fund-card__funded">
              <!-- eslint-disable max-len -->
              {{ 'funds.fund-card-funded' | globalize({ funded: fund.currentCap / fund.hardCap }) }}
              <!-- eslint-enable max-len -->
            </p>

            <p class="fund-card__invested">
              <!-- eslint-disable max-len -->
              {{ 'funds.fund-card-invested' | globalize({ invested: { value: fund.currentCap, currency: fund.defaultQuoteAsset } }) }}
              <!-- eslint-enable max-len -->
            </p>

            <p class="fund-card__days-to-launch">
              <!-- eslint-disable max-len -->
              {{ 'funds.fund-card-days-to-launch' | globalize({ days: fund.daysToGo }) }}
              <!-- eslint-enable max-len -->
            </p>

            <vue-markdown
              class="fund-card__offer"
              :source="'funds.fund-card-offer' | globalize({
                baseHardCap: {
                  value: fund.baseHardCap,
                  currency: fund.baseAsset
                },
                hardCap: {
                  value: fund.hardCap,
                  currency: fund.defaultQuoteAsset
                }
              })"
              :html="false"
            />
          </div>
        </a>
      </div>
    </template>

    <template v-else-if="isLoaded">
      <no-data-message
        icon-name="inbox"
        :msg-title="'funds.no-funds-title' | globalize"
        :msg-message="'funds.no-funds-desc' | globalize"
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

import SelectField from '@/vue/fields/SelectField'
import CreateFundForm from '@/vue/forms/CreateFundForm'
import FundShortDetails from '@/vue/pages/funds/FundShortDetails'

import VueMarkdown from 'vue-markdown'

import { Sdk } from '@/sdk'

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

const FUND_SORT_STATES = {
  endingSoonest: {
    value: '3',
    label: 'funds.sort-by-ending-soonest',
  },
  popularity: {
    value: '4',
    label: 'funds.sort-by-popularity',
  },
  launchDate: {
    value: '',
    label: 'funds.sort-by-launch-date',
  },
}

const ALL_TOKENS_FILTER = 'funds.all-tokens-filter'

export default {
  name: 'funds',
  components: {
    TopBar,
    Drawer,
    Loader,
    CollectionLoader,
    NoDataMessage,
    SelectField,
    CreateFundForm,
    FundShortDetails,
    VueMarkdown,
  },
  data: _ => ({
    fundRecords: [],
    filters: {
      baseAsset: ALL_TOKENS_FILTER,
      state: FUND_STATES.live.value,
      sort: FUND_SORT_STATES.launchDate.value,
    },
    isLoaded: false,
    isCreateFundDrawerShown: false,
    isDetailsDrawerShown: false,
    selectedFund: null,
    config,
    FUND_STATES,
    FUND_SORT_STATES,
  }),

  computed: {
    fundAssets () {
      return [ALL_TOKENS_FILTER].concat(
        this.fundRecords.map(fund => fund.baseAsset)
          .filter((asset, i, self) => self.indexOf(asset) === i)
      )
    },

    filteredFunds () {
      if (this.filters.baseAsset === ALL_TOKENS_FILTER) {
        return this.fundRecords
      } else {
        return this.fundRecords
          .filter(fund => fund.baseAsset === this.filters.baseAsset)
      }
    },

    recordsLoader () {
      const fundState = this.filters.state
      const sortState = this.filters.sort

      this.initRecordsLoading()

      return function () {
        return Sdk.horizon.sales.getPage({
          open_only: sortState === FUND_STATES.upcoming.value ||
            fundState === FUND_STATES.live,
          upcoming: fundState === FUND_STATES.upcoming.value,
          sort_by: sortState,
        })
      }
    },
  },

  methods: {
    getCapProgress (fund) {
      const capPercentage = (fund.currentCap / fund.hardCap) * 100
      const progress = Math.round(capPercentage * 100) / 100

      return progress >= 100 ? 100 : progress
    },

    initRecordsLoading () {
      this.fundRecords = []
      this.isLoaded = false
    },

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

.fund-cards {
  display: flex;
  flex-wrap: wrap;
  margin: -1rem;
}

.fund-card {
  flex: 0 1 calc(25% - 2rem);
  cursor: pointer;
  border-radius: .4rem;
  box-shadow: 0 .5rem 1rem 0 $col-fund-card-shadow;
  background-color: $col-fund-card-background;
  margin: 1rem;

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

.fund-card__header {
  position: relative;
  border-radius: .4rem .4rem 0rem 0rem;
  height: 16rem;
  width: 100%;
  background-color: $col-fund-card-header-background;

  @include respond-to($x-medium) {
    height: 12rem;
  }
}

.fund-card__logo {
  border-radius: .4rem .4rem 0rem 0rem;
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.fund-card__info {
  padding: 2.2rem 1.5rem;
}

.fund-card__name {
  font-size: 1.8rem;
  font-weight: bold;
  color: $col-fund-card-text-primary;
}

.fund-card__desc {
  margin-top: .5rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-fund-card-text-primary;
}

.fund-card__progress-bar {
  margin-top: 3rem;
  width: 100%;
  height: .3rem;
  background-color: $fund-card-progress-bar-background;

  .fund-card__progress {
    background: $fund-card-progress-bar-value;
    height: 100%;
  }
}

.fund-card__funded {
  margin-top: .9rem;
}

.fund-card__funded, .fund-card__invested, .fund-card__days-to-launch {
  font-size: 1.3rem;
  color: $col-fund-card-text-primary;
  line-height: 1.69;
}

.fund-card__offer {
  margin-top: 2.5rem;
  font-size: 1.4rem;
  color: $col-fund-card-text-primary;

  strong {
    color: $col-fund-card-text-bold;
  }
}

.funds__loader {
  margin-top: 1rem;
}
</style>
