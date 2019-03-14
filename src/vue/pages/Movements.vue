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
        <!-- <button
          v-ripple
          class="app__button-raised movements__button-raised"
          @click="isWithdrawalDrawerShown = true"
        >
          <i class="mdi mdi-download movements__btn-icon" />
          {{ 'op-pages.withdrawal' | globalize }}
        </button> -->
        <button
          v-ripple
          class="app__button-raised movements__button-raised"
          @click="fiatWithdrawalFormShown = true"
        >
          <i class="mdi mdi-download movements__btn-icon" />
          {{ 'op-pages.withdrawal' | globalize }}
        </button>
        <!-- <button
          v-ripple
          class="app__button-raised movements__button-raised"
          @click="isDepositDrawerShown = true"
        >
          <i class="mdi mdi-upload movements__btn-icon" />
          {{ 'op-pages.deposit' | globalize }}
        </button> -->
        <button
          v-ripple
          class="app__button-raised movements__button-raised"
          @click="fiatDepositFormShown = true"
        >
          <i class="mdi mdi-upload movements__btn-icon" />
          {{ 'op-pages.deposit' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-raised movements__button-raised"
          @click="isTransferDrawerShown = true"
        >
          <i class="mdi mdi-rotate-315 mdi-send movements__btn-icon" />
          {{ 'op-pages.send' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-raised movements__button-raised"
          @click="isDividendDrawerShown = true"
        >
          <i class="mdi mdi-rotate-315 mdi-transfer movements__btn-icon" />
          {{ 'op-pages.dividend' | globalize }}
        </button>
      </div>
    </top-bar>

    <drawer :is-shown.sync="isWithdrawalDrawerShown">
      <template slot="heading">
        {{ 'withdrawal-form.withdrawal' | globalize }}
      </template>
      <withdrawal-form />
    </drawer>

    <drawer :is-shown.sync="isDepositDrawerShown">
      <template slot="heading">
        {{ 'deposit-form.deposit' | globalize }}
      </template>
      <deposit-form />
    </drawer>

    <drawer :is-shown.sync="fiatWithdrawalFormShown">
      <template slot="heading">
        {{ 'withdrawal-fiat-module.form-title' | globalize }}
      </template>
      <withdrawal-fiat-module
        :config="withdrawalFiatConfig"
        :wallet="wallet"
        @withdrawn="withdrawalFiatModuleWithdrawn"
      />
    </drawer>

    <drawer :is-shown.sync="fiatDepositFormShown">
      <template slot="heading">
        {{ 'deposit-fiat-module.form-title' | globalize }}
      </template>
      <deposit-fiat-module
        :config="depositFiatConfig"
        :wallet="wallet"
        @deposited="depositFiatModuleDeposited"
      />
    </drawer>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form />
    </drawer>

    <drawer :is-shown.sync="isDividendDrawerShown">
      <template slot="heading">
        {{ 'dividend-form.title' | globalize }}
      </template>
      <dividend-form-module
        :wallet="wallet"
        :config="dividendConfig"
        @transferred="dividendModuleTransferred"
      />
    </drawer>

    <movements-history-module
      v-if="asset.code"
      :asset-code="asset.code"
      :wallet="wallet"
      :config="movementsHistoryConfig"
      :key="`movements-history-state-${historyState}`"
    />

    <no-data-message
      v-else-if="isLoaded"
      icon-name="trending-up"
      title-id="op-pages.no-data-title"
      message-id="op-pages.no-data-msg"
    />

    <loader v-else message-id="op-pages.assets-loading-msg" />
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

import MovementsHistoryModule from '@modules/movements-history'
import WithdrawalFiatModule from '@modules/withdrawal-fiat'
import DepositFiatModule from '@modules/deposit-fiat'

import { Sdk } from '@/sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'

import config from '../../config'
import DividendFormModule from '@modules/dividend-form/index'

export default {
  name: 'movements-page',
  components: {
    DividendFormModule,
    SelectField,
    TopBar,
    Drawer,
    Loader,
    NoDataMessage,
    WithdrawalForm,
    DepositForm,
    TransferForm,
    MovementsHistoryModule,
    WithdrawalFiatModule,
    DepositFiatModule,
  },

  data: _ => ({
    asset: {},
    assets: [],
    isLoaded: false,
    isLoadFailed: false,
    isWithdrawalDrawerShown: false,
    isDepositDrawerShown: false,
    isTransferDrawerShown: false,
    isDividendDrawerShown: false,
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
    },
    dividendConfig: {
      decimalPoints: config.DECIMAL_POINTS,
      horizonURL: config.HORIZON_SERVER,
      minAmount: config.MIN_AMOUNT,
    },
    historyState: 0,
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
      loadAccount: vuexTypes.LOAD_ACCOUNT,
    }),

    async initAssetSelector () {
      await this.loadAssets()
      if (this.assets.length) {
        this.asset = this.assets[0]
      }
    },

    async loadAssets () {
      await this.loadAccount(this.accountId)
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets
        .map(item => new AssetRecord(item, this.balances))
        .filter(item => item.balance.id)
    },

    withdrawalFiatModuleWithdrawn () {
      this.fiatWithdrawalFormShown = false
      this.historyState++
    },

    depositFiatModuleDeposited () {
      this.fiatDepositFormShown = false
      this.historyState++
    },
    dividendModuleTransferred () {
      this.isDividendDrawerShown = false
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
