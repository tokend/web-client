<template>
  <div class="dashboard">
    <template v-if="isLoading">
      <loader :message-id="'dashboard.data-loading' | globalize" />
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
            @click="createIssuanceFormIsShown = true">
            {{ 'dashboard.create-issuance-lbl' | globalize }}
          </button>
          <button
            class="app__button-raised dashboard__action"
            @click="transferFormIsShown = true">
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
        <info-widget
          class="dashboard__activity"
          :current-asset="currentAsset"
        />
      </template>
    </template>
    <drawer :is-shown.sync="showDrawer">
      <template v-if="createIssuanceFormIsShown">
        <template slot="heading">
          {{ 'issuance.issuance-form-heading' | globalize }}
        </template>
        <issuance-form @cancel="showDrawer = false" />
      </template>
      <template v-if="transferFormIsShown">
        <template slot="heading">
          {{ 'transfer-form.form-heading' | globalize }}
        </template>
        <transfer />
      </template>
    </drawer>
  </div>
</template>

<script>
import AssetSelector from '@/vue/pages/dashboard/Dashboard.AssetSelector.vue'
import IssuanceForm from '@/vue/forms/IssuanceForm'
import Transfer from '@/vue/forms/TransferForm'
import InfoWidget from '@/vue/pages/dashboard/Dashboard.InfoWidget.vue'
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
    InfoWidget,
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
    ]),
  },
  watch: {
    accountBalances () {
      this.setCurrentAsset()
    },
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
      const regExp = /\(([^)]+)\)/
      if (value) {
        this.currentAsset = regExp.exec(value)[1]
      } else {
        const keys = this.accountBalances.map(i => i.asset)
        this.currentAsset =
          keys.find(a => a === 'ETH') || keys[0] || null
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
}

.dashboard__actions {
  margin-top: .8rem;
  display: flex;
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
