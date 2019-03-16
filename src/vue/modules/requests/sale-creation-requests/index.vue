<template>
  <div class="sale-creation-requests">
    <template v-if="isLoaded">
      <sale-creation-requests-loader v-if="assets.length" />

      <no-data-message
        v-else
        icon-name="trending-up"
        :title="'sale-creation-requests.no-owned-assets-title' | globalize"
        :message="'sale-creation-requests.no-owned-assets-desc' | globalize"
      />
    </template>

    <p v-else-if="isLoadingFailed">
      {{ 'sale-creation-requests.loading-error-msg' | globalize }}
    </p>

    <load-spinner v-else message-id="sale-creation-requests.loading-msg" />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import LoadSpinner from '@/vue/common/Loader'

import SaleCreationRequestsLoader from './components/sale-creation-requests-loader'

import { initApi } from './_api'
import { initConfig } from './_config'

import { Wallet } from '@tokend/js-sdk'

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'sale-creation-requests-module',
  components: {
    NoDataMessage,
    LoadSpinner,
    SaleCreationRequestsLoader,
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
    isLoadingFailed: false,
  }),

  computed: {
    ...mapGetters('sale-creation-requests', {
      assets: types.accountOwnedAssets,
    }),
  },

  async created () {
    initApi(this.wallet, this.config)
    initConfig(this.config)

    this.setAccountId(this.wallet.accountId)
    await this.loadBalances()
  },

  methods: {
    ...mapMutations('sale-creation-requests', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),

    ...mapActions('sale-creation-requests', {
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES,
    }),

    async loadBalances () {
      this.isLoaded = false
      try {
        const response = await this.loadAccountBalances()
        this.isLoaded = true
        return response
      } catch (e) {
        this.isLoadingFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.sale-creation-requests__loader {
  margin-top: 1rem;
}
</style>
