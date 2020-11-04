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
          {{ 'issuance-page.create-issuance-btn' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isPreIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance-page.upload-pre-issuance' | globalize }}
      </template>

      <pre-issuance-form-module
        @pre-issuance-created="isPreIssuanceDrawerShown = false"
      />
    </drawer>

    <drawer :is-shown.sync="isIssuanceDrawerShown">
      <template slot="heading">
        {{ 'issuance-page.create-issuance-title' | globalize }}
      </template>

      <issuance-form
        @issuance-created="closeDrawerAndUpdateList()"
      />
    </drawer>

    <issuance-explorer-module />
  </div>
</template>

<script>
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { vueRoutes } from '@/vue-router/routes'

import IssuanceExplorerModule from '@/vue/modules/issuance-explorer'
import IssuanceForm from '@/vue/forms/IssuanceForm'
import PreIssuanceFormModule from '@modules/pre-issuance-form'
import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'issuance-page',
  components: {
    Drawer,
    TopBar,
    IssuanceForm,
    PreIssuanceFormModule,
    IssuanceExplorerModule,
  },

  mixins: [UpdateList],

  data: _ => ({
    isIssuanceDrawerShown: false,
    isPreIssuanceDrawerShown: false,
    isIssuanceCreated: false,
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),
  },

  methods: {
    closeDrawerAndUpdateList () {
      this.isIssuanceDrawerShown = false
      this.emitUpdateList('issuance:updateList')
    },
  },
}
</script>
