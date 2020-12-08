<template>
  <div class="pre-issuance-form">
    <template v-if="isLoaded">
      <template v-if="isLoadFailed">
        <p>
          {{ 'pre-issuance-form.load-failed-msg' | globalize }}
        </p>
      </template>

      <template v-else>
        <template v-if="ownedAssets.length">
          <upload-pre-issuance-form
            :owned-assets="ownedAssets"
            @submit="$emit(EVENTS.preIssuanceCreated)"
          />
        </template>

        <template v-else>
          <no-data-message
            icon-name="alert-circle"
            :title="'pre-issuance-form.no-owned-assets-title' | globalize"
            :message="'pre-issuance-form.no-owned-assets-msg' | globalize"
          />
        </template>
      </template>
    </template>

    <template v-else>
      <skeleton-loader-pre-issuance-form />
    </template>
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import SkeletonLoaderPreIssuanceForm from './components/skeleton-loader-pre-issuance-form'
import UploadPreIssuanceForm from './components/upload-pre-issuance-form'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  preIssuanceCreated: 'pre-issuance-created',
}

export default {
  name: 'issuance-form-module',
  components: {
    NoDataMessage,
    UploadPreIssuanceForm,
    SkeletonLoaderPreIssuanceForm,
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    EVENTS,
  }),

  computed: {
    ...mapGetters({
      ownedAssets: vuexTypes.ownedAssets,
    }),
  },

  async created () {
    try {
      await this.loadAssets()
      this.isLoaded = true
    } catch (error) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },
  methods: {
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),
  },
}
</script>
