<template>
  <div class="sales">
    <!--<top-bar>
       <template slot="main">
        <router-link :to="vueRoutes.investableSales">
          <span>{{ 'sales.investable-sales' | globalize }}</span>
        </router-link>

        <router-link
          v-if="isAccountCorporate"
          :to="vueRoutes.userOwnedSales"
        >
          <span>{{ 'sales.my-sales' | globalize }}</span>
        </router-link>
      </template>

      <template
        v-if="isAccountCorporate"
        slot="extra"
      >
        <button
          v-ripple
          class="app__button-raised"
          @click="isCreateSaleDrawerShown = true"
        >
          <i class="mdi mdi-plus sales__btn-icon" />
          {{ 'sales.create-sale' | globalize }}
        </button>
      </template>
    </top-bar>-->
    <template v-if="isAccountCorporate">
      <drawer
        :is-shown.sync="isCreateSaleDrawerShown"
        :close-by-click-outside="false"
        class="sales__drawer"
      >
        <template slot="heading">
          {{ 'sales.new-sale' | globalize }}
        </template>
        <sale-form
          @submitted="closeCreateSaleDrawerAndUpdateList()"
        />
      </drawer>
    </template>

    <router-view />
  </div>
</template>

<script>
import config from '@/config'

// import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import SaleForm from '@/vue/forms/SaleForm'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { vueRoutes } from '@/vue-router/routes'

import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'sales',
  components: {
    // TopBar,
    Drawer,
    SaleForm,
  },

  mixins: [UpdateList],

  data: _ => ({
    isCreateSaleDrawerShown: false,
    isAssetSaleDrawerShown: false,
    isDetailsDrawerShown: false,
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DECIMAL_POINTS: config.DECIMAL_POINTS,
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),
  },

  methods: {
    closeCreateSaleDrawerAndUpdateList () {
      this.isCreateSaleDrawerShown = false
      this.emitUpdateList('sales:updateList')
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

/*
 * TODO: break this section down. children modules should know anything
 * about parent styles
 */

.sales__btn-icon {
  display: flex;
  font-size: 1.8rem;
  margin-right: 0.5rem;
  margin-top: -0.4rem;
}

.sales__asset-filter {
  margin-top: -0.6rem;
}

.sales__state-filter {
  margin-top: 1rem;
}

.sales__sale-cards {
  display: flex;
  flex-wrap: wrap;
  margin: -1rem;
}

.sales-asset-selector__field {
  display: inline-block;
  width: auto;
  margin-bottom: 1.6rem;
}

.sales__sale-card {
  flex: 0 1 calc(25% - 2rem);

  @include respond-to($large) {
    flex: 0 1 calc(33.3% - 2rem);
  }
  @include respond-to($x-medium) {
    flex: 0 1 calc(50% - 2rem);
  }
  @include respond-to($x-small) {
    flex: 0 1 calc(100% - 2rem);
  }
}

.sales__loader {
  margin-top: 1rem;
}
</style>
