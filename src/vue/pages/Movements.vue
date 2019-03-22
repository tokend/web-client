<template>
  <div class="movements">
    <top-bar v-if="!isLoadFailed">
      <template v-if="isLoaded && assets.length">
        <div
          slot="main"
          class="movements__filters"
        >
          <span class="movements__filters-prefix">
            {{ 'op-pages.filters-prefix' | globalize }}
          </span>
          <select-field
            v-model="asset"
            :values="assets"
            key-as-value-text="nameAndCode"
            class="app__select app__select--no-border"
          />
        </div>
      </template>
      <div
        class="movements__actions"
        slot="extra"
      >
        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(WithdrawalDrawerPseudoModule)">
          <button
            v-ripple
            class="app__button-raised movements__button-raised"
            @click="isWithdrawalDrawerShown = true"
          >
            <i class="mdi mdi-download movements__btn-icon" />
            {{ 'op-pages.withdrawal' | globalize }}
          </button>
        </template>

        <template v-if="getModule().canRenderSubmodule(WithdrawalFiatModule)">
          <button
            v-ripple
            class="app__button-raised movements__button-raised"
            @click="fiatWithdrawalFormShown = true"
          >
            <i class="mdi mdi-upload movements__btn-icon" />
            {{ 'op-pages.withdrawal' | globalize }}
          </button>
        </template>

        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(DepositDrawerPseudoModule)">
          <button
            v-ripple
            class="app__button-raised movements__button-raised"
            @click="isDepositDrawerShown = true"
          >
            <i class="mdi mdi-upload movements__btn-icon" />
            {{ 'op-pages.deposit' | globalize }}
          </button>
        </template>

        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(DepositFiatModule)">
          <button
            v-ripple
            class="app__button-raised movements__button-raised"
            @click="fiatDepositFormShown = true"
          >
            <i class="mdi mdi-download movements__btn-icon" />
            {{ 'op-pages.deposit' | globalize }}
          </button>
        </template>

        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(TransferDrawerPseudoModule)">
          <button
            v-ripple
            class="app__button-raised movements__button-raised"
            @click="isTransferDrawerShown = true"
          >
            <i class="mdi mdi-rotate-315 mdi-transfer movements__btn-icon" />
            {{ 'op-pages.send' | globalize }}
          </button>
        </template>

        <template v-if="getModule().canRenderSubmodule(RedeemFormModule)">
          <button
            v-ripple
            class="app__button-raised movements__button-raised"
            @click="isReedemDrawerShown = true"
          >
            <i
              class="mdi mdi-wallet-giftcard movements__btn-icon"
            />
            {{ 'op-pages.redeem' | globalize }}
          </button>
        </template>
      </div>
    </top-bar>

    <drawer :is-shown.sync="isWithdrawalDrawerShown">
      <template slot="heading">
        {{ 'withdrawal-form.withdrawal' | globalize }}
      </template>
      <withdrawal-form />
    </drawer>

    <template v-if="getModule().canRenderSubmodule(WithdrawalFiatModule)">
      <drawer :is-shown.sync="fiatWithdrawalFormShown">
        <template slot="heading">
          {{ 'withdrawal-fiat-module.form-title' | globalize }}
        </template>
        <submodule-importer
          :submodule="getModule().getSubmodule(WithdrawalFiatModule)"
          :config="withdrawalFiatConfig"
          :wallet="wallet"
          @withdrawn="withdrawalFiatModuleWithdrawn"
        />
      </drawer>
    </template>

    <drawer :is-shown.sync="isDepositDrawerShown">
      <template slot="heading">
        {{ 'deposit-form.deposit' | globalize }}
      </template>
      <deposit-form />
    </drawer>

    <template v-if="getModule().canRenderSubmodule(DepositFiatModule)">
      <drawer :is-shown.sync="fiatDepositFormShown">
        <template slot="heading">
          {{ 'deposit-fiat-module.form-title' | globalize }}
        </template>
        <submodule-importer
          :submodule="getModule().getSubmodule(DepositFiatModule)"
          :config="depositFiatConfig"
          :wallet="wallet"
          @deposited="depositFiatModuleDeposited"
        />
      </drawer>
    </template>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form />
    </drawer>

    <template v-if="getModule().canRenderSubmodule(RedeemFormModule)">
      <drawer :is-shown.sync="isReedemDrawerShown">
        <template slot="heading">
          {{ 'redeem-form.title' | globalize }}
        </template>
        <submodule-importer
          :submodule="getModule().getSubmodule(RedeemFormModule)"
          :wallet="wallet"
          :config="redeemConfig"
          @redeemed="redeemModuleSubmitted"
        />
      </drawer>
    </template>

    <template v-if="getModule().canRenderSubmodule(MovementsHistoryModule)">
      <submodule-importer
        v-if="asset.code"
        :submodule="getModule().getSubmodule(MovementsHistoryModule)"
        :asset-code="asset.code"
        :wallet="wallet"
        :config="movementsHistoryConfig"
        :key="`movements-history-state-${historyState}`"
      >
        <loader
          slot="loader"
          message-id="op-pages.assets-loading-msg"
        />
      </submodule-importer>

      <no-data-message
        v-else-if="isLoaded"
        icon-name="trending-up"
        :title="'op-pages.no-data-title' | globalize"
        :message="'op-pages.no-data-msg' | globalize"
      />

      <loader
        v-else
        message-id="op-pages.assets-loading-msg"
      />
    </template>
  </div>
