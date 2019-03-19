<template>
  <div class="loyalty-points-page">
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.loyaltyPointsInvoices">
          <span>
            {{ 'create-invoice-module.invoices-page' | globalize }}
          </span>
        </router-link>

        <router-link :to="vueRoutes.loyaltyPointsStatistics">
          <span>
            {{ 'create-invoice-module.statistics-page' | globalize }}
          </span>
        </router-link>
      </template>
      <div
        class="movements__actions"
        slot="extra"
      >
        <button
          v-ripple
          class="app__button-raised movements__button-raised"
          @click="isInvoiceRequestFormShown = true"
        >
          {{ 'create-invoice-module.create-invoice-btn' | globalize }}
        </button>
      </div>
    </top-bar>
    <router-view />

    <drawer :is-shown.sync="isInvoiceRequestFormShown">
      <template slot="heading">
        {{ 'create-invoice-module.create-invoice-form-title' | globalize }}
      </template>
      <create-invoice-form
        :config="config"
        :wallet="wallet"
        @close="isInvoiceRequestFormShown = false"
      />
    </drawer>
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'

import CreateInvoiceForm from '@modules/loyalty-points/create-invoice-form'

import { vueRoutes } from '@/vue-router/routes'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'

import config from '@/config'

export default {
  name: 'loyaly-points-page',
  components: {
    CreateInvoiceForm,
    TopBar,
    Drawer,
  },
  data: _ => ({
    vueRoutes,
    isInvoiceRequestFormShown: false,
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
  }),
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>

<style lang="scss">
</style>
