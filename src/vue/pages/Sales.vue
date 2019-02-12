<template>
  <div class="sales">
    <top-bar>
      <template slot="main">
        <div class="sales__asset-filter">
          <input-field
            :disabled="!isLoaded"
            v-model="filters.baseAsset"
            :label="'sales.asset-code-label' | globalize"
          />
        </div>

        <div class="sales__state-filter">
          <select-field
            :disabled="!isLoaded"
            v-model="filters.state"
            :values="SALE_STATES"
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
          @click="isCreateSaleDrawerShown = true"
        >
          <i class="mdi mdi-plus sales__btn-icon" />
          {{ 'sales.create-sale' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isCreateSaleDrawerShown">
      <template slot="heading">
        {{ 'sales.create-sale' | globalize }}
      </template>
      <create-sale-form />
    </drawer>

    <template v-if="filteredSales.length">
      <div class="sales__sale-cards">
        <drawer :is-shown.sync="isDetailsDrawerShown">
          <template slot="heading">
            {{ 'sales.overview-title' | globalize }}
          </template>
          <sale-overview :sale="selectedSale" />
        </drawer>

        <sale-card
          class="sales__sale-card"
          v-for="sale in filteredSales"
          :key="sale.id"
          :sale="sale"
          @select="selectSale(sale)"
        />
      </div>
    </template>

    <template v-else-if="isLoaded">
      <no-data-message
        icon-name="inbox"
        title-id="sales.no-sales-title"
        message-id="sales.no-sales-desc"
      />
    </template>

    <template v-else>
      <loader :message-id="'sales.loading-msg'" />
    </template>

    <collection-loader
      v-show="filteredSales.length"
      class="sales__loader"
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
import CreateSaleForm from '@/vue/forms/CreateSaleForm'
import SaleOverview from '@/vue/pages/sales/SaleOverview'
import SaleCard from '@/vue/pages/sales/SaleCard'

import { Sdk } from '@/sdk'
import { ACCOUNT_TYPES } from '@tokend/js-sdk'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { SaleRecord } from '@/js/records/entities/sale.record'

import config from '@/config'

const SALE_STATES = {
  live: {
    label: 'sales.sale-live-state',
    value: 'live',
  },
  upcoming: {
    label: 'sales.sale-upcoming-state',
    value: 'upcoming',
  },
  all: {
    label: 'sales.sale-all-state',
    value: 'all',
  },
}

export default {
  name: 'sales',
  components: {
    TopBar,
    Drawer,
    Loader,
    CollectionLoader,
    NoDataMessage,
    SelectField,
    InputField,
    CreateSaleForm,
    SaleOverview,
    SaleCard,
  },
  data: _ => ({
    saleRecords: [],
    filters: {
      baseAsset: '',
      state: SALE_STATES.live.value,
    },
    isLoaded: false,
    isCreateSaleDrawerShown: false,
    isDetailsDrawerShown: false,
    selectedSale: null,
    config,
    SALE_STATES,
    ACCOUNT_TYPES,
  }),

  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),

    saleAssets () {
      return this.saleRecords
        .map(sale => sale.baseAsset)
        .filter((asset, i, self) => self.indexOf(asset) === i)
    },

    filteredSales () {
      if (this.filters.baseAsset === '') {
        return this.saleRecords
      } else {
        return this.saleRecords
          .filter(sale => {
            return sale.baseAsset.toLowerCase()
              .includes(this.filters.baseAsset.toLowerCase())
          })
      }
    },

    recordsLoader () {
      const saleState = this.filters.state

      return function () {
        return Sdk.horizon.sales.getPage({
          open_only: saleState === SALE_STATES.upcoming.value ||
            saleState === SALE_STATES.live.value,
          upcoming: saleState === SALE_STATES.upcoming.value,
        })
      }
    },
  },

  watch: {
    'recordsLoader': function () {
      this.saleRecords = []
      this.isLoaded = false
    },
  },

  methods: {
    setRecords (data) {
      this.saleRecords = data.map(sale => new SaleRecord(sale))
      this.isLoaded = true
    },

    extendRecords (data) {
      this.saleRecords = this.saleRecords
        .concat(data.map(sale => new SaleRecord(sale)))
    },

    selectSale (sale) {
      this.selectedSale = sale
      this.isDetailsDrawerShown = true
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.sales__btn-icon {
  display: flex;
  font-size: 1.8rem;
  margin-right: 0.5rem;
}

.sales__asset-filter {
  margin-top: -.6rem;
}

.sales__state-filter {
  margin-top: 1rem;
}

.sales__sale-cards {
  display: flex;
  flex-wrap: wrap;
  margin: -1rem;
}

.sales__sale-card {
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

.sales__loader {
  margin-top: 1rem;
}
</style>
