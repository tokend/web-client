<template>
  <div class="sales">
    <top-bar>
      <template slot="main">
        <router-link
          :to="{
            name: vueRoutes.allSales.name,
          }"
        >
          <span>
            {{ 'sales.all-sales' | globalize }}
          </span>
        </router-link>
        <router-link
          :to="{
            name: vueRoutes.salesUser.name,
          }"
        >
          <span>
            {{ 'sales.my-sales' | globalize }}
          </span>
        </router-link>
      </template>

      <template
        v-if="getModule().canRenderSubmodule(CreateSalePseudoModule)"
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

      <template
        v-if="getModule().canRenderSubmodule(CreateAssetSaleModule)"
        slot="extra"
      >
        <button
          v-ripple
          class="app__button-raised"
          @click="isAssetSaleDrawerShown = true"
        >
          <i class="mdi mdi-plus sales__btn-icon" />
          {{ 'sales.create-sale' | globalize }}
        </button>
      </template>
    </top-bar>

    <template v-if="getModule().canRenderSubmodule(CreateSalePseudoModule)">
      <drawer
        :is-shown.sync="isCreateSaleDrawerShown"
        :close-by-click-outside="false"
      >
        <template slot="heading">
          {{ 'sales.create-sale' | globalize }}
        </template>
        <create-sale-form @close="isCreateSaleDrawerShown = false" />
      </drawer>
    </template>

    <template v-if="getModule().canRenderSubmodule(CreateAssetSaleModule)">
      <drawer
        :is-shown.sync="isAssetSaleDrawerShown"
        :close-by-click-outside="false"
        class="sales__drawer"
      >
        <template slot="heading">
          {{ 'sales.new-sale' | globalize }}
        </template>
        <submodule-importer
          :submodule="getModule().getSubmodule(CreateAssetSaleModule)"
          @close="isAssetSaleDrawerShown = false"
          :config="config"
          :wallet="wallet"
          :account-id="accountId"
          :min-amount="MIN_AMOUNT"
          :max-amount="MAX_AMOUNT"
          :decimal-pints="DECIMAL_POINTS"
        />
      </drawer>
    </template>
    <router-view />
  </div>
</template>

<script>
import config from '@/config'

import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'

import { CreateSalePseudoModule } from '@/modules-arch/pseudo-modules/create-sale-pseudo-module.js'
import CreateSaleForm from '@/vue/forms/CreateSaleForm'

import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { CreateAssetSaleModule } from '@/vue/modules/create-opportunity/module'

export default {
  name: 'sales',
  components: {
    TopBar,
    Drawer,
    CreateSaleForm,
    SubmoduleImporter,
  },

  data: _ => ({
    isCreateSaleDrawerShown: false,
    isAssetSaleDrawerShown: false,
    isDetailsDrawerShown: false,
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DECIMAL_POINTS: config.DECIMAL_POINTS,
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
    CreateSalePseudoModule,
    CreateAssetSaleModule,
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.sales__btn-icon {
  display: flex;
  font-size: 1.8rem;
  margin-right: 0.5rem;
}

.sales__asset-filter {
  margin-top: -0.6rem;
}

.sales-asset-selector__field {
  display: inline-block;
  width: auto;
  margin-bottom: 1.6rem;
}

.sales__state-filter {
  margin-top: 1rem;
}

.sales__sale-cards {
  display: flex;
  flex-wrap: wrap;
  margin: -1rem;
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

.sales__drawer {
  & .drawer__pane{
    width: 50%;
  }
}
</style>
