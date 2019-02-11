<template>
  <div class="asset-attributes-viewer">
    <div class="asset-attributes-viewer__header">
      <logo-viewer :asset="asset" />

      <div class="asset-attributes-viewer__info">
        <p class="asset-attributes-viewer__code">
          {{ asset.code }}
        </p>
        <p class="asset-attributes-viewer__name">
          {{ asset.name }}
        </p>
      </div>
    </div>
    <table class="app__table asset-attributes-viewer__table">
      <tbody>
        <tr v-if="balance">
          <td>{{ 'asset-explorer.balance-title' | globalize }}</td>
          <td>
            {{
              { value: balance.available, currency: asset.code } | formatMoney
            }}
          </td>
        </tr>
        <tr>
          <td>{{ 'asset-explorer.maximum-title' | globalize }}</td>
          <td>{{ asset.maxIssuanceAmount | formatMoney }}</td>
        </tr>
        <tr>
          <td>{{ 'asset-explorer.issued-title' | globalize }}</td>
          <td>{{ asset.issued | formatMoney }}</td>
        </tr>
        <tr>
          <td>{{ 'asset-explorer.available-title' | globalize }}</td>
          <td>{{ asset.availableForIssuance | formatMoney }}</td>
        </tr>
        <tr>
          <td>{{ 'asset-explorer.terms-title' | globalize }}</td>
          <td>
            <terms-viewer :asset="asset" />
          </td>
        </tr>
      </tbody>
    </table>

    <template v-if="!balance">
      <div class="asset-attributes-viewer__add-balance-btn-wrp">
        <add-balance-btn :asset="asset" />
      </div>
    </template>
  </div>
</template>

<script>
import LogoViewer from './logo-viewer'
import TermsViewer from './terms-viewer'
import AddBalanceBtn from './add-balance-btn'

import { Asset } from '../wrappers/asset'
import { types } from '../store/types'
import { mapGetters } from 'vuex'

export default {
  name: 'asset-attributes-viewer',
  components: {
    LogoViewer,
    TermsViewer,
    AddBalanceBtn,
  },
  props: {
    asset: { type: Asset, required: true },
  },
  computed: {
    ...mapGetters('asset-explorer', {
      getBalanceByAssetCode: types.getBalanceByAssetCode,
    }),
    balance () {
      return this.getBalanceByAssetCode(this.asset.code)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.asset-attributes-viewer__table {
  margin-top: 4rem;

  tr td:last-child {
    text-align: right;
  }
}

.asset-attributes-viewer__header {
  display: flex;
  align-items: center;
}

.asset-attributes-viewer__logo {
  width: 5rem;
  height: 5rem;
  border-radius: 50%
}

.asset-attributes-viewer__info {
  margin-left: 1.8rem;
}

.asset-attributes-viewer__code {
  font-size: 1.8rem;
  font-weight: bold;
  color: $col-primary;
}

.asset-attributes-viewer__name {
  margin-top: .1rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-primary;
}

.asset-attributes-viewer__add-balance-btn-wrp {
  margin-top: 4.9rem;
  display: flex;
}
</style>
