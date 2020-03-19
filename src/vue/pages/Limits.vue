<template>
  <div class="limits" v-if="accountBalances.length">
    <top-bar>
      <template slot="main">
        <router-link :to="vueRoutes.limits">
          <span>{{ 'limits.explore-limits' | globalize }}</span>
        </router-link>
      </template>
      <template
        v-if="!isAccountUnverified"
        slot="extra"
      >
        <button
          v-ripple
          class="app__button-raised"
          @click="isLimitsChangeDrawerShown = true"
        >
          {{ 'limits.change-limits-bth' | globalize }}
        </button>
      </template>
    </top-bar>

    <div class="limits__requests">
      <h3 class="limits__subheading">
        {{ 'limits.requests-subheading' | globalize }}
      </h3>

      <limits-requests-list-renderer
        :is-loading="isLimitsRequestsLoading"
        :is-loading-failed="isLimitsRequestsLoadingFailed"
        :requests="limitsRequests"
        @requests-reload-ask="reloadRequests"
      />

      <div class="limits__requests-collection-loader">
        <collection-loader
          :first-page-loader="limitsRequestsLoader"
          :page-limit="limitsRequestsQueries.limit"
          @first-page-load="setLimitsRequests"
          @next-page-load="extendLimitsRequests"
        />
      </div>
    </div>

    <div class="limits__actual-limits">
      <h3 class="limits__subheading">
        {{ 'limits.actual-limits-subheading' | globalize }}
      </h3>
      <div class="limits__asset-selector">
        <!--
          :key is a hack to ensure that the component will be updated
          after computed calculated
        -->
        <select-field
          v-model="selectedAsset"
          :values="accountBalancesAssetsCodes"
          :key="`limits-asset-selector-${selectedAsset}`"
          class="limits__assets-select app__select--no-border"
        >
          <option
            v-for="assetCode in accountBalancesAssetsCodes"
            :key="assetCode"
            :value="assetCode"
          >
            {{ assetCode }}
          </option>
        </select-field>
      </div>

      <limits-table-renderer
        :is-loading="isLimitsLoading"
        :is-loading-failed="isLimitsLoadingFailed"
        :limits="selectedLimitsList"
        @limits-reload-ask="loadLimits"
      />

      <drawer :is-shown.sync="isLimitsChangeDrawerShown">
        <template slot="heading">
          {{ 'limits.limits-form-heading' | globalize }}
        </template>
        <limits-form
          @limits-changed="limitsChanged"
          :limits="selectedLimitsList"
        />
      </drawer>
    </div>
  </div>
  <div v-else>
    <no-data-message
      :title="'limits.no-limits-list' | globalize"
      :message="'limits.here-will-limits-list' | globalize"
    />
  </div>
</template>

<script>
import SelectField from '../fields/SelectField'
import Drawer from '@/vue/common/Drawer'
import TopBar from '@/vue/common/TopBar'
import LimitsForm from '@/vue/forms/LimitsForm'
import LimitsTableRenderer from '@/vue/pages/Limits/Limits.TableRenderer'
import LimitsRequestsListRenderer from '@/vue/pages/Limits/Limits.RequestsListRenderer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { ACCOUNT_TYPES, STATS_OPERATION_TYPES } from '@tokend/js-sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { LimitsRecord } from '@/js/records/entities/limits.record'
import { LimitsUpdateRequestRecord } from '@/js/records/requests/limits-update.record'
import config from '@/config'
import CollectionLoader from '@/vue/common/CollectionLoader'
import { api } from '@/api'
import UpdateList from '@/vue/mixins/update-list.mixin'

