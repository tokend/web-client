<template>
  <div class="atomic-swap-card">
    <h3 class="atomic-swap-card__title">
      {{ atomicSwap.baseAssetName }}
    </h3>

    <p class="atomic-swap-card__amount">
      <span>
        {{ 'atomic-swap-card.available' | globalize({
          amount: atomicSwap.availableAmount
        }) }}
      </span>
    </p>

    <p class="atomic-swap-card__amount">
      <span>
        {{ 'atomic-swap-card.locked' | globalize({
          amount: atomicSwap.lockedAmount
        }) }}
      </span>
    </p>
  </div>
</template>

<script>
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'

export default {
  name: 'atomic-swap-card',

  props: {
    atomicSwap: {
      type: AtomicSwapRecord,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.atomic-swap-card {
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
  background-color: $col-sale-card-background;
  padding: 1.6rem;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  overflow-x: hidden;
}

.atomic-swap-card__title {
  font-size: 1.6rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.atomic-swap-card__amount {
  color: $col-text-secondary;
  font-size: 1.3rem;
  line-height: 1.5;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
}
</style>
