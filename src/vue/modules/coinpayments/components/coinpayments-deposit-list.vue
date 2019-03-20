<template>
  <div class="deposit-list">
    <template v-if="isLoaded && !isFailed">
      <table class="deposit-list__table">
        <deposit-list-item
          v-for="(item, index) in list"
          :item="item"
          :index="index+1"
          :key="index"
        />
      </table>
    </template>
    <div class="deposit-list__collection-loader-wrp">
      <collection-loader
        v-show="list.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setPendingIssuances"
        @next-page-load="concatPendingIssuances"
      />
    </div>
    <template v-if="!isLoaded">
      <loader message-id="coinpayments.loading-msg" />
    </template>
    <template v-if="isFailed">
      <p>
        {{ 'coinpayments.load-failed-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Loader from '@/vue/common/Loader'
import DepositListItem from './coinpayments-deposit-list-item'
import { IssuanceRecord } from '../wrappers/issuance.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions } from 'vuex'
import { types } from '../store/types'

export default {
  name: 'deposit-list',
  components: {
    DepositListItem,
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
  .deposit-list__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
</style>
