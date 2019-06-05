<template>
  <div class="dashboard">
    <template v-if="isLoaded">
      <div class="dashboard__toolbar">
        <asset-selector
          class="dashboard__asset-selector"
          :current-asset="currentAsset"
          @asset-change="currentAsset = $event"
          :scale="scale"
        />
        <div class="dashboard__actions">
          <!-- eslint-disable-next-line max-len -->
          <template v-if="getModule().canRenderSubmodule(IssuanceFormModule)">
            <button
              class="app__button-raised dashboard__action"
              @click="createIssuanceFormIsShown = true"
            >
              <i class="mdi mdi-plus dashboard__plus-icon" />
              {{ 'dashboard.create-issuance-btn' | globalize }}
            </button>
          </template>

          <!-- eslint-disable-next-line max-len -->
          <template v-if="getModule().canRenderSubmodule(TransferDrawerPseudoModule)">
            <button
              v-if="currentAsset"
              class="app__button-raised dashboard__action"
              @click="transferFormIsShown = true"
            >
              <i class="mdi mdi-send mdi-rotate-315 dashboard__send-icon" />
              {{
                'dashboard.send-asset-lbl' | globalize({ asset: currentAsset })
              }}
            </button>
          </template>
        </div>
      </div>
      <template v-if="currentAsset">
        <div
          v-if="currentAsset !== defaultQuoteAsset &&
            getModule().getSubmodule(DashboardChartPseudoModule)
          "
          class="dashboard__chart"
        >
          <submodule-importer
            :submodule="getModule().getSubmodule(DashboardChartPseudoModule)"
            :base-asset="currentAsset"
            :quote-asset="defaultQuoteAsset"
          />
        </div>
        <div
          class="dashboard__activity"
          v-if="getModule().canRenderSubmodule(MovementsHistoryModule) &&
            currentAsset
          "
        >
          <submodule-importer
            :submodule="getModule().getSubmodule(MovementsHistoryModule)"
            :asset-code="currentAsset"
            :ref="REFS.movementsHistory"
            :latest-activity="true"
          />
        </div>
      </template>

      <drawer :is-shown.sync="showDrawer">
        <template
          v-if="createIssuanceFormIsShown &&
            getModule().canRenderSubmodule(IssuanceFormModule)"
        >
          <template slot="heading">
            {{ 'dashboard.create-issuance-title' | globalize }}
          </template>

          <submodule-importer
            :submodule="getModule().getSubmodule(IssuanceFormModule)"
            @issuance-created="showDrawer = false"
          />
        </template>

        <template v-if="transferFormIsShown">
          <template slot="heading">
            {{ 'transfer-form.form-heading' | globalize }}
          </template>
          <transfer
            @operation-submitted="closeDrawerAndUpdateList()"
            :asset-to-transfer="currentAsset"
          />
        </template>
      </drawer>
    </template>
  </div>
</template>

<script>
import AssetSelector from '@/vue/pages/dashboard/Dashboard.AssetSelector.vue'
import Transfer from '@/vue/forms/TransferForm'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import Drawer from '@/vue/common/Drawer'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import SubmoduleImporter from '@/modules-arch/submodule-importer'

import { IssuanceFormModule } from '@/vue/modules/issuance-form/module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { DashboardChartPseudoModule } from '@/modules-arch/pseudo-modules/dashboard-chart-pseudo-module'

const REFS = {
  movementsHistory: 'movements-history',
}

export default {
  name: 'dashboard',
  components: {
    AssetSelector,
    Transfer,
    Drawer,
    SubmoduleImporter,
  },
  data: () => ({
    currentAsset: null,
    isLoaded: false,
    createIssuanceFormIsShown: false,
    transferFormIsShown: false,
    showDrawer: false,
    scale: 'day',
    MovementsHistoryModule,
    IssuanceFormModule,
    TransferDrawerPseudoModule,
    DashboardChartPseudoModule,
    REFS,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.isAccountCorporate,
      vuexTypes.accountBalances,
      vuexTypes.defaultQuoteAsset,
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
    currentAsset (value) {
      this.$router.push({
        query: { asset: value },
      })
      this.loadBalances()
    },
  },
  async created () {
    await this.loadBalances()
    this.setCurrentAsset()
    this.isLoaded = true
  },
  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    setCurrentAsset (value) {
      if (value) {
        this.currentAsset = value.code
      } else {
        const keys = this.accountBalances.map(i => i.asset.code)
        this.currentAsset =
          keys.find(a => a === this.$route.query.asset) || keys[0] || ''
      }
    },

    // TODO: find a better way to execute child’s reload-list method
    updateList () {
      if (!this.$refs[REFS.movementsHistory]) {
        return
      }
      return this.$refs[REFS.movementsHistory].$children[0]
        .reloadCollectionLoader()
    },
    closeDrawerAndUpdateList () {
      this.showDrawer = false
      setTimeout(() => {
        this.updateBalancesAndList()
      }, 1000)
    },
    updateBalancesAndList () {
      return Promise.all([
        this.loadBalances(),
        this.updateList(),
      ])
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

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
    margin-left: 0.8rem;
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
