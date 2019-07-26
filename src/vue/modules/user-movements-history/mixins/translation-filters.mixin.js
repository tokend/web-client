import {
  FundedEffect,
  LockedEffect,
  IssuedEffect,
  ChargedEffect,
  UnlockedEffect,
  WithdrawnEffect,
  ChargedFromLockedEffect,
  ParticularBalanceChangeEffect,
} from '../wrappers/effect'

import { CreateAMLAlertRequestOp } from '../wrappers/operation-details/create-aml-alert-request'
import { ManageAssetPairOp } from '../wrappers/operation-details/manage-asset-pair'
import { CheckSaleStateOp } from '../wrappers/operation-details/check-sale-state'
import { CreateIssuanceRequestOp } from '../wrappers/operation-details/create-issuance-request'
import { CreateWithdrawRequestOp } from '../wrappers/operation-details/create-withdrawal-request'
import { ManageOfferOp } from '../wrappers/operation-details/manage-offer'
import { PaymentOp } from '../wrappers/operation-details/payment'
import { ReviewRequestOp } from '../wrappers/operation-details/review-request'

export default {
  filters: {
    effectTypeTranslationId (effect) {
      switch (effect.constructor) {
        case FundedEffect:
          return 'user-movements-history.effects.funded'
        case LockedEffect:
          return 'user-movements-history.effects.locked'
        case IssuedEffect:
          return 'user-movements-history.effects.issued'
        case ChargedEffect:
          return 'user-movements-history.effects.charged'
        case UnlockedEffect:
          return 'user-movements-history.effects.unlocked'
        case WithdrawnEffect:
          return 'user-movements-history.effects.withdrawn'
        case ChargedFromLockedEffect:
          return 'user-movements-history.effects.charged-from-locked'
        case ParticularBalanceChangeEffect:
          return 'user-movements-history.effects.matched'
        default:
          return 'user-movements-history.effects.unknown'
      }
    },
    operationTypeTranslationId (operationDetails) {
      switch (operationDetails.constructor) {
        case CreateAMLAlertRequestOp:
          return 'user-movements-history.operations.create-aml-alert-request'
        case CheckSaleStateOp:
          return 'user-movements-history.operations.check-sale-state'
        case CreateIssuanceRequestOp:
          return 'user-movements-history.operations.create-issuance-request'
        case CreateWithdrawRequestOp:
          return 'user-movements-history.operations.create-withdraw-request'
        case ManageOfferOp:
          if (+operationDetails.orderBookId) {
            return 'user-movements-history.operations.investment'
          }
          return 'user-movements-history.operations.manage-offer'
        case PaymentOp:
          return 'user-movements-history.operations.payment'
        case ReviewRequestOp:
          return 'user-movements-history.operations.review-request'
        case ManageAssetPairOp:
          return 'user-movements-history.operations.manage-asset-pair'
        default:
          return 'user-movements-history.operations.unknown'
      }
    },
  },
}
