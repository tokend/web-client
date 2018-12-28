<template>
  <div class="dashboard">
    <template v-if="isLoading">
      <loader :message="'dashboard.data-loading' | globalize" />
    </template>
    <template v-else>
      <portfolio-widget
        class="dashboard__portfolio"
        :current-asset="currentAsset"
        @asset-change="setCurrentAsset"
        @show-create-issuance-form="showCreateIssuanceForm"
        :scale="scale"
      />
      <template v-if="currentAsset">
        <div class="dashboard__chart">
          <chart
            v-if="currentAsset !== config.DEFAULT_QUOTE_ASSET"
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
    <drawer :is-shown.sync="createIssuanceFormIsShown">
      <create-issuance />
    </drawer>
  </div>
</template>

<script>
import PortfolioWidget from './Dashboard.PortfolioWidget'
import CreateIssuance from '@/vue/forms/CreateIssuanceForm'
import InfoWidget from './Dashboard.InfoWidget'
import Chart from '@/vue/common/chart/Chart'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import Loader from '@/vue/common/Loader'
import config from '@/config'
import Drawer from '@/vue/common/Drawer'

export default {
  name: 'dashboard',
  components: {
    PortfolioWidget,
    CreateIssuance,
    InfoWidget,
    Chart,
    Loader,
    Drawer
  },
  data: () => ({
    currentAsset: null,
    isLoading: false,
    createIssuanceFormIsShown: false,
    scale: 'month',
    config
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances
    ])
  },
  watch: {
    accountBalances () {
      this.setCurrentAsset()
    }
  },
  async created () {
    this.isLoading = true
    await this.loadBalances()
    this.setCurrentAsset()
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS
    }),
    setCurrentAsset (value) {
      const regExp = /\(([^)]+)\)/
      if (value) {
        this.currentAsset = regExp.exec(value)[1]
      } else {
        const keys = this.accountBalances.map(i => i.asset)
        this.currentAsset =
          keys.filter(a => a === 'ETH')[0] || keys[0] || null
      }
    },
    showCreateIssuanceForm (status) {
      this.createIssuanceFormIsShown = status
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

$custom-breakpoint: 80rem;

.dashboard {
  flex: 1;
  overflow: hidden;
}

.dashboard__chart {
  margin-bottom: 2.4rem;
  margin-top: -4rem;
}

.dashboard__activity {
  width: 100%;
}
</style>
