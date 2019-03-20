<template>
  <div class="deposit-table">
    <template v-if="isLoaded && !isFailed">
      <table class="deposit-table__table">
        <deposit-table-row
          v-for="(item, index) in list"
          :item="item"
          :index="index+1"
          :key="index"
        />
      </table>
    </template>
    <div class="deposit-table__collection-loader-wrp">
      <collection-loader
        v-show="list.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setPendingIssuances"
        @next-page-load="concatPendingIssuances"
      />
    </div>
    <template v-if="!isLoaded">
      <loader message-id="coinpayments-deposit.loading-msg" />
    </template>
    <template v-if="isFailed">
      <p>
        {{ 'coinpayments-deposit.load-failed-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Loader from '@/vue/common/Loader'
import DepositTableRow from './coinpayments-deposit-table-row'
import { IssuanceRecord } from '../wrappers/issuance.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions } from 'vuex'
import { types } from '../store/types'

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
      isLoaded: false,
      isFailed: false,
      list: [],
    }
  },
  computed: {
    firstPageLoader () {
      return _ => this.loadFirstPage()
    },
  },
  methods: {
    ...mapActions('coinpayments', {
      loadPendingIssuances: types.LOAD_PENDING_ISSUANCES,
    }),
    setPendingIssuances (records) {
      this.list = records.map(item => new IssuanceRecord(item))
    },
    concatPendingIssuances (records) {
      this.list = this.list.concat(records
        .map(item => new IssuanceRecord(item))
      )
    },
    async loadFirstPage () {
      this.isLoaded = false
      try {
        const response = await this.loadPendingIssuances(this.balanceId)
        this.isLoaded = true
        return response
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
        this.isLoaded = true
        this.isFailed = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .deposit-table__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
</style>
