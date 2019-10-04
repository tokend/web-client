<template>
  <div class="asset-attributes-viewer">
    <div class="asset-attributes-viewer__header">
      <logo-viewer
        :asset="asset"
        :dark-mode="true"
      />

      <div class="asset-attributes-viewer__info">
        <p class="asset-attributes-viewer__name">
          {{ asset.name }}
        </p>
      </div>
    </div>
    <div class="app__table asset-attributes-viewer__table-wrp">
      <table>
        <tbody>
          <tr v-if="isAccountCorporate">
            <td>{{ 'assets.vendor-code' | globalize }}</td>
            <td>
              {{ asset.code }}
            </td>
          </tr>

          <tr v-if="balance">
            <td>{{ 'assets.balance-title' | globalize }}</td>
            <td :title="balance.balance | formatMoney">
              {{ balance.balance | formatBalance }}
            </td>
          </tr>

          <tr v-if="balance.isConverted">
            <td>{{ 'assets.converted-balance-title' | globalize }}</td>
            <td :title="balance.convertedBalance.available | formatMoney">
              {{
                balance.convertedBalance.available | formatBalance
              }}
              {{ businessStatsQuoteAsset }}
            </td>
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
        </tbody>
      </table>
    </div>
    <div
      v-if="asset.description"
      class="asset-attributes-viewer__description"
    >
      <h3>{{ 'assets.description-title' | globalize }}</h3>
      <p>{{ asset.description }}</p>
    </div>
  </div>
</template>

<script>
import LogoViewer from './logo-viewer'

import { AssetRecord } from '@/js/records/entities/asset.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'asset-attributes-viewer',
  components: {
    LogoViewer,
  },
  props: {
    asset: { type: AssetRecord, required: true },
  },

  computed: {
    ...mapGetters({
      businessStatsQuoteAsset: vuexTypes.businessStatsQuoteAsset,
      isAccountCorporate: vuexTypes.isAccountCorporate,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),

    balance () {
      return this.accountBalanceByCode(this.asset.code)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

$media-xsmall-height: 375px;
$media-small-height: 460px;

.asset-attributes-viewer__table-wrp {
  margin-top: 4rem;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
  @include respond-to-height($media-xsmall-height) {
    margin-top: 0.8rem;
  }
}

.asset-attributes-viewer__table-wrp table tr td:last-child {
  text-align: right;
}

.asset-attributes-viewer__header {
  display: flex;
  align-items: center;
}

.asset-attributes-viewer__logo {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
}

.asset-attributes-viewer__info {
  margin-left: 1.8rem;
}

.asset-attributes-viewer__code {
  margin-top: 0.1rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-primary;
}

.asset-attributes-viewer__name {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-primary;
}

.asset-attributes-viewer__description {
  margin-top: 1.5rem;
}
</style>
