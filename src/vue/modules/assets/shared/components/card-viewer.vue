<template>
  <a class="card-viewer" v-on="$listeners">
    <div class="card-viewer__header">
      <logo-viewer
        class="card-viewer__logo"
        :asset="asset"
        :config="config"
      />
    </div>
    <div class="card-viewer__info">
      <p class="card-viewer__code">
        {{ asset.code }}
      </p>
      <p class="card-viewer__name">
        {{ asset.name || asset.code }}
      </p>
      <p v-if="asset.balance" class="card-viewer__balance">
        {{
          'assets.list-item-balance-line' | globalize({
            value: assetBalance
          })
        }}
      </p>
      <p v-else class="card-viewer__balance card-viewer__no-balance">
        {{ 'assets.no-balance-msg' | globalize }}
      </p>
    </div>
  </a>
</template>

<script>
import LogoViewer from './logo-viewer'

import { Asset } from '../wrappers/asset'

export default {
  name: 'card-viewer',
  components: { LogoViewer },
  props: {
    asset: {
      type: Asset,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    assetBalance () {
      return {
        value: this.asset.balance,
        currency: this.asset.code,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.card-viewer {
  flex: 0 1 calc(25% - 1.5rem);
  min-height: 19rem;
  cursor: pointer;
  border-radius: .4rem;
  box-shadow: 0 .5rem 1rem 0 $col-field-shadow;
  background-color: $col-asset-card-background;
  margin: .75rem;

  @include respond-to($medium) {
    flex: 0 1 calc(33% - 1.5rem);
  }

  @include respond-to($x-small) {
    flex: 0 1 calc(100% - 1.5rem);
  }
}

.card-viewer__header {
  border-radius: .4rem .4rem 0 0;
  height: 8.5rem;
  background-color: $col-asset-card-header-background;
  padding-top: 1.5rem;
}

.card-viewer__logo {
  margin: 0 auto;
}

.card-viewer__info {
  padding: 1.6rem 2rem;
}

.card-viewer__code {
  font-size: 1.8rem;
  font-weight: bold;
  color: $col-asset-card-text-primary;
}

.card-viewer__name {
  margin-top: .2rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-asset-card-text-primary;
}

.card-viewer__balance {
  margin-top: 1.2rem;
  font-size: 1.2rem;
  line-height: 1.5;
  color: $col-asset-card-text-primary;
}

.card-viewer__no-balance {
  color: $col-asset-card-text-secondary;
}
</style>
