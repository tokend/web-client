<template>
  <div class="asset-details">
    <div class="asset-details__header">
      <asset-logo-dark
        :asset-code="asset.code"
        :logo-url="assetLogoUrl"
      />
      <div class="asset-details__info">
        <p class="asset-details__code">
          {{ asset.code }}
        </p>
        <p class="asset-details__name">
          {{ asset.name }}
        </p>
      </div>
    </div>
    <div class="app__table asset-details__table">
      <table>
        <tbody>
          <template v-if="asset.description">
            <tr>
              <td>
                {{ 'asset-details.description-title' | globalize }}
              </td>
              <td>
                {{ asset.description }}
              </td>
            </tr>
          </template>
          <tr v-if="asset.balance.value">
            <td>
              {{ 'asset-details.balance-title' | globalize }}
            </td>
            <td>
              {{ asset.balance | formatMoney }}
            </td>
          </tr>
          <tr v-if="asset.balance.value">
            <td>
              {{ 'asset-details.converted-balance-title' | globalize }}
            </td>
            <td>
              {{ asset.convertedBalance | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'asset-details.maximum-title' | globalize }}
            </td>
            <td>
              {{ asset.maxIssuanceAmount | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'asset-details.issued-title' | globalize }}
            </td>
            <td>
              {{ asset.issued | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'asset-details.available-title' | globalize }}
            </td>
            <td>
              {{ asset.availableForIssuance | formatMoney }}
            </td>
          </tr>
          <tr>
            <td>
              {{ 'asset-details.transferable-title' | globalize }}
            </td>
            <td>
              <template v-if="asset.isTransferable">
                {{ 'asset-details.present-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'asset-details.absent-msg' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'asset-details.withdrawable-title' | globalize }}
            </td>
            <td>
              <template v-if="asset.isWithdrawable">
                {{ 'asset-details.present-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'asset-details.absent-msg' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'asset-details.deposit-method-title' | globalize }}
            </td>
            <td>
              <template v-if="asset.isCoinpayments">
                {{ 'asset-details.coinpayments-msg' | globalize }}
              </template>

              <template v-else-if="asset.externalSystemType">
                {{ 'asset-details.default-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'asset-details.non-depositable-msg' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'assets.asset-type' | globalize }}
            </td>
            <td>
              <template v-if="asset.assetType === $kv.assetTypeKycRequired">
                {{ 'asset-details.verification-required-title' | globalize }}
              </template>

              <template v-else-if="asset.assetType === $kv.assetTypeSecurity">
                {{ 'asset-details.security-asset-title' | globalize }}
              </template>

              <template v-else>
                <!-- eslint-disable-next-line -->
                {{ 'asset-details.does-not-require-verification-title' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'asset-details.requires-kyc-title' | globalize }}
            </td>
            <td>
              <template v-if="asset.assetType === $kv.assetTypeKycRequired">
                {{ 'asset-details.present-msg' | globalize }}
              </template>

              <template v-else>
                {{ 'asset-details.absent-msg' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              {{ 'asset-details.terms-title' | globalize }}
            </td>
            <td>
              <a
                v-if="asset.termsKey"
                class="asset-details__terms"
                :href="assetTermsUrl"
              >
                {{ 'asset-details.download-terms-btn' | globalize }}
              </a>
              <p v-else>
                {{ 'asset-details.no-terms-msg' | globalize }}
              </p>
            </td>
          </tr>
          <tr v-if="asset.maturityDate">
            <td>
              {{ 'asset-details.maturity-date' | globalize }}
            </td>
            <td>
              {{ +asset.maturityDate | formatCalendar }}
            </td>
          </tr>
          <tr v-if="asset.annualReturn">
            <td v-if="ASSET_SUBTYPE.bond === asset.subtype">
              {{ 'asset-details.annual-return' | globalize }}
            </td>
            <td v-else>
              {{ 'asset-details.expected-revenue' | globalize }}
            </td>
            <td>
              {{ +asset.annualReturn }}%
            </td>
          </tr>
          <template v-if="asset.stellarAssetCode">
            <tr :title="'asset-details.stellar-asset-code-title' | globalize">
              <td>
                {{ 'asset-details.stellar-asset-code-title' | globalize }}
              </td>
              <td>
                {{ asset.stellarAssetCode }}
              </td>
            </tr>

            <tr :title="'asset-details.stellar-asset-type-title' | globalize">
              <td>
                {{ 'asset-details.stellar-asset-type-title' | globalize }}
              </td>
              <td>
                {{ stellarAssetTypeTranslated }}
              </td>
            </tr>

            <tr :title="'asset-details.stellar-withdraw-title' | globalize">
              <td>
                {{ 'asset-details.stellar-withdraw-title' | globalize }}
              </td>
              <td>
                <template v-if="asset.stellarWithdraw">
                  {{ 'asset-details.yes-msg' | globalize }}
                </template>
                <template v-else>
                  {{ 'asset-details.no-msg' | globalize }}
                </template>
              </td>
            </tr>

            <tr :title="'asset-details.stellar-deposit-title' | globalize">
              <td>
                {{ 'asset-details.stellar-deposit-title' | globalize }}
              </td>
              <td>
                <template v-if="asset.stellarDeposit">
                  {{ 'asset-details.yes-msg' | globalize }}
                </template>
                <template v-else>
                  {{ 'asset-details.no-msg' | globalize }}
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div
      v-if="showActions"
      class="asset-details__buttons"
    >
      <button
        v-ripple
        v-if="asset.owner !== accountId"
        class="asset-details__button app__button-raised"
        :disabled="asset.balance.value || isBalanceCreating"
        @click="createBalance"
      >
        <template v-if="!isExistsInUserBalances">
          {{ 'asset-details.add-balance-btn' | globalize }}
        </template>
        <template v-else>
          {{ 'asset-details.already-in-your-balance-btn' | globalize }}
        </template>
      </button>
      <button
        v-else
        v-ripple
        class="asset-details__button app__button-raised"
        @click="$emit(EVENTS.updateAsk)"
      >
        {{ 'asset-details.update-btn' | globalize }}
      </button>
    </div>
  </div>
</template>

<script>
import AssetLogoDark from '@/vue/common/assets/AssetLogoDark'

import { documentsManager } from '@/api'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { ASSET_SUBTYPE, STELLAR_TYPES } from '@/js/const/asset-subtypes.const'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

const EVENTS = {
  balanceAdded: 'balance-added',
  updateAsk: 'update-ask',
}

export default {
  name: 'asset-details',
  components: {
    AssetLogoDark,
  },
  props: {
    asset: { type: Object, required: true },
    showActions: { type: Boolean, default: true },
  },
  data: _ => ({
    isBalanceCreating: false,
    EVENTS,
    ASSET_SUBTYPE,
  }),
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      balances: vuexTypes.accountBalances,
      isAccountUnverified: vuexTypes.isAccountUnverified,
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),
    assetLogoUrl () {
      return documentsManager.getDocumentUrlByKey(this.asset.logoKey)
    },
    assetTermsUrl () {
      return documentsManager.getDocumentUrlByKey(this.asset.termsKey)
    },
    isExistsInUserBalances () {
      return !!this.balances.find(item => item.asset.code === this.asset.code)
    },
    isBalanceCreationAllowed () {
      switch (this.asset.assetType) {
        case this.kycRequiredAssetType:
          return !this.isAccountUnverified
        case this.securityAssetType:
          return this.isAccountGeneral ||
            this.isAccountUsAccredited ||
            this.isAccountCorporate
        default:
          return true
      }
    },
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
  async created () {
    await this.loadBalances()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
      createBalance: vuexTypes.CREATE_BALANCE,
    }),
    async createBalance () {
      if (!this.isBalanceCreationAllowed) {
        Bus.error('asset-details.verification-required-err')
        return
      }

      this.isBalanceCreating = true
      try {
        await this.createBalance([this.asset.code])

        this.$emit(EVENTS.balanceAdded)
        Bus.success('asset-details.balance-added-msg')
      } catch (e) {
        this.isBalanceCreating = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

$media-xsmall-height: 375px;
$media-small-height: 460px;

.asset-details__table {
  margin-top: 4rem;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
  @include respond-to-height($media-xsmall-height) {
    margin-top: 0.8rem;
  }
}

.asset-details__table tr td:last-child {
  text-align: right;
}

.asset-details__terms {
  font-size: 1.4rem;
  color: $col-primary-lighten;
  text-decoration: none;

  &:visited {
    color: $col-primary-lighten;
  }
}

.asset-details__buttons {
  margin-top: 4.9rem;
  display: flex;

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
}

.asset-details__button {
  width: 20rem;

  & + & {
    margin-left: auto;
  }
}

.asset-details__header {
  display: flex;
  align-items: center;
}

.asset-details__logo {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
}

.asset-details__info {
  margin-left: 1.8rem;
}

.asset-details__code {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-text;
}

.asset-details__name {
  margin-top: 0.1rem;
  font-size: 1.4rem;
  line-height: 1.29;
  color: $col-text;
}
</style>
