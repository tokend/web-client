<template>
  <div class="signers-manager" v-if="isInitialized">
    <signer-list-manager
      :signers="signers"
      :wallet="wallet"
      :source-account-id="sourceAccountId"
    />
    <div class="signers-manager__collection-loader-wrp">
      <collection-loader
        :key="collectionLoaderKey"
        :first-page-loader="loadSignersPage"
        @first-page-load="setSigners"
        @next-page-load="concatSigners"
      />
    </div>
  </div>
</template>

<script>
import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

import { mapGetters, mapMutations, mapActions } from 'vuex'
import { types } from './store/types'

import SignerListManager from './components/signer-list-manager'
import CollectionLoader from '@/vue/common/CollectionLoader'

import { Bus as LocalBus } from './event-bus'

export default {
  name: 'signers-manager',
  components: {
    SignerListManager,
    CollectionLoader,
  },
  props: {
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     */
    config: {
      type: Object,
      required: true,
    },
    wallet: {
      type: Wallet,
      required: true,
    },
    sourceAccountId: {
      type: String,
      required: true,
    },
  },
  data: _ => ({
    // HACK - increment when need to force re-rendering the collection-loader:
    collectionLoaderKey: 0,
    isInitialized: true,
  }),
  computed: {
    ...mapGetters('document-signers-manager', {
      signers: types.signers,
    }),
  },
  async created () {
    initApi(this.wallet, this.config)
    LocalBus.onSignersUpdate(this.rerenderList)

    this.isInitialized = true
  },
  methods: {
    ...mapMutations('document-signers-manager', {
      setSigners: types.SET_SIGNERS,
      concatSigners: types.CONCAT_SIGNERS,
    }),
    ...mapActions('document-signers-manager', {
      loadSigners: types.LOAD_SIGNERS,
    }),
    loadSignersPage () {
      return this.loadSigners(this.sourceAccountId)
    },
    rerenderList () {
      this.collectionLoaderKey++
    },
  },
}
</script>

<style>
.signers-manager {
  width: 100%;
}
</style>
