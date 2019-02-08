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

    <template v-if="fundRecords.length">
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
      v-show="fundRecords.length"
      :first-page-loader="getRecords"
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

import VueMarkdown from 'vue-markdown'

import CreateFundForm from '@/vue/forms/CreateFundForm'
import FundShortDetails from '@/vue/pages/funds/FundShortDetails'

import { Sdk } from '@/sdk'

import { SaleRecord } from '@/js/records/entities/sale.record'

import config from '@/config'

export default {
  name: 'funds',
  components: {
    TopBar,
    Drawer,
    Loader,
    CollectionLoader,
    NoDataMessage,
    VueMarkdown,
    CreateFundForm,
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
    getCapProgress (fund) {
      const capPercentage = (fund.currentCap / fund.hardCap) * 100
      const progress = Math.round(capPercentage * 100) / 100

      return progress >= 100 ? 100 : progress
    },
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
</style>
