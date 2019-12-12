<template>
  <div class="sale-campaign-viewer">
    <div class="sale-campaign-viewer__actions-wrp">
      <button
        v-ripple
        class="app__button-raised sale-campaign-viewer__action-btn"
        @click="isOverviewDrawerShown = true"
      >
        {{ 'sale-details.view-details-btn' | globalize }}
      </button>

      <button
        v-ripple
        v-if="sale.owner === accountId"
        class="app__button-raised sale-campaign-viewer__action-btn"
        @click="isStatisticsDrawerShown = true"
      >
        {{ 'sale-details.view-statistics-btn' | globalize }}
      </button>

      <button
        v-ripple
        v-if="sale.owner === accountId && sale.isWhitelisted"
        class="app__button-raised sale-campaign-viewer__action-btn"
        @click="isWhitelistDrawerShown = true"
      >
        {{ 'sale-details.manage-whitelist-btn' | globalize }}
      </button>
    </div>

    <div class="sale-campaign-viewer__content">
      <div class="sale-campaign-viewer__description">
        <sale-logo-viewer :sale="sale" />
        <sale-description-viewer :sale="sale" />
      </div>

      <div class="sale-campaign-viewer__state">
        <sale-state-widget
          :sale="sale"
          @sale-updated="$emit(EVENTS.saleUpdated)"
        />
      </div>

      <drawer :is-shown.sync="isOverviewDrawerShown">
        <template slot="heading">
          {{ 'sale-details.overview-title' | globalize }}
        </template>

        <sale-overview :sale="sale" />
      </drawer>

      <drawer :is-shown.sync="isStatisticsDrawerShown">
        <template slot="heading">
          {{ 'sale-details.statistics-title' | globalize }}
        </template>

        <sale-statistics-viewer :sale="sale" />
      </drawer>

      <drawer :is-shown.sync="isWhitelistDrawerShown">
        <template slot="heading">
          {{ 'sale-details.whitelist-title' | globalize }}
        </template>

        <sale-whitelist-manager :sale="sale" />
      </drawer>
    </div>
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'

import SaleOverview from './SaleOverview'
import SaleStatisticsViewer from './SaleStatisticsViewer'
import SaleWhitelistManager from './SaleWhitelistManager'
import SaleStateWidget from '@/vue/pages/sale-details/SaleStateWidget'

import SaleLogoViewer from './SaleLogoViewer'
import SaleDescriptionViewer from './SaleDescriptionViewer'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  saleUpdated: 'sale-updated',
}

export default {
  name: 'sale-campaign-viewer',
  components: {
    Drawer,
    SaleLogoViewer,
    SaleDescriptionViewer,
    SaleOverview,
    SaleStatisticsViewer,
    SaleWhitelistManager,
    SaleStateWidget,
  },

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    isOverviewDrawerShown: false,
    isStatisticsDrawerShown: false,
    isWhitelistDrawerShown: false,
    EVENTS,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.sale-campaign-viewer {
  margin-top: 2rem;
}

.sale-campaign-viewer__actions-wrp {
  display: flex;
  margin: -1rem -1rem 1.4rem;
}

.sale-campaign-viewer__action-btn {
  margin: 1rem;
}

.sale-campaign-viewer__content {
  display: flex;
  align-items: flex-start;
  margin: -1.6rem;

  @include respond-to($small) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}

.sale-campaign-viewer__description {
  flex-basis: 64%;
  background-color: $col-sale-details-block;
  border-radius: 0.4rem;
  margin: 1.6rem;
  overflow: auto;

  @include respond-to($x-medium) {
    flex-basis: 55%;
  }
}

.sale-campaign-viewer__state {
  flex-basis: 36%;
  background-color: $col-sale-details-block;
  border-radius: 0.4rem;
  margin: 1.6rem;
  padding: 3.3rem 3.4rem 2.2rem 2.4rem;

  @include respond-to($x-medium) {
    flex-basis: 45%;
  }
}
</style>
