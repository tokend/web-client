<template>
  <div class="asset-attributes-viewer">
    <div class="asset-attributes-viewer__header">
      <logo-viewer
        :asset="asset"
        :storage-url="storageUrl"
        :dark-mode="true" />

      <div class="asset-attributes-viewer__info">
        <p class="asset-attributes-viewer__code">
          {{ asset.code }}
        </p>
        <p class="asset-attributes-viewer__name">
          {{ asset.name }}
        </p>
      </div>
    </div>
    <div class="app__table asset-attributes-viewer__table-wrp">
      <table>
        <tbody>
          <tr v-if="asset.balance">
            <td>{{ 'assets.balance-title' | globalize }}</td>
            <td>
              <!-- eslint-disable-next-line max-len -->
              {{ { value: asset.balance, currency: asset.code } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>{{ 'assets.maximum-title' | globalize }}</td>
            <td>{{ asset.maxIssuanceAmount | formatMoney }}</td>
          </tr>
          <tr>
            <td>{{ 'assets.issued-title' | globalize }}</td>
            <td>{{ asset.issued | formatMoney }}</td>
          </tr>
          <tr>
            <td>{{ 'assets.available-title' | globalize }}</td>
            <td>{{ asset.availableForIssuance | formatMoney }}</td>
          </tr>
          <tr>
            <td>
              {{ 'assets.transferable-title' | globalize }}
            </td>
            <td>
              <template v-if="asset.isTransferable">
                {{ 'assets.present-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'assets.absent-msg' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'assets.withdrawable-title' | globalize }}
            </td>
            <td>
              <template v-if="asset.isWithdrawable">
                {{ 'assets.present-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'assets.absent-msg' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>{{ 'assets.terms-title' | globalize }}</td>
            <td>
              <terms-viewer :asset="asset" :storage-url="storageUrl" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import LogoViewer from './logo-viewer'
import TermsViewer from './terms-viewer'

import { Asset } from '../wrappers/asset'

export default {
  name: 'asset-attributes-viewer',
  components: {
    LogoViewer,
    TermsViewer,
  },
  props: {
    asset: { type: Asset, required: true },
    storageUrl: { type: String, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.asset-attributes-viewer__table-wrp {
  margin-top: 4rem;

  table tr td:last-child {
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
</style>
