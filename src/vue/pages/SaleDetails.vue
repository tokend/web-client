<template>
  <div class="sale-details">
    <template v-if="sale">
      <top-bar>
        <template slot="main">
          <!--
            HACK: we don't need any active-class here, so empty "active-class"
            attr prevents adding any active-class
           -->
          <router-link :to="{ ...vueRoutes.sales }" active-class>
            <span>
              {{ 'sale-details.all-sales-tab' | globalize }}
            </span>
          </router-link>

          <router-link
            :to="{ ...vueRoutes.saleCampaign, params: { id: id } }"
          >
            <span>
              {{ 'sale-details.campaign-tab' | globalize }}
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
          @submitted="hideInvestDrawer() || refreshSale()"
          @canceled="hideInvestDrawer() || refreshSale()"
        />
      </drawer>

      <div class="sale-details__title">
        <h2 class="sale-details__name">
          {{ `${sale.name} (${sale.baseAsset})` }}
        </h2>

        <p class="sale-details__short-desc">
          {{ sale.shortDescription }}
        </p>
      </div>

      <router-view :sale="sale" />
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

import { SaleRecord } from '@/js/records/entities/sale.record'

import { Api } from '@/api'

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
  },

  props: {
    id: { type: String, default: '' },
  },

  data: _ => ({
    sale: null,
    isSaleNotFound: false,
    isLoadingFailed: false,
    isInvestDrawerShown: false,
    vueRoutes,
  }),

  async created () {
    await this.loadSale(this.id)
  },

  methods: {
    async loadSale (saleId) {
      try {
        const { data } = await Api.getWithSignature(`/v3/sales/${saleId}`, {
          include: ['base_asset', 'default_quote_asset'],
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

    hideInvestDrawer () {
      this.isInvestDrawerShown = false
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";

.sale-details__name {
  font-size: 3rem;
  font-weight: normal;
  color: $col-sale-details-title;
}

.sale-details__short-desc {
  margin-top: .4rem;
  font-size: 1.6rem;
  color: $col-sale-details-subtitle;
  word-wrap: break-word;
}
</style>
