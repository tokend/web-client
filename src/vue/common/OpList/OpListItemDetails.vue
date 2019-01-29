<template>
  <issuance-op-details
    v-if="isTypeOf(IssuanceRecord)"
    :operation="operation"
  />

  <match-op-details
    v-else-if="isTypeOf(MatchRecord)"
    :operation="operation"
  />

  <payment-op-details
    v-else-if="isTypeOf(PaymentRecord)"
    :operation="operation"
  />

  <withdrawal-op-details
    v-else-if="isTypeOf(WithdrawRecord)"
    :operation="operation"
  />
</template>

<script>
import IssuanceOpDetails from './OpDetails/IssuanceOpDetails'
import { IssuanceRecord } from '@/js/records/operations/issuance.record'

import PaymentOpDetails from './OpDetails/PaymentOpDetails'
import { PaymentRecord } from '@/js/records/operations/payment.record'

import MatchOpDetails from './OpDetails/MatchOpDetails'
import { MatchRecord } from '@/js/records/operations/match.record'

import WithdrawalOpDetails from './OpDetails/WithdrawalOpDetails'
import { WithdrawRecord } from '@/js/records/operations/withdraw.record'

export default {
  name: 'op-list-item-details',

  components: {
    IssuanceOpDetails,
    PaymentOpDetails,
    MatchOpDetails,
    WithdrawalOpDetails,
  },

  props: {
    operation: { type: Object, required: true },
  },

  data: _ => ({
    IssuanceRecord,
    MatchRecord,
    PaymentRecord,
    WithdrawRecord,
  }),

  methods: {
    isTypeOf (constructor) {
      return this.operation instanceof constructor
    },
  },
}
</script>

<style lang="scss">
</style>
