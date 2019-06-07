<template>
  <div class="pre-issuance-form">
    <template v-if="isLoaded">
      <upload-pre-issuance-form
        v-if="ownedAssets.length"
        :owned-assets="ownedAssets"
        @submit="$emit(EVENTS.preIssuanceCreated)"
      />

      <no-data-message
        v-else
        icon-name="alert-circle"
        :title="'pre-issuance-form.no-owned-assets-title' | globalize"
        :message="'pre-issuance-form.no-owned-assets-msg' | globalize"
      />
    </template>

    <p v-else-if="isLoadFailed">
      {{ 'pre-issuance-form.load-failed-msg' | globalize }}
    </p>

    <skeleton-loader-pre-issuance-form
      v-else
    />
  </div>
</template>

<script>
import LoadOwnedAssetsMixin from './mixins/load-owned-assets.mixin'

import NoDataMessage from '@/vue/common/NoDataMessage'
import SkeletonLoaderPreIssuanceForm from './components/skeleton-loader-pre-issuance-form'
import UploadPreIssuanceForm from './components/upload-pre-issuance-form'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
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
  mixins: [LoadOwnedAssetsMixin],

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    EVENTS,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
  },
  async created () {
    await this.init()
  },

  methods: {
    async init () {
      try {
        await this.loadOwnedAssets(this.accountId)
        this.isLoaded = true
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>
