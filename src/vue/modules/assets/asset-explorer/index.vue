<template>
  <div class="asset-explorer">
    <template v-if="isLoaded">
      <assets-renderer :config="config" />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="asset-explorer__error-msg">
        {{ 'assets.loading-error-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="assets.balances-loading-msg" />
    </template>
  </div>
</template>

<script>
import LoadSpinner from '@/vue/common/Loader'

import AssetsRenderer from './components/assets-renderer'

import { mapActions, mapMutations } from 'vuex'
import { types } from './store/types'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'asset-explorer',
  components: {
    LoadSpinner,
    AssetsRenderer,
  },

  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
    * @property config - the config for component to use
    * @property config.horizonURL - the url of horizon server (without version)
    * @property config.storageURL - the url of storage server
    */
    config: {
      type: Object,
      required: true,
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
  }),

  async created () {
    initApi(this.wallet, this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
  },

  methods: {
    ...mapMutations('asset-explorer', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),

    ...mapActions('asset-explorer', {
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES,
    }),

    async loadBalances () {
      try {
        await this.loadAccountBalances()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback()
      }
    },
  },
}
</script>
