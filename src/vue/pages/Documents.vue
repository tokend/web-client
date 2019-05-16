<template>
  <div class="documents-page">
    <top-bar>
      <template slot="main">
        <router-link
          :to="vueRoutes.documentExplorer"
        >
          <span>
            {{ 'documents-page.explore-documents-title' | globalize }}
          </span>
        </router-link>
      </template>

      <template slot="extra">
        <button
          v-ripple
          class="app__button-raised"
          @click="isDrawerShown = true"
        >
          {{ 'documents-page.upload-document' | globalize }}
        </button>
      </template>
    </top-bar>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'documents-page.upload-document' | globalize }}
      </template>

      <document-upload-form-module
        @submit="(isDrawerShown = false) || (isDocumentUploaded = true)"
      />
    </drawer>

    <router-view :document-uploaded.sync="isDocumentUploaded" />
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'

import DocumentUploadFormModule from '@modules/documents/document-upload-form'

import { vueRoutes } from '@/vue-router/routes'

export default {
  name: 'documents-page',
  components: {
    TopBar,
    Drawer,
    DocumentUploadFormModule,
  },

  data: _ => ({
    isDrawerShown: false,
    isDocumentUploaded: false,
    vueRoutes,
  }),
}
</script>
