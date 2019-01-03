<template>
  <div class="app__card transaction-record">
    <table class="transaction-record__table">
      <tr class="transaction-record__tr">
        <td class="transaction-record__td">
          <span class="transaction-record__date">{{ tx.date }}</span>
        </td>
        <td class="transaction-record__td">{{ tx.name }}</td>
        <td class="transaction-record__td">{{ getAssetName(tx.asset) }}</td>
        <td class="transaction-record__td">
          <span
            :class="{'ransaction-record__amount' : accountId === tx.sender}">
            {{ tx.amount }} {{ tx.asset }}
          </span>
        </td>
        <td class="transaction-record__td transaction-record__id-td">
          {{ tx.counterparty }}
        </td>
        <td class="transaction-record__td transaction-record__state">
          <span :class="`transaction-record__status--${tx.state}`">
            {{ tx.state }}
          </span>
        </td>
        <td class="transaction-record__td transaction-record__btn-td">
          <button
            class="transaction-record__btn"
            @click="isOpenDetails = !isOpenDetails">
            <md-icon v-if="isOpenDetails">keyboard_arrow_up</md-icon>
            <md-icon v-else>keyboard_arrow_down</md-icon>
          </button>
        </td>
      </tr>
    </table>
    <transaction-details v-if="isOpenDetails" :tx="tx" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { TX_STATES } from '@/js/const/transaction-statuses'
import TransactionDetails from './TransactionDetails'

export default {
  name: '',
  components: {
    TransactionDetails
  },
  props: {
    tx: { type: Object, require: true, default: () => {} }
  },
  data: _ => ({
    TX_STATES,
    isOpenDetails: false
  }),
  computed: {
    ...mapGetters([
      vuexTypes.tokens,
      vuexTypes.accountId
    ])
  },
  watch: {},
  created () {},
  methods: {
    getAssetName (assetCode) {
      return (this.tokens.find(item => item.code === assetCode) || []).name
    }
  }
}
</script>

<style lang="scss">
  @import '@/scss/variables';

  $td-width: 100% / 7;

  .transaction-record {
    margin: 6px 0;
  }

  .transaction-record__table {
    width: 100%;
    table-layout: fixed;
  }

  .transaction-record__tr {
  }

  .transaction-record__td {
    padding: 7px 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .transaction-record__state{
    text-align: right;
    width: 130px;
  }

  .transaction-record__btn-td {
    text-align: right;
    width: 67px;
  }

  .transaction-record__id-td{
    width: 333px;
  }

  .transaction-record__date{
    font-weight: 600;
  }

  .ransaction-record__amount{
    position: relative;
    &:before {
      content: '-';
      position: absolute;
      left: -8px;
    }
  }

  .transaction-record__status--success {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      top: 8px;
      left: -11px;
      border-radius: 100%;
      background-color: $col-success;
    }
  }

  .transaction-record__status--failed {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      top: 8px;
      left: -11px;
      border-radius: 100%;
      background-color: $col-error;
    }
  }

  .transaction-record__status--pending {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      top: 8px;
      left: -11px;
      border-radius: 100%;
      background-color: $col-warning;
    }
  }
  .transaction-record__btn {
    width: 37px;
    height: 37px;
    border-radius: 4px;
    background-color: $col-app-content-background;
    outline: none;
    border: 0;
    box-shadow: none;
    &:hover {
      background-color:darken($col-app-content-background, 3%)
    }
    &:active {
      background-color:darken($col-app-content-background, 10%)
    }
  }
</style>
