<template>
  <div class="atomic-swap-card">
    <p class="atomic-swap-card__title">
      <span
        class="atomic-swap-card__base-asset"
      >
        {{ 'atomic-swap-card.base-asset' | globalize({
          baseAsset: atomicSwap.baseAsset
        }) }}
      </span>
      <span class="atomic-swap-card__number">
        {{ 'atomic-swap-card.id-prefix' | globalize({ id: atomicSwap.id }) }}
      </span>
    </p>

    <p class="atomic-swap-card__quote-assets">
      <span>{{ 'atomic-swap-card.quote-assets' | globalize }}</span>
      <span
        class="atomic-swap-card__assets"
        v-for="(quoteAsset, index) in atomicSwap.quoteAssets"
        :key="quoteAsset.code"
      >
        <span v-if="index + 1 !== atomicSwap.quoteAssets.length">
          {{ 'atomic-swap-card.quote-asset-with-comma' | globalize({
            quoteAsset: quoteAsset.code
          }) }}
        </span>
        <span v-else>
          {{ quoteAsset.code }}
        </span>
      </span>
    </p>

    <p class="atomic-swap-card__amount">
      <span>
        Amount {{ atomicSwap.availableAmount }}
      </span>
    </p>

    <p class="atomic-swap-card__author">
      <span class="atomic-swap-card__author-prefix">
        {{ 'atomic-swap-card.author-prefix' | globalize }}
      </span>
      <email-getter
        is-titled
        :account-id="atomicSwap.ownerId"
        :is-copy-button="false"
      />
    </p>
  </div>
</template>

<script>
import EmailGetter from '@/vue/common/EmailGetter'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'

export default {
  name: 'atomic-swap-card',

  components: {
    EmailGetter,
  },

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
}

.atomic-swap-card__number {
  color: $col-text-secondary;
  font-size: inherit;
  margin-right: 0.5ch;
}

.atomic-swap-card__author {
  color: $col-text-secondary;
  font-size: 1.3rem;
  line-height: 1.5;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
}

.atomic-swap-card__quote-assets {
  margin-bottom: 1.6rem;
}
</style>
