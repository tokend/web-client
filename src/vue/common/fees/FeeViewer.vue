<template>
  <div class="fee-viewer">
    <p class="fee-viewer__direction-title">
      <span class="fee-viewer__direction-title-text">
        {{ feeTypeTranslationId | globalize }}
      </span>

      <a
        class="fee-viewer__total"
        @click="toggleDetails"
      >
        {{ formatFee(fee.total) | formatMoney }}
      </a>
    </p>

    <transition name="fee-viewer__details-transition">
      <div
        v-if="isDetailsShown"
        class="fee-viewer__details"
      >
        <p class="fee-viewer__details-row">
          <span class="fee-viewer__details-row-text">
            {{ 'fees-renderer.fixed-fee-msg' | globalize }}
          </span>

          <span class="fee-viewer__details-row-text">
            {{ formatFee(fee.fixed) | formatMoney }}
          </span>
        </p>

        <p class="fee-viewer__details-row">
          <span class="fee-viewer__details-row-text">
            {{ 'fees-renderer.calculated-percent-fee-msg' | globalize }}
          </span>

          <span class="fee-viewer__details-row-text">
            {{ formatFee(fee.calculatedPercent) | formatMoney }}
          </span>
        </p>

        <p
          v-if="fee.isAdditionalPresent"
          class="fee-viewer__details-row"
        >
          <span class="fee-viewer__details-row-text">
            {{ 'fees-renderer.recipient-fee-msg' | globalize }}
          </span>

          <span class="fee-viewer__details-row-text">
            {{ formatFee(fee.additional) | formatMoney }}
          </span>
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
import { Fee } from './fee'

export default {
  name: 'fee-viewer',

  props: {
    fee: { type: Fee, required: true },
    assetCode: { type: String, default: '' },
  },

  data: _ => ({
    isDetailsShown: false,
  }),

  computed: {
    feeTypeTranslationId () {
      let result

      if (this.fee.isPayment) {
        if (this.fee.isIncoming) {
          result = 'fees-renderer.recipient-fee-msg'
        } else {
          result = 'fees-renderer.sender-fee-msg'
        }
      } else if (this.fee.isWithdrawal) {
        result = 'fees-renderer.withdrawal-fee-msg'
      } else if (this.fee.isInvest) {
        result = 'fees-renderer.invest-fee-msg'
      } else if (this.fee.isOffer) {
        result = 'fees-renderer.order-fee-msg'
      } else if (this.fee.isIssuance) {
        result = 'fees-renderer.issuance-fee-msg'
      } else {
        result = 'fees-renderer.unknown-fee-msg'
      }

      return result
    },
  },

  methods: {
    formatFee (fee) {
      return {
        value: fee,
        currency: this.assetCode,
      }
    },

    toggleDetails () {
      this.isDetailsShown = !this.isDetailsShown
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/variables';

.fee-viewer__direction-title {
  display: flex;
  justify-content: space-between;
  line-height: 1.4865;
}

.fee-viewer__total {
  cursor: pointer;
  white-space: nowrap;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    border-bottom: dotted 0.1rem;
    bottom: 0.3rem;
    left: 0;
    width: 100%;
    height: 0.1rem;
  }
}

.fee-viewer__details {
  overflow: hidden;
}

.fee-viewer__details-row {
  display: flex;
  justify-content: space-between;
  line-height: 1.4865;
}

.fee-viewer__details-row-text {
  font-size: 1.4rem;
  color: $col-text-secondary;
}

$fee-viewer-animation-duration: 0.2s;

.fee-viewer__details-transition-enter-active {
  animation: fee-viewer__details-keyframes $fee-viewer-animation-duration
    ease-in-out;
}

.fee-viewer__details-transition-leave-active {
  animation: fee-viewer__details-keyframes $fee-viewer-animation-duration
    ease-in-out reverse;
}

@keyframes fee-viewer__details-keyframes {
  from {
    max-height: 0;
  }

  to {
    max-height: 4rem;
  }
}
</style>
