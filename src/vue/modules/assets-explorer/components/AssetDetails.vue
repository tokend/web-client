<template>
  <div class="asset-details">
    <div class="asset-details__header">
      <asset-logo :asset="asset" />

      <div class="asset-details__info">
        <p class="asset-details__code">
          {{ asset.code }}
        </p>
        <p class="asset-details__name">
          {{ asset.name }}
        </p>
      </div>
    </div>
    <table class="app__table asset-details__table">
      <tbody>
        <tr v-if="balance">
          <td>{{ 'asset-details.balance-title' | globalize }}</td>
          <td>
            {{
              { value: balance.available, currency: asset.code } | formatMoney
            }}
          </td>
        </tr>
        <tr>
          <td>{{ 'asset-details.maximum-title' | globalize }}</td>
          <td>{{ asset.maxIssuanceAmount | formatMoney }}</td>
        </tr>
        <tr>
          <td>{{ 'asset-details.issued-title' | globalize }}</td>
          <td>{{ asset.issued | formatMoney }}</td>
        </tr>
        <tr>
          <td>{{ 'asset-details.available-title' | globalize }}</td>
          <td>{{ asset.availableForIssuance | formatMoney }}</td>
        </tr>
        <tr>
          <td>{{ 'asset-details.terms-title' | globalize }}</td>
          <td>
            <terms-viewer :asset="asset" />
          </td>
        </tr>
      </tbody>
    </table>

    <template v-if="!balance">
      <balance-creator :asset="asset" />
    </template>
  </div>
</template>

<script>
import AssetLogo from './LogoViewer'
import TermsViewer from './TermsViewer'
import BalanceCreator from './BalanceCreator'

import { AssetRecord } from '../asset-record'
import { mapGetters } from 'vuex'
import { types } from '../store/types'

export default {
  name: 'asset-details',
  components: {
    AssetLogo,
    TermsViewer,
    BalanceCreator,
  },
  props: {
    asset: { type: AssetRecord, required: true },
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

.asset-details__table {
  margin-top: 4rem;

  tr td:last-child {
    text-align: right;
  }
}

.asset-details__header {
  display: flex;
  align-items: center;

  .asset-details__logo {
    width: 5rem;
    height: 5rem;
    border-radius: 50%
  }

  .asset-details__info {
    margin-left: 1.8rem;

    .asset-details__code {
      font-size: 1.8rem;
      font-weight: bold;
      color: $col-primary;
    }

    .asset-details__name {
      margin-top: .1rem;
      font-size: 1.4rem;
      line-height: 1.29;
      color: $col-primary;
    }
  }
}
</style>
