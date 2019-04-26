<template>
  <div class="issuance-page">
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.issuance">
          <span>{{ 'issuance-page.history-title' | globalize }}</span>
        </router-link>
      </template>

      <template
        v-if="isAccountCorporate"
        slot="extra"
      >
        <button
          v-if="getModule().canRenderSubmodule(PreIssuanceDrawerPseudoModule)"
          v-ripple
          class="app__button-raised"
          @click="isPreIssuanceDrawerShown = true"
        >
          {{ 'issuance-page.upload-pre-issuance' | globalize }}
        </button>

        <button
          v-if="getModule().canRenderSubmodule(IssuanceDrawerPseudoModule)"
          v-ripple
          class="app__button-raised"
          @click="isIssuanceDrawerShown = true"
        >
          {{ 'issuance-page.create-issuance' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer
      v-if="getModule().canRenderSubmodule(PreIssuanceDrawerPseudoModule)"
      :is-shown.sync="isPreIssuanceDrawerShown"
    >
      <template slot="heading">
        {{ 'issuance-page.upload-pre-issuance' | globalize }}
      </template>

      <submodule-importer
        :submodule="getModule().getSubmodule(PreIssuanceDrawerPseudoModule)"
        @close="isPreIssuanceDrawerShown = false"
      />
    </drawer>

    <drawer
      v-if="getModule().canRenderSubmodule(IssuanceDrawerPseudoModule)"
      :is-shown.sync="isIssuanceDrawerShown"
    >
      <template slot="heading">
        {{ 'issuance-page.create-issuance' | globalize }}
      </template>

      <submodule-importer
        :submodule="getModule().getSubmodule(IssuanceDrawerPseudoModule)"
        @submit="isIssuanceCreated = true"
        @close="isIssuanceDrawerShown = false"
      />
    </drawer>

    <submodule-importer
      v-if="getModule().canRenderSubmodule(IssuanceExplorerModule)"
      :submodule="getModule().getSubmodule(IssuanceExplorerModule)"
      :should-update.sync="isIssuanceCreated"
    />
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { vueRoutes } from '@/vue-router/routes'

import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { IssuanceExplorerModule } from '@modules/issuance-explorer/module'
import { IssuanceDrawerPseudoModule } from '@/modules-arch/pseudo-modules/issuance-drawer-pseudo-module'
import { PreIssuanceDrawerPseudoModule } from '@/modules-arch/pseudo-modules/pre-issuance-drawer-pseudo-module'

export default {
  name: 'issuance-page',
  components: {
    Drawer,
    TopBar,
    SubmoduleImporter,
  },

  data: _ => ({
    isIssuanceDrawerShown: false,
    isPreIssuanceDrawerShown: false,
    isIssuanceCreated: false,
    vueRoutes,
    IssuanceExplorerModule,
    IssuanceDrawerPseudoModule,
    PreIssuanceDrawerPseudoModule,
  }),

  computed: {
    ...mapGetters({
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),
  },
}
</script>

<style lang="scss" scoped>
</style>
