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
          @click="isChangeLimitsDrawerShown = true"
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
    <div class="limits__table app__table">
      <table class="app__table">
        <thead>
          <tr>
            <th>
              {{ 'limits.table-tx-type-lbl' | globalize }}
            </th>
            <th>
              {{ 'limits.table-daily-limit-lbl' | globalize }}
            </th>
            <th>
              {{ 'limits.table-weekly-limit-lbl' | globalize }}
            </th>
            <th>
              {{ 'limits.table-monthly-limit-lbl' | globalize }}
            </th>
            <th>
              {{ 'limits.table-annual-limit-lbl' | globalize }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in selectedLimitsList"
            :key="`limits-table-row-${i}-${selectedAsset}`">
            <td>
              {{ OPERATION_TYPES_TRANSLATION_ID[item.statsOpType] | globalize }}
            </td>
            <td>
              <!-- eslint-disable-next-line -->
              <span :class="{ 'limits__table-item--inactive': !item.dailySpent }">
                {{ item.dailySpent || 'limits.not-set-lbl' | globalize }}
              </span>
              /
              <span :class="{ 'limits__table-item--inactive': !item.dailyOut }">
                {{ item.dailyOut || 'limits.not-set-lbl' | globalize }}
              </span>
            </td>
            <td>
              <!-- eslint-disable-next-line -->
              <span :class="{ 'limits__table-item--inactive': !item.weeklySpent }">
                {{ item.weeklySpent || 'limits.not-set-lbl' | globalize }}
              </span>
              /
              <!-- eslint-disable-next-line -->
              <span :class="{ 'limits__table-item--inactive': !item.weeklyOut }">
                {{ item.weeklyOut || 'limits.not-set-lbl' | globalize }}
              </span>
            </td>
            <td>
              <!-- eslint-disable-next-line -->
              <span :class="{ 'limits__table-item--inactive': !item.monthlySpent }">
                {{ item.monthlySpent || 'limits.not-set-lbl' | globalize }}
              </span>
              /
              <!-- eslint-disable-next-line -->
              <span :class="{ 'limits__table-item--inactive': !item.monthlyOut }">
                {{ item.monthlyOut || 'limits.not-set-lbl' | globalize }}
              </span>
            </td>
            <td>
              <!-- eslint-disable-next-line -->
              <span :class="{ 'limits__table-item--inactive': !item.annualSpent }">
                {{ item.annualSpent || 'limits.not-set-lbl' | globalize }}
              </span>
              /
              <!-- eslint-disable-next-line -->
              <span :class="{ 'limits__table-item--inactive': !item.annualOut }">
                {{ item.annualOut || 'limits.not-set-lbl' | globalize }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <drawer :is-shown.sync="isChangeLimitsDrawerShown">
      <template slot="heading">
        {{ 'limits.change-limits-form-heading' | globalize }}
      </template>
      <change-limits-form @cancel="isChangeLimitsDrawerShown = false" />
    </drawer>
  </div>
</template>

<script>
import SelectField from '../fields/SelectField'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import ChangeLimitsForm from '@/vue/forms/ChangeLimitsForm'
import { Sdk } from '@/sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { ACCOUNT_TYPES, STATS_OPERATION_TYPES } from '@tokend/js-sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { LimitsRecord } from '@/js/records/entities/limits.record'

const ACTUAL_STATS_OPERATION_TYPES = {
  deposit: STATS_OPERATION_TYPES.deposit,
  withdraw: STATS_OPERATION_TYPES.withdraw,
  paymentOut: STATS_OPERATION_TYPES.paymentOut,
}

const OPERATION_TYPES_TRANSLATION_ID = {
  [ACTUAL_STATS_OPERATION_TYPES.deposit]: 'limits.op-type-deposit',
  [ACTUAL_STATS_OPERATION_TYPES.withdraw]: 'limits.op-type-withdraw',
  [ACTUAL_STATS_OPERATION_TYPES.paymentOut]: 'limits.op-type-payment-out',
}

export default {
  name: 'limits',
  components: {
    SelectField,
    Drawer,
    TopBar,
    ChangeLimitsForm,
  },
  data: () => ({
    selectedAsset: '',
    isChangeLimitsDrawerShown: false,
    vueRoutes,
    ACCOUNT_TYPES,
    accountLimits: [],
    selectedLimits: [],
    formattedAccountLimits: {},
    isAccountLimitsLoading: false,
    OPERATION_TYPES_TRANSLATION_ID,
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
              return { ...acc, withdrawal: new LimitsRecord(item) }
            }
            if (item.limit.statsOpType === STATS_OPERATION_TYPES.deposit) {
              return { ...acc, deposit: new LimitsRecord(item) }
            }
            return acc
          }, {})
        if (!formattedLimits[assetCode].payment) {
          formattedLimits[assetCode].payment = new LimitsRecord({}, {
            statsOpType: STATS_OPERATION_TYPES.paymentOut,
          })
        }
        if (!formattedLimits[assetCode].withdrawal) {
          formattedLimits[assetCode].withdrawal = new LimitsRecord({}, {
            statsOpType: STATS_OPERATION_TYPES.withdraw,
          })
        }
        if (!formattedLimits[assetCode].deposit) {
          formattedLimits[assetCode].deposit = new LimitsRecord({}, {
            statsOpType: STATS_OPERATION_TYPES.deposit,
          })
        }
      })
      this.formattedAccountLimits = formattedLimits
    },
  },
}
</script>

<style lang="scss" scoped>
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

.limits__table-item--inactive {
  color: rgba($col-text, .3);
}

</style>
