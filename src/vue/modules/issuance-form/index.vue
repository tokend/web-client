<template>
  <div class="issuance-form">
    <template v-if="isLoaded">
      <create-issuance-form
        v-if="ownedAssets.length"
        :owned-assets="ownedAssets"
      />

      <no-data-message
        v-else
        icon-name="alert-circle"
        :title="'issuance-form.no-owned-assets-title' | globalize"
        :message="'issuance-form.no-owned-assets-msg' | globalize"
      />
    </template>

    <p v-else-if="isLoadFailed">
      {{ 'issuance-form.load-failed-msg' | globalize }}
    </p>

    <load-spinner
      v-else
      :message-id="'issuance-form.loading-msg'"
    />
  </div>
</template>

<script>
import LoadOwnedAssetsMixin from './mixins/load-owned-assets.mixin'

import NoDataMessage from '@/vue/common/NoDataMessage'
import LoadSpinner from '@/vue/common/Loader'
import CreateIssuanceForm from './components/create-issuance-form'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

const EVENTS = {
  close: 'close',
  submit: 'submit',
}

export default {
  name: 'issuance-form-module',
  components: {
    NoDataMessage,
    LoadSpinner,
    CreateIssuanceForm,
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
