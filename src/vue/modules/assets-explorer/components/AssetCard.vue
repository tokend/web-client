<template>
  <a class="asset-card" v-bind="$listeners">
    <div class="asset-card__header">
      <logo-viewer class="asset-card__logo" :asset="asset" />
    </div>
    <div class="asset-card__info">
      <p class="asset-card__code">
        {{ asset.code }}
      </p>
      <p class="asset-card__name">
        {{ asset.name }}
      </p>
      <p v-if="balance" class="asset-card__balance">
        {{
          'assets-page.list-item-balance-line' | globalize({
            value: balance.available
          })
        }}
      </p>
      <p v-else class="asset-card__balance asset-card__no-balance">
        {{ 'assets-page.no-balance-msg' | globalize }}
      </p>
    </div>
  </a>
</template>

<script>
import LogoViewer from './LogoViewer'

import { AssetRecord } from '../asset-record'
import { mapGetters } from 'vuex'
import { types } from '../store/types'

export default {
  name: 'asset-card',
  components: { LogoViewer },
  props: {
    asset: {
      type: AssetRecord,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      balances: types.balances,
    }),
    balance () {
      return this.balances[this.asset.code]
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.asset-card {
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

.asset-card__header {
  border-radius: .4rem .4rem 0 0;
  height: 8.5rem;
  background-color: $col-asset-card-header-background;
  padding-top: 1.5rem;
}

.asset-card__logo {
  margin: 0 auto;
}

.asset-card__info {
  padding: 1.6rem 2rem;
}

.asset-card__code {
  font-size: 1.8rem;
  font-weight: bold;
  color: $col-asset-card-text-primary;
}

.asset-card__name {
  margin-top: .2rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-asset-card-text-primary;
}

.asset-card__balance {
  margin-top: 1.2rem;
  font-size: 1.2rem;
  line-height: 1.5;
  color: $col-asset-card-text-primary;
}

.asset-card__no-balance {
  color: $col-asset-card-text-secondary;
}
</style>
