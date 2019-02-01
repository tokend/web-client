<template>
  <div class="limits">
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.limits">
          <span>{{ 'limits.explore-limits' | globalize }}</span>
        </router-link>
      </template>
      <template
        v-if="accountTypeI === ACCOUNT_TYPES.syndicate"
        slot="extra"
      >
        <button
          v-ripple
          class="app__button-raised"
          @click="isLimitsDrawerShown = true"
        >
          {{ 'limits.change-limits-bth' | globalize }}
        </button>
      </template>
    </top-bar>
    <div class="limits__asset-selector">
      <!--
        :key is a hack to ensure that the component will be updated
        after computed calculated
      -->
      <!--
        TODO: check that form-free is actual prop name wait for merge trade page
      -->
      <select-field
        v-model="selectedAsset"
        :values="accountBalancesAssetsCodes"
        :form-free="true"
        :key="`limits-asset-selector-${selectedAsset}`"
        class="limits__assets-select"
      />
    </div>

    <limits-table-renderer :limits="selectedLimitsList" />

    <drawer :is-shown.sync="isLimitsDrawerShown">
      <template slot="heading">
        {{ 'limits.limits-form-heading' | globalize }}
      </template>
      <limits-form
        @finished="isLimitsDrawerShown = false"
        :limits="selectedLimitsList"
      />
    </drawer>
  </div>
</template>

<script>
import SelectField from '../fields/SelectField'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import LimitsForm from '@/vue/forms/LimitsForm'
import LimitsTableRenderer from '@/vue/pages/Limits/Limits.TableRenderer'
import { Sdk } from '@/sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { ACCOUNT_TYPES, STATS_OPERATION_TYPES } from '@tokend/js-sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { LimitsRecord } from '@/js/records/entities/limits.record'

export default {
  name: 'limits',
  components: {
    SelectField,
    Drawer,
    TopBar,
    LimitsForm,
    LimitsTableRenderer,
  },
  data: () => ({
    selectedAsset: '',
    isLimitsDrawerShown: false,
    vueRoutes,
    ACCOUNT_TYPES,
    accountLimits: [],
    selectedLimits: [],
    formattedAccountLimits: {},
    isAccountLimitsLoading: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.accountTypeI,
      vuexTypes.accountId,
    ]),
    accountBalancesAssetsCodes () {
      return this.accountBalances.map(i => i.asset)
    },
    selectedLimitsList () {
      return this.formattedAccountLimits[this.selectedAsset]
    },
  },
  async created () {
    if (!this.accountBalances.length) await this.loadCurrentBalances()
    if (this.accountBalancesAssetsCodes.length) this.setDefaultAssetCode()
    await this.loadAccountLimits()
  },
  methods: {
    ...mapActions({
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    setDefaultAssetCode () {
      this.selectedAsset = this.accountBalancesAssetsCodes[0]
    },
    async loadAccountLimits () {
      this.isAccountLimitsLoading = true
      try {
        const response = await Sdk.horizon.account.getLimits(this.accountId)

        this.formatLimits({ limits: response.data.limits })
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isAccountLimitsLoading = false
    },
    formatLimits ({ limits }) {
      const formattedLimits = {}
      this.accountBalancesAssetsCodes.forEach(assetCode => {
        formattedLimits[assetCode] = limits
          .filter(item => item.limit.assetCode === assetCode)
          .reduce((acc, item) => {
            if (item.limit.statsOpType === STATS_OPERATION_TYPES.paymentOut) {
              return { ...acc, payment: new LimitsRecord(item) }
            }
            if (item.limit.statsOpType === STATS_OPERATION_TYPES.withdraw) {
              return { ...acc, withdraw: new LimitsRecord(item) }
            }
            if (item.limit.statsOpType === STATS_OPERATION_TYPES.deposit) {
              return { ...acc, deposit: new LimitsRecord(item) }
            }
            return acc
          }, {})
        if (!formattedLimits[assetCode].payment) {
          formattedLimits[assetCode].payment = new LimitsRecord({}, {
            statsOpType: STATS_OPERATION_TYPES.paymentOut,
            assetCode: assetCode,
          })
        }
        if (!formattedLimits[assetCode].withdraw) {
          formattedLimits[assetCode].withdraw = new LimitsRecord({}, {
            statsOpType: STATS_OPERATION_TYPES.withdraw,
            assetCode: assetCode,
          })
        }
        if (!formattedLimits[assetCode].deposit) {
          formattedLimits[assetCode].deposit = new LimitsRecord({}, {
            statsOpType: STATS_OPERATION_TYPES.deposit,
            assetCode: assetCode,
          })
        }
      })
      this.formattedAccountLimits = formattedLimits
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";

.limits {
  width: 100%;
}

.limits__asset-selector {
  margin-bottom: 1.6rem;
}

.limits__assets-select {
  display: inline-block;
  width: auto;
}

</style>
