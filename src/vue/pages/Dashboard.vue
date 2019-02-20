<template>
  <div class="dashboard">
    <template v-if="isLoading">
      <loader message-id="dashboard.data-loading" />
    </template>
    <template v-else>
      <div class="dashboard__toolbar">
        <asset-selector
          class="dashboard__asset-selector"
          :current-asset="currentAsset"
          @asset-change="setCurrentAsset"
          :scale="scale"
        />
        <div class="dashboard__actions">
          <button
            v-if="accountTypeI === ACCOUNT_TYPES.syndicate"
            class="app__button-raised dashboard__action"
            @click="createIssuanceFormIsShown = true"
          >
            <i class="mdi mdi-plus dashboard__plus-icon" />
            {{ 'dashboard.create-issuance-lbl' | globalize }}
          </button>
          <button
            class="app__button-raised dashboard__action"
            @click="transferFormIsShown = true"
          >
            <i class="mdi mdi-send mdi-rotate-315 dashboard__send-icon" />
            {{
              'dashboard.send-asset-lbl' | globalize({ asset: currentAsset })
            }}
          </button>
        </div>
      </div>
      <template v-if="currentAsset">
        <div
          v-if="currentAsset !== config.DEFAULT_QUOTE_ASSET"
          class="dashboard__chart"
        >
          <chart
            :base-asset="currentAsset"
            :quote-asset="config.DEFAULT_QUOTE_ASSET"
          />
        </div>
        <div class="dashboard__activity">
          <movements-history-module
            v-if="currentAsset"
            :asset-code="currentAsset"
            :config="{ horizonURL: config.HORIZON_SERVER }"
            :wallet="wallet"
          />
        </div>
      </template>
    </template>
    <drawer :is-shown.sync="showDrawer">
      <template v-if="createIssuanceFormIsShown">
        <template slot="heading">
          {{ 'issuance.issuance-form-heading' | globalize }}
        </template>
        <issuance-form @close="showDrawer = false" />
      </template>
      <template v-if="transferFormIsShown">
        <template slot="heading">
          {{ 'transfer-form.form-heading' | globalize }}
        </template>
        <transfer :asset-to-transfer="currentAsset" />
      </template>
    </drawer>
  </div>
</template>

<script>
import MovementsHistoryModule from '@modules/movements-history'

import AssetSelector from '@/vue/pages/dashboard/Dashboard.AssetSelector.vue'
import IssuanceForm from '@/vue/forms/IssuanceForm'
import Transfer from '@/vue/forms/TransferForm'
import Chart from '@/vue/common/chart/Chart'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import Loader from '@/vue/common/Loader'
import config from '@/config'
import Drawer from '@/vue/common/Drawer'
import { ACCOUNT_TYPES } from '@tokend/js-sdk'

export default {
  name: 'dashboard',
  components: {
    AssetSelector,
    IssuanceForm,
    Transfer,
    MovementsHistoryModule,
    Chart,
    Loader,
    Drawer,
  },
  data: () => ({
    currentAsset: null,
    isLoading: false,
    createIssuanceFormIsShown: false,
    transferFormIsShown: false,
    showDrawer: false,
    scale: 'month',
    config,
    ACCOUNT_TYPES,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.accountTypeI,
      vuexTypes.wallet,
    ]),
  },
  watch: {
    showDrawer (status) {
      if (!status) {
        this.createIssuanceFormIsShown = false
        this.transferFormIsShown = false
      }
    },
    createIssuanceFormIsShown (status) {
      this.showDrawer = status
    },
    transferFormIsShown (status) {
      this.showDrawer = status
    },
  },
  async created () {
    this.isLoading = true
    await this.loadBalances()
    this.setCurrentAsset()
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    setCurrentAsset (value) {
      if (value) {
        this.currentAsset = value.code
      } else {
        const keys = this.accountBalances.map(i => i.asset)
        this.currentAsset =
          keys.find(a => a === 'ETH') || keys[0] || ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.dashboard {
  flex: 1;
}

.dashboard__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: -1rem;

  @include respond-to($small) {
    flex-direction: column-reverse;
  }
}

.dashboard__actions {
  display: flex;
  margin: 1.8rem 1rem 1rem;
}

.dashboard__plus-icon,
.dashboard__send-icon {
  font-size: 1.6rem;
  margin-right: 0.5rem;
}

.dashboard__send-icon {
  margin-top: -0.6rem;
}

.dashboard__asset-selector {
  margin: 1rem;
}

.dashboard__action {
  &:not(:first-child) {
    margin-left: .8rem;
  }
}

.dashboard__chart {
  margin-top: -4rem;
}

.dashboard__activity {
  width: 100%;
  margin-top: 2.4rem;
  overflow-x: auto;
}
</style>
