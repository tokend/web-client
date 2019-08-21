<template>
  <div class="atomic-swap-card">
    <div class="atomic-swap-card__logo">
      <logo-viewer
        :asset="assetByCode(atomicSwap.baseAsset)"
      />
    </div>
    <div class="atomic-swap-card__info">
      <h3 class="atomic-swap-card__title">
        {{ atomicSwap.baseAssetName }}
      </h3>

      <p class="atomic-swap-card__amount">
        <span :title="atomicSwap.availableAmount | formatMoney">
          {{ 'atomic-swap-card.available' | globalize({
            amount: atomicSwap.availableAmount
          }) }}
        </span>
      </p>

      <p class="atomic-swap-card__amount">
        <span :title="atomicSwap.quoteAssets[0].price | formatMoney">
          {{ 'atomic-swap-card.price' | globalize({
            amount: atomicSwap.quoteAssets[0].price,
            code: atomicSwap.quoteAssets[0].id
          }) }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import LogoViewer from '@/vue/modules/assets/shared/components/logo-viewer'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'atomic-swap-card',
  components: {
    LogoViewer,
  },

  props: {
    atomicSwap: {
      type: AtomicSwapRecord,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
    ]),
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.atomic-swap-card {
  display: flex;
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
  background-color: $col-sale-card-background;
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

.atomic-swap-card__logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 1rem;
  padding-left: 1rem;
  background-color: $col-asset-card-header-background;
}

.atomic-swap-card__info {
  padding: 1.6rem;
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
