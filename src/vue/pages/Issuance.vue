<template>
  <div class="issuance">
    <top-bar>
      <template slot="main">
        <router-link
          :to="{ name: 'app.issuance' }"
        >
          <span>{{ 'issuance.history-title' | globalize }}</span>
        </router-link>
      </template>

      <template v-if="isAccountCorporate" slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isPreIssuanceDrawerShown = true"
        >
          {{ 'issuance.upload-pre-issuance-btn' | globalize }}
        </button>

        <button
          v-ripple
          class="app__button-raised"
          @click="isIssuanceCreated = true"
        >
          {{ 'issuance.create-issuance-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isPreIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance.upload-pre-issuance-btn' | globalize }}
      </template>
      <pre-issuance-form @close="isPreIssuanceDrawerShown = false" />
    </drawer>

    <drawer :is-shown.sync="isIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance.issuance-form-heading' | globalize }}
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