</template>

<script>
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'

import SelectField from '@/vue/fields/SelectField'

import WithdrawalForm from '@/vue/forms/WithdrawalForm'
import DepositForm from '@/vue/forms/DepositForm'
import TransferForm from '@/vue/forms/TransferForm'

import { Sdk } from '@/sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'

import config from '@/config'
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'
import { DepositDrawerPseudoModule } from '@/modules-arch/pseudo-modules/deposit-drawer-pseudo-module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { DepositFiatModule } from '@/vue/modules/deposit-fiat/module'
import { WithdrawalFiatModule } from '@/vue/modules/withdrawal-fiat/module'
import { RedeemFormModule } from '@/vue/modules/redeem-form/module'

export default {
  name: 'movements-page',
  components: {
    SelectField,
    TopBar,
    Drawer,
    Loader,
    NoDataMessage,
    WithdrawalForm,
    DepositForm,
    TransferForm,
    SubmoduleImporter,
  },

  data: _ => ({
    MovementsHistoryModule,
    asset: {},
    assets: [],
    isLoaded: false,
    isLoadFailed: false,
    isWithdrawalDrawerShown: false,
    isDepositDrawerShown: false,
    isTransferDrawerShown: false,
    isReedemDrawerShown: false,
    fiatWithdrawalFormShown: false,
    fiatDepositFormShown: false,
    movementsHistoryConfig: {
      horizonURL: config.HORIZON_SERVER,
    },
    withdrawalFiatConfig: {
      horizonURL: config.HORIZON_SERVER,
      decimalPoints: config.DECIMAL_POINTS,
      minAmount: config.MIN_AMOUNT,
    },
    depositFiatConfig: {
      horizonURL: config.HORIZON_SERVER,
      decimalPoints: config.DECIMAL_POINTS,
      minAmount: config.MIN_AMOUNT,
    },
    redeemConfig: {
      horizonURL: config.HORIZON_SERVER,
      minAmount: config.MIN_AMOUNT,
      maxAmount: config.MAX_AMOUNT,
    },
    historyState: 0,
    WithdrawalDrawerPseudoModule,
    DepositDrawerPseudoModule,
    TransferDrawerPseudoModule,
    DepositFiatModule,
    WithdrawalFiatModule,
    RedeemFormModule,
  }),

  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,
      balances: vuexTypes.accountBalances,
      accountId: vuexTypes.accountId,
    }),
  },

  async created () {
    try {
      await this.initAssetSelector()
      this.isLoaded = true
    } catch (error) {
      this.isLoadFailed = true
      ErrorHandler.processWithoutFeedback(error)
    }
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async initAssetSelector () {
      await this.loadAssets()
      if (this.assets.length) {
        this.asset = this.assets[0]
      }
    },

    async loadAssets () {
      await this.loadBalances()
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets
        .map(item => new AssetRecord(item, this.balances))
        .filter(item => item.balance.id)
        .sort(
          (firstAsset, secondAsset) => secondAsset.isFiat - firstAsset.isFiat
        )
    },

    withdrawalFiatModuleWithdrawn () {
      this.fiatWithdrawalFormShown = false
      this.historyState++
    },

    depositFiatModuleDeposited () {
      this.fiatDepositFormShown = false
      this.historyState++
    },
    redeemModuleSubmitted () {
      this.isReedemDrawerShown = false
      this.historyState++
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.movements__filters {
  display: inline-flex;
  align-items: center;
}

.movements__filters-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}

.movements__actions {
  display: flex;
  justify-content: space-between;

  button {
    margin-right: 1.2rem;
    &:last-child {
      margin-right: 0;
    }
  }
}

.movements__button-raised.app__button-raised {
  line-height: 1;
}

.movements__btn-icon {
  font-size: 1.8rem;
  margin-right: 0.5rem;

  &.mdi-rotate-315 {
    transform: translateY(-0.2rem);
  }
}
</style>
