<template>
  <div class="issuance-page">
    <top-bar>
      <template slot="main">
        <router-link
          :to="vueRoutes.issuance"
        >
          <span>{{ 'issuance-page.history-title' | globalize }}</span>
        </router-link>
      </template>

      <template v-if="isAccountCorporate" slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isPreIssuanceDrawerShown = true"
        >
          {{ 'issuance-page.upload-pre-issuance' | globalize }}
        </button>

        <button
          v-ripple
          class="app__button-raised"
          @click="isIssuanceDrawerShown = true"
        >
          {{ 'issuance-page.create-issuance' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isPreIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance-page.upload-pre-issuance' | globalize }}
      </template>
      <pre-issuance-form @close="isPreIssuanceDrawerShown = false" />
    </drawer>

    <drawer :is-shown.sync="isIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance-page.create-issuance' | globalize }}
      </template>
      <issuance-form
        @submit="isIssuanceCreated = true"
        @close="isIssuanceDrawerShown = false"
      />
    </drawer>

    <issuances-explorer-module
      :wallet="wallet"
      :config="config"
      :should-update.sync="isIssuanceCreated"
    />
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'

import IssuancesExplorerModule from '@modules/issuances-explorer'

import IssuanceForm from '@/vue/forms/IssuanceForm'
import PreIssuanceForm from '@/vue/forms/PreIssuanceForm'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { vueRoutes } from '@/vue-router/routes'

import config from '@/config'

export default {
  name: 'issuance-page',
  components: {
    Drawer,
    TopBar,
    IssuancesExplorerModule,
    IssuanceForm,
    PreIssuanceForm,
  },

  data: _ => ({
    isIssuanceDrawerShown: false,
    isPreIssuanceDrawerShown: false,
    isIssuanceCreated: false,
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      isAccountCorporate: vuexTypes.isAccountCorporate,
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>

<style lang="scss" scoped>

</style>
