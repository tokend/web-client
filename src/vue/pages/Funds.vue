<template>
  <div class="funds">
    <top-bar>
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

    <div class="fund-cards">
      <a
        class="fund-card"
        v-for="fund in fundRecords"
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
          <div class="fund-card__progress" />
          <p class="fund-card__funded">
            {{ fund.currentCap / fund.hardCap | formatPercent }}
          </p>
          <p class="fund-card__invested">
            <!-- eslint-disable max-len -->
            {{ { value: fund.currentCap, currency: fund.defaultQuoteAsset } | formatMoney }}
            <!-- eslint-enable max-len -->
          </p>
          <p class="fund-card__days-to-launch">
            {{ fund.daysToGo }} days to launch
          </p>
          <p class="fund-card__offer">
            Buy {{ fund.baseHardCap }} for {{ fund.hardCap }}
          </p>
        </div>
      </a>
    </div>
    <collection-loader
      :first-page-loader="getRecords"
      @first-page-load="setRecords"
      @next-page-load="extendRecords"
    />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import CreateFundForm from '@/vue/forms/CreateFundForm'
import CollectionLoader from '@/vue/common/CollectionLoader'
import FundShortDetails from '@/vue/pages/funds/FundShortDetails'

import { Sdk } from '@/sdk'

import { SaleRecord } from '@/js/records/entities/sale.record'

import config from '@/config'

export default {
  name: 'funds',
  components: {
    TopBar,
    Drawer,
    CreateFundForm,
    CollectionLoader,
    FundShortDetails,
  },
  data: _ => ({
    isCreateFundDrawerShown: false,
    fundRecords: [],
    isLoaded: false,
    config,
    selectedFund: null,
    isDetailsDrawerShown: false,
  }),
  methods: {
    async getRecords () {
      const response = await Sdk.horizon.sales.getPage()
      return response
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

<style lang="scss" scoped>
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
  justify-content: flex-start;
  margin: -1rem;
}

.fund-card {
  flex: 0 1 calc(25% - 2rem);
  min-height: 42rem;
  cursor: pointer;
  border-radius: .4rem;
  box-shadow: 0 .5rem 1rem 0 $col-field-shadow;
  background-color: $col-asset-card-background;
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
  background-color: $col-asset-card-header-background;
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
  padding: 1.6rem 2rem;
}

.fund-card__name {
  font-size: 1.8rem;
  font-weight: bold;
  color: $col-asset-card-text-primary;
}

.fund-card__desc {
  margin-top: .2rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-asset-card-text-primary;
}
</style>
