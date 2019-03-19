<template>
  <div class="all-sales">
    <div class="sales__state-filter">
      <select-field
        :is-value-translatable="true"
        :disabled="!isLoaded"
        v-model="filters.state"
        :values="Object.values(SALE_STATES)"
        key-as-value-text="labelTranslationId"
        class="sales-asset-selector__field app__select app__select--no-border"
      />
    </div>
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
        />
      </div>
    </template>

    <template v-else-if="isLoaded">
      <no-data-message
        icon-name="inbox"
        :title="'sales.no-sales-title' | globalize"
        :message="'sales.no-sales-desc' | globalize"
      />
    </template>

    <template v-else>
      <loader :message-id="'sales.loading-msg'" />
    </template>

    <!--
    v-show is a hack to hide `More` button if there are no sales,
    matching the filtering criteria (when no data message is shown).
  -->
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
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import SalesMixin from '@/vue/mixins/sales.mixin'

export default {
  name: 'all-oprtunities',
  mixins: [SalesMixin],
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),

    filteredSales () {
      return this.saleRecords
        .filter(sale => {
          return sale.owner === this.accountId
        })
    },
  },
}
</script>

<style lang="scss">
</style>
