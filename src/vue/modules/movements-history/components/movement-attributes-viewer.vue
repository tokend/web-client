<template>
  <div class="movement-attributes-viewer">
    <div class="attributes-viewer">
      <table class="attributes-viewer__table">
        <balance-changed-effect-viewer
          v-if="movement.effect instanceof BalanceChangedEffect"
          :effect="movement.effect"
          :asset-code="movement.assetCode"
        />

        <particular-balance-changed-effect-viewer
          v-else-if="movement.effect instanceof ParticularBalanceChangeEffect"
          :effect="movement.effect"
        />

        <manage-offer-op-viewer
          v-if="movement.operationDetails instanceof ManageOfferOp"
          :operation-details="movement.operationDetails"
        />
        <payment-op-viewer
          v-if="movement.operationDetails instanceof PaymentOp"
          :operation-details="movement.operationDetails"
        />
        <review-request-op-viewer
          v-if="movement.operationDetails instanceof ReviewRequestOp"
          :operation-details="movement.operationDetails"
        />
        <check-sale-state-op-viewer
          v-if="movement.operationDetails instanceof CheckSaleStateOp"
          :operation-details="movement.operationDetails"
        />
        <create-aml-alert-request-op-viewer
          v-if="movement.operationDetails instanceof CreateAMLAlertRequestOp"
          :operation-details="movement.operationDetails"
        />
        <create-issuance-request-op-viewer
          v-if="movement.operationDetails instanceof CreateIssuanceRequestOp"
          :operation-details="movement.operationDetails"
        />
        <create-withdrawal-request-op-viewer
          v-if="movement.operationDetails instanceof CreateWithdrawRequestOp"
          :operation-details="movement.operationDetails"
        />
      </table>
    </div>
  </div>
</template>

<script>
import { Movement } from '../wrappers/movement'
import {
  BalanceChangedEffect,
  ParticularBalanceChangeEffect,
} from '../wrappers/effect'

import { PaymentOp } from '../wrappers/operation-details/payment'
import { ManageOfferOp } from '../wrappers/operation-details/manage-offer'
import { ReviewRequestOp } from '../wrappers/operation-details/review-request'
import { CheckSaleStateOp } from '../wrappers/operation-details/check-sale-state'
import { CreateAMLAlertRequestOp } from '../wrappers/operation-details/create-aml-alert-request'
import { CreateIssuanceRequestOp } from '../wrappers/operation-details/create-issuance-request'
import { CreateWithdrawRequestOp } from '../wrappers/operation-details/create-withdrawal-request'

import BalanceChangedEffectViewer from './effect-viewers/balance-changed'
import ParticularBalanceChangedEffectViewer from './effect-viewers/particular-balance-changed'

import PaymentOpViewer from './operation-viewers/payment'
import ManageOfferOpViewer from './operation-viewers/manage-offer'
import ReviewRequestOpViewer from './operation-viewers/review-request'
import CheckSaleStateOpViewer from './operation-viewers/check-sale-state'
import CreateAmlAlertRequestOpViewer from './operation-viewers/create-aml-alert-request'
import CreateIssuanceRequestOpViewer from './operation-viewers/create-issuance-request'
import CreateWithdrawalRequestOpViewer from './operation-viewers/create-withdrawal-request'
export default {
  name: 'movement-attributes-viewer',
  components: {
    BalanceChangedEffectViewer,
    ParticularBalanceChangedEffectViewer,

    PaymentOpViewer,
    ManageOfferOpViewer,
    ReviewRequestOpViewer,
    CheckSaleStateOpViewer,
    CreateAmlAlertRequestOpViewer,
    CreateIssuanceRequestOpViewer,
    CreateWithdrawalRequestOpViewer,
  },
  props: {
    movement: {
      type: Movement,
      required: true,
    },
  },
  data: _ => ({
    BalanceChangedEffect,
    ParticularBalanceChangeEffect,

    PaymentOp,
    ManageOfferOp,
    ReviewRequestOp,
    CheckSaleStateOp,
    CreateAMLAlertRequestOp,
    CreateIssuanceRequestOp,
    CreateWithdrawRequestOp,
  }),
}
</script>

<style lang="scss" scoped>
@import '../scss/attributes-viewer';
</style>
