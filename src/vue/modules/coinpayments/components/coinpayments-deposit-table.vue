<template>
  <div class="deposit-table">
    <template v-if="!isLoading">
      <table class="deposit-table__table">
        <deposit-table-row
          v-for="(item, index) in depositList"
          :item="item"
          :key="index"
        />
      </table>
    </template>
    <template v-else-if="isFailed">
      <p>
        {{ 'coinpayments-deposit.load-failed-msg' | globalize }}
      </p>
    </template>
    <template v-else>
      <loader message-id="coinpayments-deposit.loading-msg" />
    </template>
    <div class="deposit-table__collection-loader-wrp">
      <collection-loader
        v-show="depositList.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setPendingIssuances"
        @next-page-load="concatPendingIssuances"
      />
    </div>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Loader from '@/vue/common/Loader'
import DepositTableRow from './coinpayments-deposit-table-row'
import { api } from '../_api'
import { IssuanceRecord } from '../wrappers/issuance.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

const HORIZON_VERSION_PREFIX = 'v3'

export default {
  name: 'deposit-table',
  components: {
    DepositTableRow,
    CollectionLoader,
    Loader,
  },
  props: {
    balanceId: { type: String, required: true },
  },
  data () {
    return {
      isLoading: true,
      isFailed: false,
      depositList: [],
    }
  },
  computed: {
    firstPageLoader () {
      return _ => this.loadFirstPage()
    },
  },
  methods: {
    setPendingIssuances (records) {
      this.depositList = records.map(item => new IssuanceRecord(item))
    },
    concatPendingIssuances (records) {
      this.depositList = this.depositList.concat(records
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
      const endpoint = `/${HORIZON_VERSION_PREFIX}/create_issuance_requests`
      const response = await api().getWithSignature(endpoint, params)
      return response
    },
  },
}
</script>

<style lang="scss">
  @import '~@scss/variables';
  .deposit-table__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    tbody:nth-child(odd){
      tr:first-child {
        background: $col-table-alt-row-background;
      }
    }
  }
</style>
