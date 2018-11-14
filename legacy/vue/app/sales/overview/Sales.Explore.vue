<template>
  <div class="explore-sales">
    <searcher
      class="sales-overview__searcher"
      @search-input="loadFilteredSales"
    />
    <template v-if="sales.records.length > 0">
      <div class="sales-overview__sale-overview-inner">
        <div
          class="sales-overview__card-wrapper-outer"
          v-for="sale in sales.records"
          :key="sale.id">
          <router-link
            :to="{name: 'sales.sale-details', params: { id: sale.id }}"
            tag="button"
            class="sales-overview__card-wrapper">
            <sale-card
              class="sales-overview__card"
              :sale="sale" />
          </router-link>
        </div>
      </div>
      <template v-if="sales.nextPageCaller">
        <button
          class="sales-overview__btn"
          :disabled="isPending"
          @click="loadNextPage">
          {{ i18n.lbl_more() }}
        </button>
      </template>
    </template>
    <template v-if="sales.records.length === 0 && isLoaded">
      <div class="sales-overview__no-sales-found-msg">
        <div class="icon">
          <i class="mdi mdi-inbox" />
        </div>

        <h2>No sales found</h2>

        <p>Unfortunately, there are no sales matching your criteria.</p>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../vuex/types'
import { i18n } from '../../../../js/i18n/index'
import SaleCard from '../sale_card/Sales.SaleCard'
import Searcher from './Sales.Searcher'
import FormMixin from '../../../common/mixins/form.mixin'
import { saleSortTypes, saleStates } from '../../../../js/const/const'

import { salesService } from '../../../../js/services/sales.service'

import config from '../../../../../src/config'

const initialState = saleStates.actual
const initialSort = saleSortTypes.created

export default {
  name: 'sales-explore',
  components: { SaleCard, Searcher },
  mixins: [FormMixin],
  data: _ => ({
    isLoaded: false,
    isPending: false,
    filters: {
      openOnly: initialState.openOnly,
      upcoming: initialState.upcoming,
      sortBy: initialSort.num,
      order: initialSort.order,
      baseAsset: ''
    },
    i18n,
    sales: {
      records: [],
      nextPageCaller: null
    }
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountKeypair
    ])
  },
  async created () {
    await this.loadFilteredSales()
    this.isLoaded = true
  },
  methods: {
    async loadSales () {
      const response = await salesService.loadSales(this.filters)
      this.parseResponse(response)
    },
    async loadFilteredSales (filters) {
      this.isPending = false
      if (filters) {
        this.filters.openOnly = filters.state.openOnly
        this.filters.upcoming = filters.state.upcoming
        this.filters.sortBy = filters.sortBy.num
        this.filters.order = filters.sortBy.order
        this.filters.baseAsset = filters.token
        this.filters.name = filters.name
      }
      await this.loadSales(this.filters)
      this.isPending = false
    },
    async loadNextPage () {
      this.isPending = true
      const response = await this.sales.nextPageCaller(this.accountKeypair)
      this.parseResponse(response)
      this.isPending = false
    },
    parseResponse (response) {
      this.sales.records = this.sales.records.concat(response.records)
      this.sales.nextPageCaller =
        response.records.length === config.TRANSACTIONS_PER_PAGE
          ? response.next
          : null
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../../scss/variables';
  @import '../../../../scss/mixins';

  .explore-sales {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: auto;
    width: 100%;
  }

  .sales-overview__sale-overview-inner {
    margin: 0 auto;
    margin: -1.2 * $point;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .sales-overview__card-wrapper-outer {
    padding: 1.2 * $point;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    flex: 0.333;
    min-width: 33.333%;
    max-width: 33.333%;

    @include respond-to(xmedium) {
      flex: 0.5;
      min-width: 49.999%;
      max-width: 50%;
    }

    @media only screen and (max-width: 767px) {
      flex: 1;
      min-width: 100%;
    }
  }

  .sales-overview__card-wrapper {
    display: block;
    background: $col-block-bg;
    box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, 0.08);
    border: none;
    flex: 1;
    cursor: pointer;
    font-size: initial;
    text-align: initial;
    width: 100%;
  }

  .sales-overview__btn {
    color: $col-text-accented;
    padding: 1 * $point 2 * $point;
    font-size: 1.4 * $point;
    margin: 2 * $point 0 3 * $point;
    cursor: pointer;
    background: none;
    border: none;

    &:disabled {
      opacity: .75;
    }
  }

  .sales-overview__no-sales-found-msg {
    padding: 10px 40px;
    text-align: center;
    margin: 0 auto;

    .icon {
      margin-bottom: 20px;

      i {
        font-size: $size-icon-super-big;
        line-height: 1;
      }
    }
  }
</style>
