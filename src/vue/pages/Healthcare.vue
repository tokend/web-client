<template>
  <div class="healthcare-page">
    <top-bar>
      <template slot="main">
        <router-link
          :to="vueRoutes.documentExplorer"
        >
          <span>
            {{ 'healthcare-page.explore-documents-title' | globalize }}
          </span>
        </router-link>
      </template>

      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isDrawerShown = true"
        >
          {{ 'healthcare-page.upload-document' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'healthcare-page.upload-document' | globalize }}
      </template>

      <document-upload-form-module
        :wallet="wallet"
        :config="config"
        @submit="isDrawerShown = false"
      />
    </drawer>

    <router-view />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'

import DocumentUploadFormModule from '@modules/document-upload-form'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { vueRoutes } from '@/vue-router/routes'

import config from '@/config'

export default {
  name: 'healthcare-page',
  components: {
    TopBar,
    Drawer,
    DocumentUploadFormModule,
  },

  data: _ => ({
    isDrawerShown: false,
    config: {
      horizonURL: config.HORIZON_SERVER,
      storageURL: config.FILE_STORAGE,
    },
    vueRoutes,
  }),

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>
