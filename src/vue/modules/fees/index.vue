<template>
  <div class="fees">
    <template v-if="isInitialized && assetCode">
      <template v-if="isFeesLoaded">
        <fees-table :fees="fees" />
      </template>

      <template v-else-if="isFeesLoadFailed">
        <p class="fees__error-msg">
          {{ 'fees.fees-load-failed-msg' | globalize }}
        </p>
      </template>

      <template v-else>
        <load-spinner message-id="fees.loading-fees-msg" />
      </template>

      <div class="fees__collection-loader-wrp">
        <collection-loader
          v-if="!isFeesLoadFailed"
          v-show="isFeesLoaded"
          :first-page-loader="firstPageLoader"
          @first-page-load="setFees"
          @next-page-load="concatFees"
        />
      </div>
    </template>

    <template v-else>
      <load-spinner message-id="fees.initializing-msg" />
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import FeesTable from './components/fees-table'
import LoadSpinner from '@/vue/common/Loader'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { types } from './store/types'

import { initApi } from './_api'

export default {
  name: 'fees-module',
  components: {
    LoadSpinner,
    FeesTable,
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
    assetCode: {
      type: String,
      default: '',
    },
    accountId: {
      type: String,
      required: true,
    },
    accountRoleId: {
      type: String,
      required: true,
    },
  },

  data: _ => ({
    isInitialized: false,
    isFeesLoaded: false,
    isFeesLoadFailed: false,
  }),

  computed: {
    ...mapGetters('fees', {
      fees: types.fees,
    }),
    firstPageLoader () {
      const assetCode = this.assetCode // HACK: passing this.assetCode directly
      // to function will lead to losing reactivity

      return _ => this.loadFeesFirstPage(assetCode)
    },
  },

  async created () {
    initApi(this.config)

    this.setAccountId(this.accountId)
    this.setAccountRoleId(this.accountRoleId)

    await this.loadFees()
    this.isInitialized = true
  },

  methods: {
    ...mapMutations('fees', {
      setAccountId: types.SET_ACCOUNT_ID,
      setAccountRoleId: types.SET_ACCOUNT_ROLE_ID,
      setFees: types.SET_FEES,
      concatFees: types.CONCAT_FEES,
    }),
    ...mapActions('fees', {
      loadFees: types.LOAD_FEES,
    }),
    async loadFeesFirstPage (assetCode) {
      this.isFeesLoaded = false
      try {
        const response = await this.loadFees(assetCode)
        this.isFeesLoaded = true
        return response
      } catch (e) {
        this.isFeesLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
