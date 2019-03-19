<template>
  <div class="loyalty-points-module">
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.loyaltyPointsInvoices">
          <span>
            {{
              'create-invoice-module.invoices-page' | globalize
            }}
          </span>
        </router-link>
        <router-link :to="vueRoutes.statistics">
          <span>
            {{
              'create-invoice-module.statistics-page' | globalize
            }}
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
import { mapActions, mapMutations } from 'vuex'
import { types } from './store/types'
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import { vueRoutes } from '@/vue-router/routes'

import CreateInvoiceForm from '@modules/create-invoice-form'

import { initApi } from './_api'
import { Wallet } from '@tokend/js-sdk'

export default {
  name: 'loyalty-points-module',
  components: {
    CreateInvoiceForm,
    TopBar,
    Drawer,
  },
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    isInitialized: false,
    vueRoutes,
    isInvoiceRequestFormShown: false,
  }),
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
    this.isInitialized = true
  },
  methods: {
    ...mapMutations('loyalty-points', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('loyalty-points', {
      loadBalances: types.LOAD_BALANCES,
    }),
  },
}
</script>

<style lang="scss" scoped>

</style>
