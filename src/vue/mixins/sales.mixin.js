import config from '@/config'

import Drawer from '@/vue/common/Drawer'
import Loader from '@/vue/common/Loader'
import CollectionLoader from '@/vue/common/CollectionLoader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import SelectField from '@/vue/fields/SelectField'

import SaleOverview from '@/vue/pages/sales/SaleOverview'
import SaleCard from '@/vue/pages/sales/SaleCard'

import { Sdk } from '@/sdk'
import { vueRoutes } from '@/vue-router/routes'

import { SaleRecord } from '@/js/records/entities/sale.record'

const SALE_STATES = {
  live: {
    labelTranslationId: 'sales.sale-live-state',
    value: 'live',
  },
  upcoming: {
    labelTranslationId: 'sales.sale-upcoming-state',
    value: 'upcoming',
  },
  all: {
    labelTranslationId: 'sales.sale-all-state',
    value: 'all',
  },
}

export default {
  name: 'all-oprtunities',
  components: {
    Drawer,
    Loader,
    CollectionLoader,
    NoDataMessage,
    SaleOverview,
    SaleCard,
    SelectField,
  },

  data: _ => ({
    saleRecords: [],
    filters: {
      baseAsset: '',
      state: SALE_STATES.live,
    },
    isLoaded: false,
    isDetailsDrawerShown: false,
    selectedSale: null,
    SALE_STATES,
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
    vueRoutes,
  }),

  computed: {
    // A workaround for filtering sales by base asset, since sales.getPage
    // method loads all the existing sales.
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
      const saleState = this.filters.state.value
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
  },
}
