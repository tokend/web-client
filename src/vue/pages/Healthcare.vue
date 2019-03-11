<template>
  <div class="healthcare-page">
    <top-bar>
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
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'

import DocumentUploadFormModule from '@modules/document-upload-form'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

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
  }),

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
    }),
  },
}
</script>