export default {
  name: 'limits',
  components: {
    SelectField,
    Drawer,
    TopBar,
    LimitsForm,
    LimitsTableRenderer,
    LimitsRequestsListRenderer,
    CollectionLoader,
    NoDataMessage,
  },

  mixins: [UpdateList],

  data: () => ({
    selectedAsset: '',
    isLimitsChangeDrawerShown: false,
    vueRoutes,
    ACCOUNT_TYPES,
    formattedAccountLimits: {},
    isLimitsLoading: false,
    isLimitsLoadingFailed: false,
    isLimitsRequestsLoading: false,
    isLimitsRequestsLoadingFailed: false,
    limitsRequests: [],
    limitsRequestsQueries: {
      limit: config.REQUESTS_PER_PAGE,
      order: 'desc',
    },
    limitsRequestsLoader: () => {},
  }),
  computed: {
    ...mapGetters({
      accountBalances: vuexTypes.accountBalances,
      accountId: vuexTypes.accountId,
      isAccountUnverified: vuexTypes.isAccountUnverified,
    }),
    accountBalancesAssetsCodes () {
      return this.accountBalances.map(i => i.asset.code)
    },
    selectedLimitsList () {
      return this.formattedAccountLimits[this.selectedAsset] || {}
    },
  },
  watch: {
    async selectedAsset (value) {
      await this.$router.push({
        query: { asset: value },
      }, () => {})
    },
  },
  async created () {
    if (!this.accountBalances.length) {
      try {
        await this.loadCurrentBalances()
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }
    }
    if (this.accountBalancesAssetsCodes.length) this.setDefaultAssetCode()
    this.loadLimits()
    this.setLimitsRequestsLoader()
    this.listenUpdateList('limits:updateList', this.reloadRequests)
  },

  beforeDestroy () {
    this.resetUpdateListEvent('limits:updateList')
  },

  methods: {
    ...mapActions({
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    async loadLimits () {
      this.isLimitsLoading = true
      this.isLimitsLoadingFailed = false
      try {
        const endpoint = `/v3/accounts/${this.accountId}`
        const { data: account } = await api.getWithSignature(endpoint, {
          include: ['limits', 'limits_with_stats'],
        })
        this.formatLimits(account.limitsWithStats)
      } catch (error) {
        this.isLimitsLoadingFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isLimitsLoading = false
    },
    async loadLimitsRequests () {
      this.isLimitsRequestsLoading = true
      this.isLimitsRequestsLoadingFailed = false
      let response = {}
      try {
        response = await api.getWithSignature('/v3/update_limits_requests', {
          filter: { requestor: this.accountId },
          page: { ...this.limitsRequestsQueries },
          include: ['request_details'],
        })
      } catch (error) {
        this.isLimitsRequestsLoadingFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
      this.isLimitsRequestsLoading = false
      return response
    },
    setLimitsRequests (data) {
      this.limitsRequests = data.map(item =>
        new LimitsUpdateRequestRecord(item)
      )
    },
    extendLimitsRequests (data) {
      this.limitsRequests = this.limitsRequests
        .concat(data.map(item =>
          new LimitsUpdateRequestRecord(item)
        ))
    },
    formatLimits (limitsWithStats) {
      const formattedLimits = {}
      this.accountBalancesAssetsCodes.forEach(assetCode => {
        if (!limitsWithStats) limitsWithStats = []
        formattedLimits[assetCode] = limitsWithStats
          .filter(item => {
            const limitAssetCode = item.limits.relationships.asset.data.id
            return limitAssetCode === assetCode
          })
          .reduce((acc, item) => {
            switch (item.limits.attributes.statsOpType) {
              case STATS_OPERATION_TYPES.paymentOut:
                return { ...acc, payment: new LimitsRecord(item) }
              case STATS_OPERATION_TYPES.withdraw:
                return { ...acc, withdraw: new LimitsRecord(item) }
              case STATS_OPERATION_TYPES.deposit:
                return { ...acc, deposit: new LimitsRecord(item) }
              default:
                return acc
            }
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
    limitsChanged () {
      this.isLimitsChangeDrawerShown = false
      this.emitUpdateList('limits:updateList')
    },
    reloadRequests () {
      this.setLimitsRequestsLoader()
    },
    setDefaultAssetCode () {
      this.selectedAsset = this.accountBalancesAssetsCodes
        .find(item => item === this.$route.query.asset) ||
        this.accountBalancesAssetsCodes[0]
    },
    setLimitsRequestsLoader () {
      this.limitsRequestsLoader = this.getLimitsRequestsLoader()
    },
    getLimitsRequestsLoader () {
      return () => {
        return this.loadLimitsRequests()
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

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

.limits__subheading {
  color: $col-text-page-heading;
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 3.2rem;
  margin-bottom: 1.6rem;

  @include respond-to(medium) { margin-top: 2.4rem; }
}

.limits__requests-collection-loader {
  display: flex;
  justify-content: center;
  margin-top: 1.6rem;
}

</style>
