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
          <template v-if="asset.description">
            <tr>
              <td>{{ 'assets.description-title' | globalize }}</td>
              <td>
                {{ asset.description }}
              </td>
            </tr>
          </template>

          <tr v-if="balance">
            <td>{{ 'assets.balance-title' | globalize }}</td>
            <td>
              {{
                { value: balance, currency: asset.code } | formatMoney
              }}
            </td>
          </tr>
          <tr>
            <td>{{ 'assets.maximum-title' | globalize }}</td>
            <td>
              {{
                { value: asset.maxIssuanceAmount, currency: asset.code } |
                  formatMoney
              }}
            </td>
          </tr>
          <tr>
            <td>{{ 'assets.issued-title' | globalize }}</td>
            <td>
              {{ { value: asset.issued, currency: asset.code } | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>{{ 'assets.available-title' | globalize }}</td>
            <td>
              {{ { value: asset.availableForIssuance, currency: asset.code } |
                formatMoney
              }}
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
            <td>
              {{ 'assets.can-be-base-in-atomic-swap-title' | globalize }}
            </td>
            <td>
              <template v-if="asset.isBaseInAtomicSwap">
                {{ 'assets.present-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'assets.absent-msg' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'assets.can-be-quote-in-atomic-swap-title' | globalize }}
            </td>
            <td>
              <template v-if="asset.isQuoteInAtomicSwap">
                {{ 'assets.present-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'assets.absent-msg' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'assets.deposit-method-title' | globalize }}
            </td>
            <td>
              <template v-if="asset.isCoinpayments">
                {{ 'assets.coinpayments-msg' | globalize }}
              </template>

              <template v-else-if="asset.externalSystemType">
                {{ 'assets.default-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'assets.non-depositable-msg' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'assets.asset-type' | globalize }}
            </td>
            <td>
              <template v-if="asset.assetType === kycRequiredAssetType">
                {{ 'assets.verification-required-title' | globalize }}
              </template>

              <template v-else-if="asset.assetType === securityAssetType">
                {{ 'assets.security-asset-title' | globalize }}
              </template>

              <template v-else>
                {{ 'assets.does-not-require-verification-title' | globalize }}
              </template>
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
          <template v-if="asset.stellarAssetCode">
            <tr :title="'assets.stellar-asset-code-title' | globalize">
              <td>
                {{ 'assets.stellar-asset-code-title' | globalize }}
              </td>
              <td>
                {{ asset.stellarAssetCode }}
              </td>
            </tr>

            <tr :title="'assets.stellar-asset-type-title' | globalize">
              <td>
                {{ 'assets.stellar-asset-type-title' | globalize }}
              </td>
              <td>
                {{ stellarAssetTypeTranslated }}
              </td>
            </tr>

            <tr :title="'assets.stellar-withdraw-title' | globalize">
              <td>
                {{ 'assets.stellar-withdraw-title' | globalize }}
              </td>
              <td>
                <template v-if="asset.stellarWithdraw">
                  {{ 'assets.yes-msg' | globalize }}
                </template>
                <template v-else>
                  {{ 'assets.no-msg' | globalize }}
                </template>
              </td>
            </tr>

            <tr :title="'assets.stellar-deposit-title' | globalize">
              <td>
                {{ 'assets.stellar-deposit-title' | globalize }}
              </td>
              <td>
                <template v-if="asset.stellarDeposit">
                  {{ 'assets.yes-msg' | globalize }}
                </template>
                <template v-else>
                  {{ 'assets.no-msg' | globalize }}
                </template>
              </td>
            </tr>
          </template>

          <template v-if="asset.erc20Address">
            <tr>
              <td :title="'assets.erc20-address-title' | globalize">
                {{ 'assets.erc20-address-title' | globalize }}
              </td>
              <td :title="asset.erc20Address">
                {{ asset.erc20Address }}
              </td>
            </tr>

            <tr :title="'erc20-withdraw-title' | globalize">
              <td>
                {{ 'assets.erc20-withdraw-title' | globalize }}
              </td>
              <td>
                <template v-if="asset.erc20Withdraw">
                  {{ 'assets.yes-msg' | globalize }}
                </template>
                <template v-else>
                  {{ 'assets.no-msg' | globalize }}
                </template>
              </td>
            </tr>

            <tr :title="'assets.erc20-deposit-title' | globalize">
              <td>
                {{ 'assets.erc20-deposit-title' | globalize }}
              </td>
              <td>
                <template v-if="asset.erc20Deposit">
                  {{ 'assets.yes-msg' | globalize }}
                </template>
                <template v-else>
                  {{ 'assets.no-msg' | globalize }}
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import LogoViewer from './logo-viewer'
import TermsViewer from './terms-viewer'
import EmailGetter from '@/vue/common/EmailGetter'
import { STELLAR_TYPES } from '@/js/const/asset-subtypes.const'
import { AssetRecord } from '@/js/records/entities/asset.record'

export default {
  name: 'asset-attributes-viewer',
  components: {
    LogoViewer,
    TermsViewer,
    EmailGetter,
  },
  props: {
    asset: { type: AssetRecord, required: true },
    balance: { type: String, default: '' },
    kycRequiredAssetType: { type: Number, required: true },
    securityAssetType: { type: Number, required: true },
  },
  computed: {
    stellarAssetTypeTranslated () {
      let translationId

      switch (this.asset.stellarAssetType) {
        case STELLAR_TYPES.creditAlphanum4:
          translationId = 'assets.credit-alphanum4-stellar-asset-type-lbl'
          break

        case STELLAR_TYPES.creditAlphanum12:
          translationId = 'assets.credit-alphanum12-stellar-asset-type-lbl'
          break

        case STELLAR_TYPES.native:
          translationId = 'assets.native-stellar-asset-type-lbl'
          break

        default:
          translationId = '[UNKNOWN_STELLAR_ASSET_TYPE]'
          break
      }

      return this.$options.filters.globalize(translationId)
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
  color: $col-text;
}

.asset-attributes-viewer__name {
  margin-top: 0.1rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-text;
}
</style>
