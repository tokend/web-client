<template>
  <div class="sale-details">
    <div class="sale-details__title">
      <h2 class="sale-details__name">
        Linde industry facility investment project - Linde Coins
      </h2>
    </div>

    <router-view
      :sale="sale"
      @sale-updated="refreshSale"
    />
  </div>
</template>

<script>
import { SaleRecord } from '@/js/records/entities/sale.record'

import { api } from '@/api'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@/js/errors'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'sale-details',

  props: {
    id: { type: String, default: '' },
  },

  data: _ => ({
    sale: new SaleRecord(),
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
    // await this.loadSale(this.id)
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
