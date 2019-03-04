<template>
  <div class="coinpayments-deposit-list">
    <template v-if="isLoaded && !isFailed">
      <table class="coinpayments-deposit-list__table">
        <deposit-list-item
          v-for="(item, index) in list"
          :item="item"
          :index="index+1"
          :key="index"
        />
      </table>
    </template>
    <div class="coinpayments-deposit-list__collection-loader-wrp">
      <collection-loader
        v-show="list.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setPendingIssuances"
        @next-page-load="concatPendingIssuances"
      />
    </div>
    <template v-if="!isLoaded">
      <loader message-id="coinpayments-form.loading-msg" />
    </template>
    <template v-if="isFailed">
      <p>
        {{ 'coinpayments-form.load-failed-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import CollectionLoader from '@/vue/common/CollectionLoader'
import Loader from '@/vue/common/Loader'
import DepositListItem from './coinpayments-deposit-list-item'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { mapActions, mapGetters } from 'vuex'
import { types } from '../store/types'

export default {
  name: '',
  components: {
    DepositListItem,
    CollectionLoader,
    Loader,
  },
  mixins: [],
  props: {
  },
  data () {
    return {
      isLoaded: false,
      isFailed: false,
      list: [],
    }
  },
  computed: {
    ...mapGetters('coinpayments', {}),
    firstPageLoader () {
      return _ => this.loadFirstPage()
    },
  },
  watch: {},
  async created () {
  },
  destroyed () {
  },
  methods: {
    ...mapActions('coinpayments', {
      loadPendingIssuances: types.LOAD_PENDING_ISSUANCES,
    }),
    setPendingIssuances (data) {
      this.list = data
    },
    concatPendingIssuances (data) {
      this.list = [...this.list, ...data]
    },
    async loadFirstPage () {
      this.isLoaded = false
      try {
        const response = await this.loadPendingIssuances()
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
  .coinpayments-deposit-list__table {
    width: 100%;
    border-collapse: collapse;
  }
</style>
