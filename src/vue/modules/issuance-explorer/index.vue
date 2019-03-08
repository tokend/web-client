<template>
  <div class="issuance-explorer">
    <template v-if="isLoaded">
      <issuances-table :issuances="issuances" />
    </template>

    <template v-else-if="isLoadFailed">
      <p class="issuance-explorer__error-msg">
        {{ 'issuance-explorer.load-failed-msg' | globalize }}
      </p>
    </template>

    <template v-else>
      <load-spinner message-id="issuance-explorer.loading-msg" />
    </template>

    <div class="issuance-explorer__collection-loader-wrp">
      <collection-loader
        v-show="isLoaded"
        :first-page-loader="firstPageLoader"
        @first-page-load="setIssuances"
        @next-page-load="concatIssuances"
      />
    </div>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import LoadSpinner from '@/vue/common/Loader'

import IssuancesTable from './components/issuances-table'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { Wallet } from '@tokend/js-sdk'
import { initApi } from './_api'

const EVENTS = {
  shouldUpdate: 'update:shouldUpdate',
}

export default {
  name: 'issuance-explorer-module',
  components: {
    LoadSpinner,
    IssuancesTable,
    CollectionLoader,
  },

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
    shouldUpdate: {
      type: Boolean,
      default: false,
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
    firstPageLoader: _ => {},
  }),

  computed: {
    ...mapGetters('issuance-explorer', {
      accountId: types.accountId,
      issuances: types.issuances,
    }),
  },

  watch: {
    shouldUpdate: function (value) {
      if (value) {
        this.initFirstPageLoader()
        this.$emit(EVENTS.shouldUpdate, false)
      }
    },
  },

  created () {
    initApi(this.wallet, this.config)
    this.setAccountId(this.wallet.accountId)

    this.initFirstPageLoader()
  },
  methods: {
    ...mapMutations('issuance-explorer', {
      setAccountId: types.SET_ACCOUNT_ID,
      setIssuances: types.SET_ISSUANCES,
      concatIssuances: types.CONCAT_ISSUANCES,
    }),
    ...mapActions('issuance-explorer', {
      loadIssuances: types.LOAD_ISSUANCES,
    }),

    initFirstPageLoader () {
      this.firstPageLoader = _ => this.loadIssuancesFirstPage()
    },

    async loadIssuancesFirstPage () {
      this.isLoaded = false
      try {
        const response = await this.loadIssuances()
        this.isLoaded = true
        return response
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.issuance-explorer__collection-loader-wrp {
  margin-top: 1rem;
}
</style>
