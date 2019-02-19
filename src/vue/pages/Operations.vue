<template>
  <div class="op-history">
    <top-bar v-if="!isLoadFailed">
      <div
        slot="main"
        class="op-history__filters"
      >
        <span class="op-history__filters-prefix">
          {{ 'op-pages.filters-prefix' | globalize }}
        </span>
        <select-field
          v-if="isLoaded"
          v-model="asset"
          :values="assets"
          key-as-value-text="nameAndCode"
          class="app__select app__select--no-border"
        />
      </div>
      <div
        class="op-history__actions"
        slot="extra"
      >
        <button
          v-ripple
          class="app__button-raised"
          @click="isWithdrawalDrawerShown = true"
        >
          <i class="mdi mdi-download op-history__btn-icon" />
          {{ 'op-pages.withdrawal' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-raised"
          @click="isDepositDrawerShown = true"
        >
          <i class="mdi mdi-upload op-history__btn-icon" />
          {{ 'op-pages.deposit' | globalize }}
        </button>
        <button
          v-ripple
          class="app__button-raised"
          @click="isTransferDrawerShown = true"
        >
          <i
            class="mdi mdi-send op-history__btn-icon
            op-history__btn-icon--rotate" />
          {{ 'op-pages.send' | globalize }}
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

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form />
    </drawer>

    <movements-history-module
      v-if="asset.code"
      :asset-code="asset.code"
      :wallet="wallet"
      :config="config"
    />
  </div>
</template>

<script>
import SelectField from '@/vue/fields/SelectField'
import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import OpList from '@/vue/common/OpList'

import SelectField from '@/vue/fields/SelectField'

import WithdrawalForm from '@/vue/forms/WithdrawalForm'
import DepositForm from '@/vue/forms/DepositForm'
import TransferForm from '@/vue/forms/TransferForm'

import MovementsHistoryModule from '@modules/movement-history'

import { Sdk } from '@/sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex/types'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'

import config from '../../config'

export default {
  name: 'operations-page',
  components: {
    SelectField,
    TopBar,
    Drawer,
    WithdrawalForm,
    DepositForm,
    TransferForm,
    MovementsHistoryModule,
  },

  data: _ => ({
    asset: {},
    assets: [],
    operations: [],
    isLoaded: false,
    isLoadFailed: false,
    isWithdrawalDrawerShown: false,
    isDepositDrawerShown: false,
    isTransferDrawerShown: false,
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
  }),

  computed: {
    ...mapGetters([
      vuexTypes.wallet,
      vuexTypes.account,
      vuexTypes.accountBalances,
      vuexTypes.accountId,
    ]),
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
      await this.loadAccount()
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets
        .map(item => new AssetRecord(item, this.account.balances))
        .filter(item => item.balance.id)
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.op-history__filters {
  display: inline-flex;
  align-items: center;
}

.op-history__filters-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}

.op-history__actions {
  display: flex;
  justify-content: space-between;

  button {
    margin-right: 1.2rem;
    &:last-child {
      margin-right: 0;
    }
  }
}

.op-history__btn-icon {
  display: flex;
  font-size: 1.8rem;
  margin-right: 0.5rem;

  &--rotate {
    transform: rotate(-45deg);
  }
}

.op-history__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: auto;
}

.op-history__table {
  width: 100%;
  table-layout: fixed;
  border-spacing: 0 0.6rem;
  border-color: transparent;

  .op-history__td-btn {
    text-align: right;
    width: 6.7rem;
  }

  .op-history__counterparty {
    width: 30rem;
  }

  .op-history__status {
    width: 13rem;
  }
}

.op-history__th {
  padding: 0 1.5rem 1rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 1.4rem;
  color: $col-text-secondary;
  font-weight: normal;
}

.op-history__no-transactions {
  padding: 0 1.6rem 3.2rem;
  text-align: center;

  p {
    margin-top: 1rem;
  }
}

.op-history__no-tx-icon {
  margin-right: 1.6rem;
  font-size: 6.4rem;
}

.op-history__error {
  padding: 0 1.6rem 3.2rem;
  text-align: center;
  color: $col-error;
  p {
    margin-top: 1rem;
  }
}

.op-history__error-icon {
  margin-right: 1.6rem;
  font-size: 6.4rem;
}
</style>
