import { CreateAMLAlertRequestOp } from './operation-details/create-aml-alert-request'
import { CreateWithdrawRequestOp } from './operation-details/create-withdrawal-request'
import { CreateIssuanceRequestOp } from './operation-details/create-issuance-request'
import { CheckSaleStateOp } from './operation-details/check-sale-state'
import { ReviewRequestOp } from './operation-details/review-request'
import { ManageOfferOp } from './operation-details/manage-offer'
import { PaymentOp } from './operation-details/payment'

import {
  FundedEffect,
  IssuedEffect,
  LockedEffect,
  ChargedEffect,
  MatchedEffect,
  UnlockedEffect,
  WithdrawnEffect,
  ChargedFromLockedEffect,
} from '../wrappers/effect'

const OPERATION_DETAILS_TYPES = Object.freeze({
  payment: 'operations-payment',
  paymentV2: 'operations-payment-v2',
  manageOffer: 'operations-manage-offer',
  reviewRequest: 'operations-review-request',
  checkSaleState: 'operations-check-sale-state',
  createAmlAlert: 'operations-create-aml-alert',
  createIssuanceRequest: 'operations-create-issuance-request',
  createWithdrawalRequest: 'operations-create-withdrawal-request',
})

const EFFECT_TYPES = Object.freeze({
  funded: 'effects-funded',
  issued: 'effects-issued',
  locked: 'effects-locked',
  charged: 'effects-charged',
  matched: 'effects-matched',
  unlocked: 'effects-unlocked',
  withdrawn: 'effects-withdrawn',
  chargedFromLocked: 'effects-charged-from-locked',
})

/**
 * Participant effect is the basic history entry that represent any change to
 * ledger that effected on some account.
 *
 * Inside this module the we're interested only in entries that
 * make an effect on a specific balance, so we can assume that participant
 * effect represents any movements on our user balances. So that's why we'll
 * call it movement.
 *
 * Such entry has 2 important relations:
 *  effect - the entity that defines the exact action happened with balance
 *  operation - the cause of balance movement
 */
export class Movement {
  constructor (record) {
    this.balanceId = record.balance.id
    this.assetCode = record.asset.id

    if (record.operation && record.operation.details) {
      this.operationDetails = Movement.parseOperationDetails(
        record.operation.details
      )
    }

    if (record.effect) {
      this.effect = Movement.parseEffect(record.effect)
    }
  }

  static parseOperationDetails (details) {
    switch (details.type) {
      case OPERATION_DETAILS_TYPES.payment:
        return new PaymentOp(details)
      case OPERATION_DETAILS_TYPES.paymentV2:
        return new PaymentOp(details)
      case OPERATION_DETAILS_TYPES.manageOffer:
        return new ManageOfferOp(details)
      case OPERATION_DETAILS_TYPES.reviewRequest:
        return new ReviewRequestOp(details)
      case OPERATION_DETAILS_TYPES.checkSaleState:
        return new CheckSaleStateOp(details)
      case OPERATION_DETAILS_TYPES.createAmlAlert:
        return new CreateAMLAlertRequestOp(details)
      case OPERATION_DETAILS_TYPES.createIssuanceRequest:
        return new CreateIssuanceRequestOp(details)
      case OPERATION_DETAILS_TYPES.createWithdrawalRequest:
        return new CreateWithdrawRequestOp(details)
      default:
        throw new Error(`Unknown type: ${details.type}`)
    }
  }

  static parseEffect (effect) {
    switch (effect.type) {
      case EFFECT_TYPES.funded:
        return new FundedEffect(effect)
      case EFFECT_TYPES.issued:
        return new IssuedEffect(effect)
      case EFFECT_TYPES.locked:
        return new LockedEffect(effect)
      case EFFECT_TYPES.charged:
        return new ChargedEffect(effect)
      case EFFECT_TYPES.matched:
        return new MatchedEffect(effect)
      case EFFECT_TYPES.unlocked:
        return new UnlockedEffect(effect)
      case EFFECT_TYPES.withdrawn:
        return new WithdrawnEffect(effect)
      case EFFECT_TYPES.chargedFromLocked:
        return new ChargedFromLockedEffect(effect)
      default:
        throw new Error(`Unknown type: ${effect.type}`)
    }
  }
}
