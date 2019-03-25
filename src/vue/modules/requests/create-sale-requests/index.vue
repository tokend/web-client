<template>
  <div class="create-sale-requests">
    <template v-if="isLoaded">
      <template v-if="filters.baseAsset.code">
        <!-- eslint-disable max-len -->
        <select-field
          v-model="filters.baseAsset"
          :values="ownedAssets"
          key-as-value-text="nameAndCode"
          class="create-sale-requests__asset-list app__select app__select--no-border"
        />
        <!-- eslint-enable max-len -->

        <requests-renderer
          class="create-sale-requests__renderer"
          :base-asset="filters.baseAsset"
        />
      </template>

      <no-data-message
        v-else
        icon-name="trending-up"
        :title="'create-sale-requests.no-owned-assets-title' | globalize"
        :message="'create-sale-requests.no-owned-assets-desc' | globalize"
      />
    </template>

    <p v-else-if="isLoadingFailed">
      {{ 'create-sale-requests.loading-error-msg' | globalize }}
    </p>

    <load-spinner v-else message-id="create-sale-requests.loading-msg" />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'
import LoadSpinner from '@/vue/common/Loader'
import SelectField from '@/vue/fields/SelectField'

import RequestsRenderer from './components/requests-renderer'

import { initApi } from './_api'
import { initConfig } from './_config'

import { Wallet } from '@tokend/js-sdk'

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'create-sale-requests-module',
  components: {
    NoDataMessage,
    LoadSpinner,
    SelectField,
    RequestsRenderer,
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
    filters: {
      baseAsset: {},
    },
    isLoaded: false,
    isLoadingFailed: false,
  }),

  computed: {
    ...mapGetters('create-sale-requests', {
      ownedAssets: types.accountOwnedAssets,
    }),
  },

  async created () {
    initApi(this.wallet, this.config)
    initConfig(this.config)

    this.setAccountId(this.wallet.accountId)
    await this.initAssetSelector()
  },

  methods: {
    ...mapMutations('create-sale-requests', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),

    ...mapActions('create-sale-requests', {
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES,
    }),

    async initAssetSelector () {
      await this.loadBalances()

      if (this.ownedAssets.length) {
        this.filters.baseAsset = this.ownedAssets[0]
      }
    },

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
.create-sale-requests__asset-list {
  width: fit-content;
}

.create-sale-requests__renderer {
  margin-top: 2.1rem;
}
</style>
