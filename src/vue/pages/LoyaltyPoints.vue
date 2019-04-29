<template>
  <div class="loyalty-points-page">
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.loyaltyPointsInvoices">
          <span>
            {{ 'loyalty-points.invoices-page' | globalize }}
          </span>
        </router-link>
      </template>
      <template slot="extra">
        <button
          v-if="getModule().canRenderSubmodule(IssuanceDrawerPseudoModule)"
          v-ripple
          class="app__button-raised"
          @click="isIssuanceDrawerShown = true"
        >
          {{ 'loyalty-points.create-issuance-btn' | globalize }}
        </button>

        <button
          v-if="getModule().canRenderSubmodule(CreateInvoiceFormModule)"
          v-ripple
          class="app__button-raised"
          @click="isInvoiceRequestFormShown = true"
        >
          {{ 'loyalty-points.create-invoice-btn' | globalize }}
        </button>
      </template>
    </top-bar>
    <router-view />

    <drawer
      v-if="getModule().canRenderSubmodule(IssuanceDrawerPseudoModule)"
      :is-shown.sync="isIssuanceDrawerShown"
    >
      <template slot="heading">
        {{ 'loyalty-points.create-issuance-form-title' | globalize }}
      </template>

      <submodule-importer
        :submodule="getModule().getSubmodule(IssuanceDrawerPseudoModule)"
        @close="isIssuanceDrawerShown = false"
      />
    </drawer>

    <drawer
      v-if="getModule().canRenderSubmodule(CreateInvoiceFormModule)"
      :is-shown.sync="isInvoiceRequestFormShown"
    >
      <template slot="heading">
        {{ 'loyalty-points.create-invoice-form-title' | globalize }}
      </template>

      <submodule-importer
        :submodule="getModule().getSubmodule(CreateInvoiceFormModule)"
        @close="isInvoiceRequestFormShown = false"
        :horizon-url="horizonUrl"
      />
    </drawer>
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'

import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { IssuanceDrawerPseudoModule } from '@/modules-arch/pseudo-modules/issuance-drawer-pseudo-module'
import { CreateInvoiceFormModule } from '@modules/loyalty-points/create-invoice-form/module'

import { vueRoutes } from '@/vue-router/routes'

import config from '@/config'

export default {
  name: 'loyaly-points-page',
  components: {
    TopBar,
    Drawer,
    SubmoduleImporter,
  },
  data: _ => ({
    vueRoutes,
    isIssuanceDrawerShown: false,
    isInvoiceRequestFormShown: false,
    IssuanceDrawerPseudoModule,
    CreateInvoiceFormModule,
    horizonUrl: config.HORIZON_SERVER,
  }),
}
</script>

<style lang="scss">
</style>
