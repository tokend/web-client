<template>
  <div class="sales-owned">
    <template v-if="salesOwned.length">
      <div
        class="md-layout
               md-gutter
               md-layout-item
               md-size-90
               md-alignment-center-space-around
               sales-owned__sale-overview-inner">
        <router-link
          v-for="sale in salesOwned"
          :key="sale.id"
          :to="{name: 'sales.sale-details', params: { id: sale.id }}"
          tag="div"
        >
          <md-card>
            <sale-card
              class="sales-owned__card"
              :sale="sale"
            />
          </md-card>
        </router-link>
      </div>
    </template>

    <template v-else>
      <div class="md-layout md-alignment-center-center">
        <div
          class="md-layout-item
                 md-size-50
                 md-medium-size-65
                 md-small-size-95
                 md-xsmall-size-100">
          <not-available-card
            icon="trending_up"
            :title="i18n.sale_nothing_found()"
            :descr="i18n.sale_no_created_sales()"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '../../../vuex/types'
import { i18n } from '../../../js/i18n/index'

import NotAvailableCard from '../common/NotAvailableCard'
import SaleCard from '../sales/sale_card/Sales.SaleCard'

export default {
  name: 'my-sales-index',
  components: {
    SaleCard,
    NotAvailableCard
  },
  data: _ => ({
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.salesOwned
    ])
  },
  created () {
    this.loadSales()
  },
  methods: {
    ...mapActions({
      loadSales: vuexTypes.GET_SALES
    })
  }
}
</script>

<style lang="scss" scoped>
.sales-owned__sale-overview-inner {
  margin: 0 auto;

  @media (max-width: 767px) {
    justify-content: center;
  }
}

.sales-owned__card {
  cursor: pointer;
}
</style>
