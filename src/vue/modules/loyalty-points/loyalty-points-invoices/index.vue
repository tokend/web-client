<template>
  <div class="loyalty-points-invoices-module">
    <div class="loyalty-points-invoices-module__cards">
      <div
        class="loyalty-points-invoices-module__card"
        v-for="item in PETS"
        :key="`pet-${item.name}`"
        @click="openInvoiceForm(item)"
      >
        <div class="loyalty-points-invoices-module__card-img-wrp">
          <img
            class="loyalty-points-invoices-module__card-img"
            v-if="item.logo.url"
            :src="item.logo.url"
          >
        </div>
        <div class="loyalty-points-invoices-module__card-body">
          <p class="loyalty-points-invoices-module__card-name">
            {{ item.name }}
          </p>
          <p class="loyalty-points-invoices-module__card-price">
            {{ item.price }} {{ defaultAssetCode }}
          </p>
        </div>
      </div>
    </div>
    <div class="loyalty-points-invoices-module__history">
      <h2 class="loyalty-points-invoices-module__history-title">
        {{ 'loyalty-points-invoices.history-title' | globalize }}
      </h2>
      <movements-history-module
        v-if="defaultAssetCode"
        :asset-code="defaultAssetCode"
        :wallet="wallet"
        :config="config"
      />
    </div>
    <drawer :is-shown.sync="isInvoiceRequestFormShown">
      <template slot="heading">
        {{ 'loyalty-points.create-invoice-form-title' | globalize }}
      </template>
      <create-invoice-form-module
        :config="config"
        :wallet="wallet"
        :amount="selectedItem.price"
        @close="isInvoiceRequestFormShown = false"
      />
    </drawer>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { types } from './store/types'
import Drawer from '@/vue/common/Drawer'
import { vueRoutes } from '@/vue-router/routes'

import CreateInvoiceFormModule from '@modules/loyalty-points/create-invoice-form'
import MovementsHistoryModule from '@modules/movements-history'

import { initApi } from './_api'
import { Wallet } from '@tokend/js-sdk'

const PETS = [
  {
    name: 'Puppy',
    price: '17.917',
    logo: {
      url: 'https://goo.gl/dzLcBq',
    },
  },
  {
    name: 'Cavy',
    price: '8.641',
    logo: {
      url: 'https://goo.gl/VmXDiv',
    },
  },
  {
    name: 'Rabbit',
    price: '2.1492',
    logo: {
      url: 'https://goo.gl/qgDpJ8',
    },
  },
]

export default {
  name: 'loyalty-points-module',
  components: {
    CreateInvoiceFormModule,
    MovementsHistoryModule,
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
    PETS: PETS,
    vueRoutes,
    isInvoiceRequestFormShown: false,
    defaultAssetCode: 'PET',
    selectedItem: {},
  }),
  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
  },
  methods: {
    ...mapMutations('loyalty-points-invoices', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),
    ...mapActions('loyalty-points-invoices', {
      loadBalances: types.LOAD_BALANCES,
    }),
    openInvoiceForm (item) {
      this.isInvoiceRequestFormShown = true
      this.selectedItem = item
    },
  },
}
</script>

<style lang="scss">
.loyalty-points-invoices-module__cards {
  display: flex;
  justify-content: space-between;
  margin: -0.75rem;
}

.loyalty-points-invoices-module__card {
  flex: 0 1 calc(33.3333% - 1.5rem);
  cursor: pointer;
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 rgba(0, 0, 0, 0.1);
  background-color: $col-invoices-card-background;
  margin: 0.75rem;
}

.loyalty-points-invoices-module__card-img-wrp {
  border-radius: 0.4rem 0.4rem 0rem 0rem;
  padding-top: calc(9 / 16 * 100%);
  background-color: $col-invoices-card-header-background;
  display: flex;
  justify-content: center;
  position: relative;
}

.loyalty-points-invoices-module__card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.loyalty-points-invoices-module__card-body {
  padding: 2.4rem 1.6rem;
}

.loyalty-points-invoices-module__card-name,
.loyalty-points-invoices-module__card-price {
  text-align: center;
}

.loyalty-points-invoices-module__card-name {
  font-size: 1.6rem;
  font-weight: bold;
}

.loyalty-points-invoices-module__card-price {
  margin-top: 0.8rem;
  font-size: 1.8rem;
}

.loyalty-points-invoices-module__history {
  margin-top: 4rem;
}

.loyalty-points-invoices-module__history-title {
  margin-bottom: 0.8rem;
}
</style>
