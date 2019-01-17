<template>
  <div class="app__card operation-record">
    <table class="operation-record__table">
      <tr class="operation-record__tr">
        <td>
          <span class="operation-record__date">
            {{ operation.date | formatCalendar }}
          </span>
        </td>
        <td>
          {{ `operation-names.${operation.typeI}` | globalize }}
        </td>
        <td>
          <span
            :class="{'operation-record__negative-amount'
              : accountId === operation.sender}">
            {{
              { value: operation.amount, currency: operation.asset } |
                formatMoney
            }}
          </span>
        </td>
        <td class="operation-record__counterparty">
          {{ operation.counterparty }}
        </td>
        <td class="operation-record__status">
          <span :class="`operation-record__status--${operation.state}`">
            {{ operation.state }}
          </span>
        </td>
        <td class="operation-record__td-btn">
          <button
            class="operation-record__btn"
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
      <payment-details
        v-if="OP_TYPES.paymentV2 === operation.typeI ||
          OP_TYPES.payment === operation.typeI"
        :operation="operation" />
      <match-details
        v-if="OP_TYPES.manageOffer === operation.typeI"
        :operation="operation" />
      <match-details
        v-if="OP_TYPES.checkSaleState === operation.typeI"
        :operation="operation" />
      <withdrawal-details
        v-if="OP_TYPES.createWithdrawalRequest === operation.typeI"
        :operation="operation" />
    </template>
  </div>
</template>

<script>
import DetailsIssuance from './OperationDetails/Issuance.Details'
import PaymentDetails from './OperationDetails/Payment.Details'
import MatchDetails from './OperationDetails/Match.Details'
import WithdrawalDetails from './OperationDetails/Withdrawal.Details'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { RecordWrapper } from '@/js/records'
import { OP_TYPES } from '@tokend/js-sdk'

export default {
  name: '',
  components: {
    DetailsIssuance,
    PaymentDetails,
    MatchDetails,
    WithdrawalDetails
  },
  props: {
    operationData: { type: Object, required: true }
  },
  data: _ => ({
    OP_TYPES,
    operation: {},
    isOpenDetails: false
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId
    ])
  },
  watch: {
    operationData: {
      immediate: true,
      handler: 'parsOperation'
    }
  },
  methods: {
    parsOperation () {
      this.operation = RecordWrapper.operation(this.operationData, {
        accountId: this.accountId
      })
    }
  }
}
</script>

<style lang="scss">
  @import '@/scss/variables';

  .operation-record {
    margin: 0.6rem 0;
  }

  .operation-record__table {
    width: 100%;
    table-layout: fixed;
    td {
      padding: 0.7rem 1.5rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .operation-record__td-btn {
      text-align: right;
      width: 6.7rem;
    }

    .operation-record__counterparty {
      width: 30rem;
    }

    .operation-record__status {
      padding-left: 2.7rem;
      width: 13rem;
    }
  }

  .operation-record__date {
    font-weight: 600;
  }

  .operation-record__negative-amount {
    position: relative;
    &:before {
      content: '-';
      position: absolute;
      left: -0.8rem;
    }
  }

  .operation-record__status--success {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 0.6rem;
      height: 0.6rem;
      top: 0.8rem;
      left: -1.1rem;
      border-radius: 100%;
      background-color: $col-success;
    }
  }

  .operation-record__status--failed {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 0.6rem;
      height: 0.6rem;
      top: 0.8rem;
      left: -1.1rem;
      border-radius: 100%;
      background-color: $col-error;
    }
  }

  .operation-record__status--pending {
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 0.6rem;
      height: 0.6rem;
      top: 0.8rem;
      left: -1.1rem;
      border-radius: 100%;
      background-color: $col-warning;
    }
  }

  .operation-record__btn {
    width: 3.7rem;
    height: 3.7rem;
    border-radius: 0.4rem;
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
