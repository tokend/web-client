<template>
  <tbody class="movements-table-row">
    <tr class="movements-table-row__brief">
      <td
        class="movements-table-row__cell
               movements-table-row__cell--bold
               movements-table-row__cell--iconed"
        :title="movement.effect | effectTypeTranslationId | globalize"
      >
        <movement-direction-mark :movement="movement" />
        {{ movement.effect | effectTypeTranslationId | globalize }}
      </td>
      <td
        class="movements-table-row__cell"
        :title="movement.operationDetails
          | operationTypeTranslationId
          | globalize
        "
      >
        {{ movement.operationDetails | operationTypeTranslationId | globalize }}
      </td>
      <td
        class="movements-table-row__cell"
        :title="movement.appliedAt | formatCalendar"
      >
        {{ movement.appliedAt | formatCalendar }}
      </td>
      <td
        class="movements-table-row__cell"
        :title="movement | movementAmount | formatMoney"
      >
        {{ movement | movementAmount | formatMoney }}
      </td>

      <td
        class="movements-table-row__cell"
        :title="movement | movementFee | formatMoney"
      >
        {{ movement | movementFee | formatMoney }}
      </td>

      <td
        class="movements-table-row__cell
               movements-table-row__cell--expand-btn-wrp"
      >
        <button
          class="movements-table-row__btn"
          @click="isAttributesViewerShown = !isAttributesViewerShown"
        >
          <i
            class="mdi mdi-chevron-down movements-table-row__toggle-icon"
            :class="{ 'mdi-rotate-180': isAttributesViewerShown }"
          />
        </button>
      </td>
    </tr>

    <tr
      v-if="isAttributesViewerShown"
      class="movements-table-row__attributes"
    >
      <td colspan="6">
        <div class="movements-table-row__attributes-viewer-wrp">
          <movement-attributes-viewer :movement="movement" />
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script>
import { Movement } from '../wrappers/movement'
import { MathUtil } from '@/js/utils'
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

import MovementAttributesViewer from './movement-attributes-viewer'
import MovementDirectionMark from './movement-direction-mark'

export default {
  name: 'movement-table-row',
  components: {
    MovementAttributesViewer,
    MovementDirectionMark,
  },
  filters: {
    effectTypeTranslationId (effect) {
      switch (effect.constructor) {
        case FundedEffect:
          return 'movements-history.effects.funded'
        case LockedEffect:
          return 'movements-history.effects.locked'
        case IssuedEffect:
          return 'movements-history.effects.issued'
        case ChargedEffect:
          return 'movements-history.effects.charged'
        case UnlockedEffect:
          return 'movements-history.effects.unlocked'
        case WithdrawnEffect:
          return 'movements-history.effects.withdrawn'
        case ChargedFromLockedEffect:
          return 'movements-history.effects.charged-from-locked'
        case ParticularBalanceChangeEffect:
          return 'movements-history.effects.matched'
        default:
          return 'movements-history.effects.unknown'
      }
    },
    operationTypeTranslationId (operationDetails) {
      switch (operationDetails.constructor) {
        case CreateAMLAlertRequestOp:
          return 'movements-history.operations.create-aml-alert-request'
        case CheckSaleStateOp:
          return 'movements-history.operations.check-sale-state'
        case CreateIssuanceRequestOp:
          return 'movements-history.operations.create-issuance-request'
        case CreateWithdrawRequestOp:
          return 'movements-history.operations.create-withdraw-request'
        case ManageOfferOp:
          return 'movements-history.operations.manage-offer'
        case PaymentOp:
          return 'movements-history.operations.payment'
        case ReviewRequestOp:
          return 'movements-history.operations.review-request'
        case ManageAssetPairOp:
          return 'movements-history.operations.manage-asset-pair'
        default:
          return 'movements-history.operations.unknown'
      }
    },
    movementAmount (movement) {
      let currency = movement.assetCode
      let value = movement.effect.amount

      if (movement.isOutgoing || movement.isLocked) {
        value = -value
      }

      return { currency, value }
    },
    movementFee (movement) {
      let currency = movement.assetCode
      let value = MathUtil.add(
        movement.fixedFee,
        movement.calculatedPercentFee
      )

      return { currency, value }
    },
  },

  props: {
    movement: { type: Movement, required: true },
  },

  data: () => ({
    isAttributesViewerShown: false,
  }),
}
</script>

<style lang="scss">
@import '~@scss/mixins';
@import '~@scss/variables';
@import '../scss/variables';

.movements-table-row__brief {
  background-color: $col-block-bg;

  @include box-shadow;
}

.movements-table-row__cell {
  padding: 0.7rem $movements-table-cell-side-padding;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: none;

  &--bold {
    font-weight: 600;

  }

  &--iconed {
    position: relative;
    padding-left: $movements-table-cell-side-padding + 3rem;

    i {
      left: $movements-table-cell-side-padding + 1rem;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  &--direction {
    padding-right: 0;
    min-width: $movements-table-cell-width-direction;
    width: $movements-table-cell-width-direction;
  }

  &--expand-btn-wrp {
    text-align: right;
    width: $movements-table-cell-width-expand-btn-wrp;
  }
}

.movements-table-row__btn {
  width: 3.7rem;
  height: 3.7rem;
  border-radius: 0.4rem;
  background-color: $col-app-content-background;
  outline: none;
  border: 0;
  box-shadow: none;

  &:hover {
    background-color: darken($col-app-content-background, 3%);
  }

  &:active {
    background-color: darken($col-app-content-background, 10%);
  }
}

.movements-table-row__toggle-icon {
  font-size: 1.6rem;

  &:before {
    transition: transform .2s ease-out;
  }
}

.movements-table-row__attributes-viewer-wrp {
  background: $col-block-bg;
  padding:
    0.75rem $movements-table-cell-width-expand-btn-wrp
    0.7rem $movements-table-cell-side-padding;
  margin-top: -0.6rem;
  position: relative;
  @include box-shadow();

  &:before {
    // HACK: to cover sticking out shadow at the top
    content: "";
    display: block;
    position: absolute;
    background: $col-block-bg;
    height: 1rem;
    top: 0;
    left: 0;
    right: 0;
    transform: translateY(-50%);
  }
}
</style>
