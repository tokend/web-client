<template>
  <div class="fee-viewer">
    <p class="fee-viewer__direction-title">
      <span class="fee-viewer__direction-title-text">
        {{ feeDirectionTitle }}
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
            Fixed fee
          </span>

          <span class="fee-viewer__details-row-text">
            {{ formatFee(fee.fixed) | formatMoney }}
          </span>
        </p>

        <p class="fee-viewer__details-row">
          <span class="fee-viewer__details-row-text">
            Percent fee
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
            Recipient fee
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
    feeDirectionTitle () {
      if (this.fee.isIncoming) {
        return 'Recipient fee'
      } else if (this.fee.isOutgoing) {
        return 'Sender fee'
      } else {
        return 'Unknown fee'
      }
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
}

.fee-viewer__direction-title-text {
  font-size: 1.6rem;
}

.fee-viewer__total {
  border-bottom: dotted 0.15rem;
  font-size: 1.6rem;
  cursor: pointer;
}

.fee-viewer__details {
  margin-top: 0.6rem;
  overflow: hidden;
}

.fee-viewer__details-row {
  display: flex;
  justify-content: space-between;
  line-height: 1.5;
}

.fee-viewer__details-row-text {
  font-size: 1.4rem;
  color: $col-text-secondary;
}

$fee-viewer-animation-duration: 0.2s;

.fee-viewer__details-transition-enter-active {
  animation:
    fee-viewer__details-keyframes
    $fee-viewer-animation-duration
    ease-in-out;
}

.fee-viewer__details-transition-leave-active {
  animation:
    fee-viewer__details-keyframes
    $fee-viewer-animation-duration
    ease-in-out
    reverse;
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
