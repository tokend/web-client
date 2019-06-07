<template>
  <div class="sale-details">
    <template v-if="sale">
      <top-bar>
        <template slot="main">
          <!--
            HACK: we don't need any active-class here, so empty "active-class"
            attr prevents adding any active-class
           -->
          <router-link :to="vueRoutes.sales" active-class>
            <span>{{ 'sale-details.investable-sales-tab' | globalize }}</span>
          </router-link>

          <router-link
            v-if="isAccountCorporate"
            :to="vueRoutes.userOwnedSales"
          >
            <span>{{ 'sales.my-sales' | globalize }}</span>
          </router-link>

          <router-link :to="{ ...vueRoutes.saleCampaign, params: { id } }">
            <span>{{ 'sale-details.campaign-tab' | globalize }}</span>
          </router-link>
        </template>
      </top-bar>

      <div class="sale-details__title">
        <h2 class="sale-details__name">
          {{ `${sale.name} (${sale.baseAsset})` }}
        </h2>

        <p class="sale-details__short-desc">
          {{ sale.shortDescription }}
        </p>
      </div>

      <router-view
        :sale="sale"
        @sale-updated="refreshSale"
      />
    </template>

    <template v-else-if="isSaleNotFound">
      <no-data-message
        icon-name="alert-circle"
        :title="'sale-details.sale-not-found-title' | globalize"
        :message="'sale-details.sale-not-found-desc' | globalize"
      />
    </template>

    <template v-else-if="isLoadingFailed">
      <p>
        {{ 'sale-details.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <sale-details-skeleton-loader />
    </template>
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import NoDataMessage from '@/vue/common/NoDataMessage'
import SaleDetailsSkeletonLoader from './SaleDetailsSkeletonLoader'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { api } from '@/api'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@/js/errors'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'sale-details',
  components: {
    TopBar,
    NoDataMessage,
    SaleDetailsSkeletonLoader,
  },

  props: {
    id: { type: String, default: '' },
  },

  data: _ => ({
    sale: null,
    isSaleNotFound: false,
    isLoadingFailed: false,
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),
  },

  async created () {
    await this.loadSale(this.id)
  },

  methods: {
    async loadSale (saleId) {
      try {
        const { data } = await api.get(`/v3/sales/${saleId}`, {
          include: ['base_asset', 'default_quote_asset', 'quote_assets'],
        })
        this.sale = new SaleRecord(data)
      } catch (e) {
        if (e instanceof errors.NotFoundError) {
          this.isSaleNotFound = true
        } else {
          this.isLoadingFailed = true
          ErrorHandler.processWithoutFeedback(e)
        }
      }
    },

    async refreshSale () {
      this.sale = null
      await this.loadSale(this.id)
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';

.sale-details__name {
  font-size: 3rem;
  font-weight: 400;
  color: $col-sale-details-title;
}

.sale-details__short-desc {
  margin-top: 0.4rem;
  font-size: 1.6rem;
  color: $col-sale-details-subtitle;
  word-wrap: break-word;
}
</style>
