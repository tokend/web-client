<template>
  <div class="sale-details">
    <top-bar v-if="sale.id">
      <template slot="main">
        <router-link
          v-ripple
          :to="vueRoutes.saleDetails"
        >
          <span>
            {{ 'sale-details.campaign-title' | globalize }}
          </span>
        </router-link>
      </template>

      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised sale-details__invest-btn"
          @click="isInvestDrawerShown = true"
        >
          {{ 'sale-details.invest' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isInvestDrawerShown">
      <template slot="heading">
        {{ 'sale-details.invest' | globalize }}
      </template>

      <invest-form
        :sale="sale"
        @submitted="refreshSale"
        @canceled="refreshSale"
      />
    </drawer>

    <template v-if="isLoaded">
      <template v-if="sale.id">
        <div class="sale-details__title">
          <h2 class="sale-details__name">
            {{ `${sale.name} (${sale.baseAsset})` }}
          </h2>

          <p class="sale-details__short-desc">
            {{ sale.shortDescription }}
          </p>
        </div>

        <sale-campaign
          :sale="sale"
          @update-ask="refreshSale"
        />
      </template>

      <template v-else>
        <no-data-message
          icon-name="alert-circle"
          :title-id="'sale-details.sale-not-found-title'"
          :message-id="'sale-details.sale-not-found-desc'"
        />
      </template>
    </template>

    <template v-else-if="isLoadingFailed">
      <p>
        {{ 'sale-details.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <loader message-id="sale-details.loading-msg" />
    </template>
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'

import InvestForm from '@/vue/forms/InvestForm'
import SaleCampaign from '@/vue/pages/sale-details/SaleCampaign'

import { SaleRecord } from '@/js/records/entities/sale.record'

import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { errors } from '@/js/errors'

import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'sale-details',
  components: {
    TopBar,
    Loader,
    Drawer,
    NoDataMessage,
    InvestForm,
    SaleCampaign,
  },

  data: _ => ({
    sale: {},
    isLoaded: false,
    isLoadingFailed: false,
    isInvestDrawerShown: false,
    vueRoutes,
  }),

  async created () {
    await this.loadSale(this.$route.params.id)
  },

  methods: {
    async loadSale (saleId) {
      try {
        const { data } = await Sdk.horizon.sales.get(saleId)
        this.sale = new SaleRecord(data)
        this.isLoaded = true
      } catch (e) {
        if (e instanceof errors.NotFoundError) {
          this.isLoaded = true
        } else {
          this.isLoadingFailed = true
          ErrorHandler.processWithoutFeedback(e)
        }
      }
    },

    async refreshSale () {
      this.sale = {}
      this.isLoaded = false
      this.isInvestDrawerShown = false

      await this.loadSale(this.$route.params.id)
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";

.sale-details__name {
  font-size: 3.6rem;
  font-weight: normal;
  color: $col-sale-details-title;
}

.sale-details__short-desc {
  margin-top: .4rem;
  font-size: 1.6rem;
  color: $col-sale-details-subtitle;
}
</style>
