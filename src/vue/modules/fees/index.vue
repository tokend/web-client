<template>
  <div class="fees">
    <template v-if="assetCode">
      <template v-if="isLoaded">
        <fees-table :fees="valuableFeesByAssetCode" :asset-code="assetCode" />
      </template>

      <template v-else-if="isLoadFailed">
        <p class="fees__error-msg">
          {{ 'fees.fees-loading-error-msg' | globalize }}
        </p>
      </template>

      <template v-else>
        <load-spinner message-id="fees.fees-loading-msg" />
      </template>
    </template>
  </div>
</template>

<script>
import FeesTable from './components/fees-table'
import LoadSpinner from '@/vue/common/Loader'

import { Wallet } from '@tokend/js-sdk'

import { mapActions, mapMutations, mapGetters } from 'vuex'
import { types } from './store/types'

import { initApi } from './_api'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'fees-module',
  components: {
    LoadSpinner,
    FeesTable,
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
    assetCode: {
      type: String,
      default: '',
    },
  },

  data: _ => ({
    isLoaded: false,
    isLoadFailed: false,
  }),

  computed: {
    ...mapGetters('fees', {
      fees: types.fees,
    }),

    valuableFeesByAssetCode () {
      return this.fees.filter(item => {
        return item.asset === this.assetCode &&
          (Number(item.fixed) || Number(item.percent))
      })
    },
  },

  async created () {
    initApi(this.wallet, this.config)
    this.setAccountId(this.wallet.accountId)
    await this.loadFees()
  },

  methods: {
    ...mapMutations('fees', {
      setAccountId: types.SET_ACCOUNT_ID,
    }),

    ...mapActions('fees', {
      loadAccountFees: types.LOAD_ACCOUNT_FEES,
    }),

    async loadFees () {
      try {
        await this.loadAccountFees()
        this.isLoaded = true
      } catch (e) {
        this.isLoadFailed = true
        ErrorHandler.processWithoutFeedback(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fees__collection-loader-wrp {
  margin-top: 1rem;
}
</style>
