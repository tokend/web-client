<template>
  <div class="asset-details">
    <div class="asset-details__header">
      <asset-logo-dark
        :asset-code="asset.code"
        :logo-url="asset.logoUrl(config.FILE_STORAGE)"
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
              {{ 'asset-details.requires-kyc-title' | globalize }}
            </td>
            <td>
              <template v-if="asset.assetType === kvAssetTypeKycRequired">
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
        class="asset-details__update-btn app__button-raised"
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
        class="asset-details__update-btn app__button-raised"
        @click="$emit(EVENTS.updateAsk)"
      >
        {{ 'asset-details.update-btn' | globalize }}
      </button>
    </div>
  </div>
</template>

<script>
import AssetLogoDark from '@/vue/common/assets/AssetLogoDark'

import config from '@/config'

import { Sdk } from '@/sdk'

import { base } from '@tokend/js-sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { ASSET_SUBTYPE } from '@/js/const/asset-subtypes.const'
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
    config,
    EVENTS,
    ASSET_SUBTYPE,
  }),
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      balances: vuexTypes.accountBalances,
      kvAssetTypeKycRequired: vuexTypes.kvAssetTypeKycRequired,
      isAccountUnverified: vuexTypes.isAccountUnverified,
    }),
    assetTermsUrl () {
      return this.asset.termsUrl(config.FILE_STORAGE)
    },
    isExistsInUserBalances () {
      return !!this.balances.find(item => item.asset === this.asset.code)
    },
    isBalanceCreationAllowed () {
      return this.asset.assetType === this.kvAssetTypeKycRequired &&
        this.isAccountUnverified
    },
  },
  async created () {
    await this.loadBalances()
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async createBalance () {
      if (this.isBalanceCreationAllowed) {
        Bus.error('asset-details.verification-required-err')
        return
      }

      this.isBalanceCreating = true
      try {
        const operation = base.Operation.manageBalance({
          destination: this.accountId,
          asset: this.asset.code,
          action: base.xdr.ManageBalanceAction.createUnique(),
        })
        await Sdk.horizon.transactions.submitOperations(operation)
        await this.loadBalances()
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
@import "~@scss/variables";
@import "~@scss/mixins";

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

  tr td:last-child {
    text-align: right;
  }
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

  button + button {
    margin-left: auto;
  }

  @include respond-to-height($media-small-height) {
    margin-top: 2.4rem;
  }
}

.asset-details__update-btn {
  width: 20rem;
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
