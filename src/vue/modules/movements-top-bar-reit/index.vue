<template>
  <div>
    <top-bar>
      <template v-if="isInitialized && assets.length">
        <div
          slot="main"
          class="movements-top-bar-reit__filters"
        >
          <span class="movements-top-bar-reit__filters-prefix">
            {{ 'op-pages.filters-prefix' | globalize }}
          </span>
          <select-field
            :value="asset.code"
            @input="setAssetByCode"
            class="app__select app__select--no-border"
          >
            <option
              v-for="asset in assets"
              :key="asset.code"
              :value="asset.code"
            >
              {{ asset.nameAndCode }}
            </option>
          </select-field>
        </div>
      </template>
      <div
        class="movements-top-bar-reit__actions"
        slot="extra"
      >
        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(WithdrawalFiatModule) && asset.isFiat && asset.isWithdrawable">
          <button
            v-ripple
            class="app__button-raised movements-top-bar-reit__actions-btn"
            @click="isFiatWithdrawalFormShown = true"
            :disabled="!asset.isFiat && !asset.isWithdrawable"
            :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isWithdrawable) |
              globalize({ asset: asset.code })
            "
          >
            <i class="mdi mdi-upload movements-top-bar-reit__btn-icon" />
            {{ 'op-pages.withdraw' | globalize }}
          </button>
        </template>

        <template
          v-if="getModule().canRenderSubmodule(WithdrawalDrawerPseudoModule)
            && asset.isCoinpayments
            && asset.isWithdrawable"
        >
          <button
            v-ripple
            class="app__button-raised movements-top-bar-reit__actions-btn"
            @click="isWithdrawalDrawerShown = true"
            :disabled="!asset.isCoinpayments && !asset.isWithdrawable"
            :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isWithdrawable) |
              globalize({ asset: asset.code })
            "
          >
            <i class="mdi mdi-upload movements-top-bar-reit__btn-icon" />
            {{ 'op-pages.withdraw' | globalize }}
          </button>
        </template>

        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(DepositFiatModule) && asset.isFiat && asset.isDepositable">
          <button
            v-ripple
            class="app__button-raised movements-top-bar-reit__actions-btn"
            @click="isFiatDepositFormShown = true"
            :disabled="!asset.isFiat && !asset.isDepositable"
            :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isDepositable) |
              globalize({ asset: asset.code })
            "
          >
            <i class="mdi mdi-download movements-top-bar-reit__btn-icon" />
            {{ 'op-pages.deposit' | globalize }}
          </button>
        </template>
        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(CoinpaymentsDepositModule) && asset.isCoinpayments">
          <button
            v-ripple
            class="app__button-raised movements-top-bar-reit__actions-btn"
            @click="isCoinpaymentsDepositFormShown = true"
            :disabled="!asset.isCoinpayments"
            :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isDepositable) |
              globalize({ asset: asset.code })
            "
          >
            <i class="mdi mdi-download movements-top-bar-reit__btn-icon" />
            {{ 'op-pages.deposit' | globalize }}
          </button>
        </template>

        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(TransferDrawerPseudoModule)">
          <button
            v-ripple
            class="app__button-raised movements-top-bar-reit__actions-btn"
            @click="isTransferDrawerShown = true"
            :disabled="!asset.isTransferable"
            :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isTransferable) |
              globalize({ asset: asset.code })
            "
          >
            <i
              class="
                mdi
                mdi-rotate-315
                mdi-transfer
                movements-top-bar-reit__btn-icon
                movements-top-bar-reit__btn-icon--rotate-315
              "
            />
            {{ 'op-pages.send' | globalize }}
          </button>
        </template>

        <template
          v-if="getModule().canRenderSubmodule(RedeemFormModule)
            && asset.isBond
            && !isOwnedAsset"
        >
          <button
            v-ripple
            class="app__button-raised movements-top-bar-reit__actions-btn"
            @click="isReedemDrawerShown = true"
            :disabled="!asset.isBond && isOwnedAsset"
            :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isBond) |
              globalize({ asset: asset.code })
            "
          >
            <i
              class="mdi mdi-wallet-giftcard movements-top-bar-reit__btn-icon"
            />
            {{ 'op-pages.redeem' | globalize }}
          </button>
        </template>
      </div>
    </top-bar>

    <!-- eslint-disable-next-line max-len -->
    <template v-if="getModule().canRenderSubmodule(WithdrawalFiatModule) && asset.isFiat">
      <drawer :is-shown.sync="isFiatWithdrawalFormShown">
        <template slot="heading">
          {{ 'withdrawal-fiat-module.form-title' | globalize }}
        </template>
        <submodule-importer
          :submodule="getModule().getSubmodule(WithdrawalFiatModule)"
          :config="withdrawalFiatConfig"
          @withdrawn="withdrawalFiatModuleWithdrawn"
        />
      </drawer>
    </template>

    <template
      v-if="getModule().canRenderSubmodule(WithdrawalDrawerPseudoModule)
        && asset.isCoinpayments
        && asset.isWithdrawable">
      <drawer :is-shown.sync="isWithdrawalDrawerShown">
        <template slot="heading">
          {{ 'withdrawal-form.withdrawal' | globalize }}
        </template>
        <submodule-importer
          :submodule="getModule().getSubmodule(WithdrawalDrawerPseudoModule)"
          @withdrawn="withdrawalFiatModuleWithdrawn"
        />
      </drawer>
    </template>

    <!-- eslint-disable-next-line max-len -->
    <template v-if="getModule().canRenderSubmodule(DepositFiatModule) && asset.isFiat && asset.isDepositable">
      <drawer :is-shown.sync="isFiatDepositFormShown">
        <template slot="heading">
          {{ 'deposit-fiat-module.form-title' | globalize }}
        </template>
        <submodule-importer
          :submodule="getModule().getSubmodule(DepositFiatModule)"
          :config="depositFiatConfig"
          @deposited="depositFiatModuleDeposited"
        />
      </drawer>
    </template>

    <!-- eslint-disable-next-line max-len -->
    <template v-if="getModule().canRenderSubmodule(CoinpaymentsDepositModule) && asset.isCoinpayments">
      <drawer :is-shown.sync="isCoinpaymentsDepositFormShown">
        <template slot="heading">
          {{ 'deposit-form.deposit-lbl' | globalize }}
        </template>
        <div>
          <p class="movements-top-bar-reit__deposit-help-msg">
            {{ 'deposit-form.how-to' | globalize }}
          </p>
          <submodule-importer
            :submodule="getModule().getSubmodule(CoinpaymentsDepositModule)"
            :asset="asset"
            :balance-id="asset.balance.id"
            :account-id="accountId"
          />
        </div>
      </drawer>
    </template>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form />
    </drawer>
    <!-- eslint-disable-next-line max-len -->
    <template v-if="getModule().canRenderSubmodule(RedeemFormModule) && asset.isBond && !isOwnedAsset">
      <drawer :is-shown.sync="isReedemDrawerShown">
        <template slot="heading">
          {{ 'redeem-form.title' | globalize }}
        </template>
        <submodule-importer
          :submodule="getModule().getSubmodule(RedeemFormModule)"
          :config="redeemConfig"
          @redeemed="redeemModuleSubmitted"
        />
      </drawer>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { types } from './store/types'
