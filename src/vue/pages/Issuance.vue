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
          v-if="getModule().canRenderSubmodule(IssuanceFormModule)"
          v-ripple
          class="app__button-raised"
          @click="isIssuanceDrawerShown = true"
        >
          {{ 'issuance-page.create-issuance-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer
      v-if="getModule().canRenderSubmodule(IssuanceFormModule)"
      :is-shown.sync="isIssuanceDrawerShown"
    >
      <template slot="heading">
        {{ 'issuance-page.create-issuance-title' | globalize }}
      </template>

      <submodule-importer
        :submodule="getModule().getSubmodule(IssuanceFormModule)"
        @issuance-created="setIssuanceCreated() || closeIssuanceDrawer()"
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
import { IssuanceFormModule } from '@/vue/modules/issuance-form/module'
import { PreIssuanceFormModule } from '@modules/pre-issuance-form/module'

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
    IssuanceFormModule,
    PreIssuanceFormModule,
  }),

  computed: {
    ...mapGetters({
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),
  },

  methods: {
    setIssuanceCreated () {
      this.isIssuanceCreated = true
    },

    closeIssuanceDrawer () {
      this.isIssuanceDrawerShown = false
    },
  },
}
</script>
