<template>
  <div class="coinpayments-deposit">
    <coinpayments-form
      :asset="asset"
      :balance-id="balanceId"
    />
    <div class="coinpayments-deposit__pending-issuances-table-wrp">
      <pending-issuances-table
        v-if="!isLoading"
        :pending-issuances="pendingIssuances"
      />
      <template v-else-if="isFailed">
        <p>
          {{ 'coinpayments-deposit.load-failed-msg' | globalize }}
        </p>
      </template>
      <template v-else>
        <loader message-id="coinpayments-deposit.loading-msg" />
      </template>
      <collection-loader
        v-show="pendingIssuances.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setPendingIssuances"
        @next-page-load="concatPendingIssuances"
      />
    </div>
  </div>
</template>

<script>
import CoinpaymentsForm from './components/coinpayments-form'
import PendingIssuancesTable from './components/pending-issuances-table'
import CollectionLoader from '@/vue/common/CollectionLoader'
import Loader from '@/vue/common/Loader'

import { Wallet } from '@tokend/js-sdk'
import { initApi, api } from './_api'
import { IssuanceRecord } from './wrappers/issuance.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'coinpayments-deposit',
  components: {
    CoinpaymentsForm,
    PendingIssuancesTable,
    CollectionLoader,
    Loader,
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
    asset: { type: Object, required: true },
    balanceId: { type: String, required: true },
    accountId: { type: String, required: true },
  },
  data () {
    return {
      isLoading: true,
      isFailed: false,
      pendingIssuances: [],
    }
  },
  computed: {
    firstPageLoader () {
      return _ => this.loadFirstPage()
    },
  },
  created () {
    initApi(this.wallet, this.config)
  },
  methods: {
    setPendingIssuances (records) {
      this.pendingIssuances = records.map(item => new IssuanceRecord(item))
    },
    concatPendingIssuances (records) {
      this.pendingIssuances = this.pendingIssuances.concat(records
        .map(item => new IssuanceRecord(item))
      )
    },
    async loadFirstPage () {
      try {
        const response = await this.loadPendingIssuances(this.balanceId)
        this.isLoading = false
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isFailed = true
      }
    },
    async loadPendingIssuances (balanceId) {
      const params = {
        filter: {
          state: 1,
          'request_details.receiver': balanceId,
        },
        page: {
          order: 'desc',
        },
        include: ['request_details'],
      }
      const endpoint = `/v3/create_issuance_requests`
      const response = await api().getWithSignature(endpoint, params)
      return response
    },
  },
}
</script>

<style lang="scss" scoped>
  .coinpayments-deposit__pending-issuances-table-wrp {
    width: 100%;
    max-width: 100%;
    margin-top: 5rem;
  }
</style>
