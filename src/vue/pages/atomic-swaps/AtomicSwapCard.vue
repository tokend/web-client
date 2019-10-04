<template>
  <div class="atomic-swap-card">
    <div class="atomic-swap-card__logo">
      <logo-viewer
        :asset="assetByCode(atomicSwapAsk.baseAssetCode)"
      />
    </div>
    <div class="atomic-swap-card__info">
      <h3 class="atomic-swap-card__title">
        {{ atomicSwapAsk.baseAssetName }}
      </h3>

      <div>
        <p class="atomic-swap-card__amount">
          <span :title="atomicSwapAsk.price | formatMoney">
            {{ 'atomic-swap-card.price' | globalize({
              amount: atomicSwapAsk.price,
              code: statsQuoteAsset.code
            }) }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LogoViewer from '@/vue/modules/assets/shared/components/logo-viewer'
import { AtomicSwapAskRecord } from '@/js/records/entities/atomic-swap-ask.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'atomic-swap-card',
  components: {
    LogoViewer,
  },

  props: {
    atomicSwapAsk: {
      type: AtomicSwapAskRecord,
      required: true,
    },
  },
  computed: {
    ...mapGetters([
      vuexTypes.assetByCode,
      vuexTypes.statsQuoteAsset,
    ]),
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

$atomic-swap-card-header-height: 6.5rem;

.atomic-swap-card {
  height: 100%;
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-sale-card-shadow;
  background-color: $col-sale-card-background;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
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
  height: $atomic-swap-card-header-height;
  background-color: $col-asset-card-header-background;
}

.atomic-swap-card__info {
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - #{$atomic-swap-card-header-height});
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