import { vuexTypes } from '@/vuex'

import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import SelectField from '@/vue/fields/SelectField'

import TransferForm from '@/vue/forms/TransferForm'

import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'
import { DepositFormPseudoModule } from '@/modules-arch/pseudo-modules/deposit-form-pseudo-module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { DepositFiatModule } from '@/vue/modules/deposit-fiat/module'
import { WithdrawalFiatModule } from '@/vue/modules/withdrawal-fiat/module'
import { RedeemFormModule } from '@/vue/modules/redeem-form/module'
import { CoinpaymentsDepositModule } from '@/vue/modules/coinpayments-deposit/module'

const EVENTS = {
  withdrawn: 'withdrawn',
  deposited: 'deposited',
  redeemed: 'redeemed',
  assetUpdated: 'asset-updated',
}

const ASSET_POLICIES_STR = {
  isDepositable: 'isDepositable',
  isWithdrawable: 'isWithdrawable',
  isTransferable: 'isTransferable',
  isBond: 'isBond',
}

export default {
  name: 'movements-top-bar-reit',
  components: {
    SelectField,
    TopBar,
    Drawer,
    TransferForm,
    SubmoduleImporter,
  },
  props: {
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
     * @property config.minAmount - min allowed amount
     * @property config.maxAmount - max allowed amount
     * @property config.decimalPoints - max allowed decimal points
     */
    config: {
      type: Object,
      required: true,
    },
  },
  data: _ => ({
    isInitialized: false,
    isTransferDrawerShown: false,
    isFiatDepositFormShown: false,
    isCoinpaymentsDepositFormShown: false,
    isReedemDrawerShown: false,
    isDepositDrawerShown: false,
    isFiatWithdrawalFormShown: false,
    isWithdrawalFormShown: false,
    isWithdrawalDrawerShown: false,
    withdrawalFiatConfig: {},
    depositFiatConfig: {},
    redeemConfig: {},
    WithdrawalDrawerPseudoModule,
    DepositFormPseudoModule,
    TransferDrawerPseudoModule,
    DepositFiatModule,
    WithdrawalFiatModule,
    RedeemFormModule,
    CoinpaymentsDepositModule,
    asset: {},
    ASSET_POLICIES_STR,
  }),
  computed: {
    ...mapGetters('movements-top-bar-reit', {
      balances: types.balances,
      assets: types.assets,
    }),
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    isOwnedAsset () {
      return this.asset.owner.id === this.accountId
    },
  },
  watch: {
    asset: {
      deep: true,
      handler (value) {
        this.redeemConfig.defaultAssetCode = this.asset.code
        this.$emit(EVENTS.assetUpdated, value)
      },
    },
  },
  async created () {
    this.setUpConfigs()

    await this.loadBalances()
    await this.loadAssets()
    this.setDefaultAsset()
    this.isInitialized = true
  },
  methods: {
    ...mapActions('movements-top-bar-reit', {
      loadBalances: types.LOAD_BALANCES,
      loadAssets: types.LOAD_ASSETS,
    }),
    setAssetByCode (code) {
      this.asset = this.assets.find(item => item.code === code)
    },
    setDefaultAsset () {
      this.asset = this.assets[0]
    },
    withdrawalFiatModuleWithdrawn () {
      this.isFiatWithdrawalFormShown = false
      this.$emit(EVENTS.withdrawn)
    },
    depositFiatModuleDeposited () {
      this.isFiatDepositFormShown = false
      this.$emit(EVENTS.deposited)
    },
    redeemModuleSubmitted () {
      this.isReedemDrawerShown = false
      this.$emit(EVENTS.redeemed)
    },
    setUpConfigs () {
      this.withdrawalFiatConfig = {
        decimalPoints: this.config.decimalPoints,
        minAmount: this.config.minAmount,
      }
      this.depositFiatConfig = {
        horizonURL: this.config.horizonURL,
        decimalPoints: this.config.decimalPoints,
        minAmount: this.config.minAmount,
      }
      this.redeemConfig = {
        minAmount: this.config.minAmount,
        maxAmount: this.config.maxAmount,
        defaultAssetCode: null,
      }
    },
    getMessageIdForPolicy (policy) {
      let messageId = ''
      if (!this.asset[policy]) {
        if (policy === ASSET_POLICIES_STR.isDepositable) {
          messageId = 'op-pages.not-depositable-msg'
        } else if (policy === ASSET_POLICIES_STR.isWithdrawable) {
          messageId = 'op-pages.not-withdrawable-msg'
        } else if (policy === ASSET_POLICIES_STR.isTransferable) {
          messageId = 'op-pages.not-transferable-msg'
        } else if (policy === ASSET_POLICIES_STR.isBond && this.isOwnedAsset) {
          messageId = 'op-pages.not-redeemable-msg'
        }
      }
      return messageId
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.movements-top-bar-reit__actions {
  display: flex;
  justify-content: space-between;
}

.movements-top-bar-reit__actions-btn {
  margin-right: 1.2rem;

  &:last-child {
    margin-right: 0;
  }
}

.movements-top-bar-reit__actions-btn.app__button-raised {
  line-height: 1;
}

.movements-top-bar-reit__btn-icon {
  font-size: 1.8rem;
  margin-right: 0.5rem;
}

.movements-top-bar-reit__btn-icon--rotate-315 {
  transform: translateY(-0.2rem);
}

.movements-top-bar-reit__filters {
  display: inline-flex;
  align-items: center;
}

.movements-top-bar-reit__filters-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}

.movements-top-bar-reit__deposit-help-msg {
  font-size: 1.2rem;
  opacity: 0.7;
  margin-bottom: 2rem;
}
</style>
