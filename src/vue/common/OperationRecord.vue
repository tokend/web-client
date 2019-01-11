<template>
  <div class="app__card transaction-record">
    <table class="transaction-record__table">
      <tr class="transaction-record__tr">
        <td>
          <span class="transaction-record__date">
            {{ operation.date | formatCalendar }}
          </span>
        </td>
        <td>
          <template v-if="OP_TYPES.createIssuanceRequest === operation.typeI">
            {{ 'operation-names.issuance' | globalize }}
          </template>
        </td>
        <td>
          <span
            :class="{'transaction-record__negative-amount'
              : accountId === operation.sender}">
            {{
              { value: operation.amount, currency: operation.asset } |
                formatMoney
            }}
          </span>
        </td>
        <td class="transaction-record__counterparty">
          {{ operation.counterparty }}
        </td>
        <td class="transaction-record__status">
          <span :class="`transaction-record__status--${operation.state}`">
            {{ operation.state }}
          </span>
        </td>
        <td class="transaction-record__td-btn">
          <button
            class="transaction-record__btn"
            @click="isOpenDetails = !isOpenDetails">
            <i
              v-if="isOpenDetails"
              class="mdi mdi-chevron-up" />
            <i
              v-else
              class="mdi mdi-chevron-down" />
          </button>
        </td>
      </tr>
    </table>
    <template v-if="isOpenDetails">
      <details-issuance
        v-if="OP_TYPES.createIssuanceRequest === operation.typeI"
        :operation="operation" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { TX_STATES } from '@/js/const/transaction-statuses'
import { RecordWrapper } from '@/js/records'
import { OP_TYPES } from '@tokend/js-sdk'
import DetailsIssuance from './OperationDetails/Issuance.Details'

export default {
  name: '',
  components: {
    DetailsIssuance
  },
  props: {
    tx: { type: Object, required: true }
  },
  data: _ => ({
    OP_TYPES,
    TX_STATES,
    operation: {},
    isOpenDetails: false
  }),
  computed: {
    ...mapGetters([
      vuexTypes.tokens,
      vuexTypes.accountId
    ])
  },
  watch: {},
  created () {
    try {
      this.operation = RecordWrapper.operation(this.tx, {})
    } catch (e) {
    }
  },
  methods: {
    getAssetName (assetCode) {
      return (this.tokens.find(item => item.code === assetCode) || []).name
    }
  }
}
</script>

<style lang="scss">
  @import '@/scss/variables';

  .transaction-record {
    margin: 6px 0;
  }

  .transaction-record__table {
    width: 100%;
    table-layout: fixed;
    td {
      padding: 7px 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .transaction-record__td-btn {
      text-align: right;
      width: 67px;
    }

    .transaction-record__counterparty {
      width: 300px;
    }

    .transaction-record__status{
      padding-left: 27px;
      width: 130px;
    }
  }

  .transaction-record__date {
    font-weight: 600;
  }

  .transaction-record__negative-amount {
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
