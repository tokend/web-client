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

    <load-spinner
      v-else
      :message-id="'pre-issuance-form.loading-msg'"
    />
  </div>
</template>

<script>
import LoadOwnedAssetsMixin from './mixins/load-owned-assets.mixin'

import NoDataMessage from '@/vue/common/NoDataMessage'
import LoadSpinner from '@/vue/common/Loader'
import UploadPreIssuanceForm from './components/upload-pre-issuance-form'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

const EVENTS = {
  preIssuanceCreated: 'pre-issuance-created',
}

export default {
  name: 'issuance-form-module',
  components: {
    NoDataMessage,
    LoadSpinner,
    UploadPreIssuanceForm,
  },
  mixins: [LoadOwnedAssetsMixin],

  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    EVENTS,
  }),

  async created () {
    await this.init()
  },

  methods: {
    async init () {
      try {
        initApi(this.wallet, this.config)
        await this.loadOwnedAssets(this.wallet.accountId)
        this.isLoaded = true
      } catch (error) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },
  },
}
</script>
