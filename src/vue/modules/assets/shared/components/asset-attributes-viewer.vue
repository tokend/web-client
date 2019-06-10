<template>
  <div class="asset-attributes-viewer">
    <div class="asset-attributes-viewer__header">
      <logo-viewer
        :asset="asset"
        :dark-mode="true"
      />

      <div class="asset-attributes-viewer__info">
        <p class="asset-attributes-viewer__code">
          {{ asset.code }}
        </p>
        <p class="asset-attributes-viewer__name">
          {{ asset.name || asset.code }}
        </p>
      </div>
    </div>
    <div class="app__table asset-attributes-viewer__table-wrp">
      <table>
        <tbody>
          <tr v-if="balance">
            <td>{{ 'assets.balance-title' | globalize }}</td>
            <td>
              {{
                { value: balance, currency: asset.code } | formatMoney
              }}
            </td>
          </tr>
          <tr>
            <td>{{ 'assets.terms-title' | globalize }}</td>
            <td>
              <terms-viewer :asset="asset" />
            </td>
          </tr>
          <tr>
            <td>{{ 'assets.owner-lbl' | globalize }}</td>
            <td>
              <email-getter
                right-side
                :account-id="asset.owner"
              />
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
import EmailGetter from '@/vue/common/EmailGetter'

import { AssetRecord } from '@/js/records/entities/asset.record'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'asset-attributes-viewer',
  components: {
    LogoViewer,
    TermsViewer,
    EmailGetter,
  },
  props: {
    asset: { type: AssetRecord, required: true },
    kycRequiredAssetType: { type: Number, required: true },
    securityAssetType: { type: Number, required: true },
  },
  computed: {
    ...mapGetters({
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),
    balance () {
      return this.accountBalanceByCode(this.asset.code).balance
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
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-primary;
}

.asset-attributes-viewer__name {
  margin-top: 0.1rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-primary;
}
</style>
