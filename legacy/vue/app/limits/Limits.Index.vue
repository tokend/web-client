<template>
  <div class="limits">
    <template v-for="(asset, i) in Object.keys(accountBalances)">
      <md-card
        class="limits__content"
        :key="i"
      >
        <div class="limits__header">
          <h2 class="app__page-heading">
            {{ assetName(asset) }} ({{ asset }})
          </h2>
        </div>
        <md-table class="limits__table">
          <md-table-row class="limits__row">
            <md-table-head>
              {{ i18n.lim_transaction_type_title() }}
            </md-table-head>
            <md-table-head>
              {{ i18n.lim_daily() }} {{ i18n.lim_left_total() }}
            </md-table-head>
            <md-table-head>
              {{ i18n.lim_weekly() }} {{ i18n.lim_left_total() }}
            </md-table-head>
            <md-table-head>
              {{ i18n.lim_monthly() }} {{ i18n.lim_left_total() }}
            </md-table-head>
            <md-table-head>
              {{ i18n.lim_annual() }} {{ i18n.lim_left_total() }}
            </md-table-head>
          </md-table-row>
          <md-table-row
            class="limits__table-row"
            v-for="([operation, name], j) in Object.entries(limitOperations)"
            :key="j"
          >
            <md-table-cell class="limits__table-cell limits__operation-type">
              {{ operation }}
            </md-table-cell>
            <md-table-cell class="limits__table-cell">
              {{
                limits(asset)[operation].dailySpent
                  ? i18n.c(limits(asset)[operation].dailySpent)
                  : '—'
              }}
              /
              {{
                limits(asset)[operation].dailyLimit
                  ? i18n.c(limits(asset)[operation].dailyLimit)
                  : '—'
              }}
            </md-table-cell>
            <md-table-cell class="limits__table-cell">
              {{
                limits(asset)[operation].weeklySpent
                  ? i18n.c(limits(asset)[operation].weeklySpent)
                  : '—'
              }}
              /
              {{
                limits(asset)[operation].weeklyLimit
                  ? i18n.c(limits(asset)[operation].weeklyLimit)
                  : '—'
              }}
            </md-table-cell>
            <md-table-cell class="limits__table-cell">
              {{
                limits(asset)[operation].monthlySpent
                  ? i18n.c(limits(asset)[operation].monthlySpent)
                  : '—'
              }}
              /
              {{
                limits(asset)[operation].monthlyLimit
                  ? i18n.c(limits(asset)[operation].monthlyLimit)
                  : '—'
              }}
            </md-table-cell>
            <md-table-cell class="limits__table-cell">
              {{
                limits(asset)[operation].annualSpent
                  ? i18n.c(limits(asset)[operation].annualSpent)
                  : '—'
              }}
              /
              {{
                limits(asset)[operation].annualLimit
                  ? i18n.c(limits(asset)[operation].annualLimit)
                  : '—'
              }}
            </md-table-cell>
          </md-table-row>
        </md-table>
        <div class="limits__table-action-btn-outer">
          <md-button
            class="limits__table-action-btn md-primary"
            @click="showForm(asset)"
          >
            {{ i18n.lim_change_limits() }}
          </md-button>
        </div>
      </md-card>
    </template>
    <div
      class="limits__requests-list"
      v-if="accountTypeI !== ACCOUNT_TYPES.notVerified"
    >
      <limits-list :list="limitsRequests" />
    </div>
    <modal
      v-if="showDialog"
      @close-request="showDialog = false"
      max-width="30rem"
    >
      <limits-manager
        :limits="selectedLimits"
        :asset="asset"
        @close-request="showDialog = false"
      />
    </modal>
  </div>
</template>

<script>
import FormMixin from '../../common/mixins/form.mixin'
import LimitsManager from './Limits.Manager'
import LimitsList from './Limits.List'
import Modal from '../common/Modal'

import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'
import get from 'lodash/get'

import { RecordFactory } from '../../../js/records/factory'
import { vuexTypes } from '../../../vuex/types'
import { i18n } from '../../../js/i18n/index'
import { mapGetters, mapActions } from 'vuex'

import {
  STATS_OPERATION_TYPES,
  ACCOUNT_TYPES,
  LIMIT_OPS_STR
} from '../../../js/const/const'

export default {
  name: 'limits-index',
  components: {
    LimitsManager,
    LimitsList,
    Modal
  },
  mixins: [FormMixin],
  data: _ => ({
    showDialog: false,
    limitOp: '',
    asset: null,
    selectedLimits: null,
    i18n,
    LIMIT_OPS_STR,
    ACCOUNT_TYPES,
    STATS_OPERATION_TYPES
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountBalances,
      vuexTypes.accountTypeI,
      vuexTypes.accountLimits,
      vuexTypes.limitsRequests,
      vuexTypes.accountId
    ]),
    limitOperations () {
      const limitsOperations = cloneDeep(LIMIT_OPS_STR)
      return (this.accountTypeI !== this.ACCOUNT_TYPES.notVerified)
        ? limitsOperations
        : omit(limitsOperations, 'withdrawal')
    }
  },
  created () {
    this.loadLimits()
    this.loadRequests()
  },
  methods: {
    ...mapActions({
      loadLimits: vuexTypes.GET_ACCOUNT_LIMITS,
      loadRequests: vuexTypes.GET_LIMITS_REQUESTS
    }),
    showForm (asset) {
      this.asset = asset
      this.selectedLimits = this.limits(asset)
      this.showDialog = true
    },
    assetName (asset) {
      return get(this.accountBalances[asset], 'asset_details.details.name')
    },
    limits (tokenCode) {
      const limits = this.accountLimits
        .filter(limit => limit.tokenCode === tokenCode)
        .reduce((limits, limit) => {
          if (limit.statsOpType === STATS_OPERATION_TYPES.paymentOut) {
            return {
              ...limits,
              payment: limit
            }
          }
          if (limit.statsOpType === STATS_OPERATION_TYPES.withdraw) {
            return {
              ...limits,
              withdrawal: limit
            }
          }
          if (limit.statsOpType === STATS_OPERATION_TYPES.deposit) {
            return {
              ...limits,
              deposit: limit
            }
          }
          return limits
        }, {})
      if (!limits.payment) {
        limits.payment = RecordFactory.createLimitRecord()
      }
      if (!limits.withdrawal) {
        limits.withdrawal = RecordFactory.createLimitRecord()
      }
      if (!limits.deposit) {
        limits.deposit = RecordFactory.createLimitRecord()
      }
      return limits
    }
  }
}
</script>

<style lang="scss">
@import "../../../scss/variables";

// md-card alternative
.limits {
  flex: 1;
  width: 100%;
  margin: auto;
}

.limits__header {
  padding: 1.5rem;
}

.limits__content {
  margin-bottom: 1.5rem;
}

.limits__list {
  width: 50%;
}
.limits__op-name {
  margin-bottom: 1.6rem;
}
.limits__list-item {
  margin-bottom: 0.75rem;
}
.limits__list-item-label {
  display: inline-block;
  margin-right: 1rem;
  width: 8rem;
}

.limits__list-wrapper {
  display: flex;
}

.limits_select-field {
  width: 10rem;
}

.limits__requests-list {
  margin-top: 1rem;
}
.limits__table-action-btn-outer {
  text-align: right;
}
.limits__operation-type {
  text-transform: capitalize;
}
</style>
