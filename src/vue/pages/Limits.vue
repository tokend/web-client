<template>
  <div class="limits" v-if="accountBalances.length">
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
      <select-field
        v-model="selectedAsset"
        :values="accountBalancesAssetsCodes"
        :form-free="true"
        :key="`limits-asset-selector-${selectedAsset}`"
        class="limits__assets-select"
      />
    </div>

    <limits-table-renderer
      :is-loading="isLimitsLoading"
      :limits="selectedLimitsList"
    />

    <div class="limits__requests">
      <h3 class="limits__requests-title">
        {{ 'limits.requests-subheading' | globalize }}
      </h3>

      <limits-requests-list-renderer
        :is-loading="isLimitsRequestsLoading"
        :requests="limitsRequests"
        @requests-reload-ask="reloadRequests"
      />

      <div class="limits__requests-collection-loader">
        <!-- hack with key allows us to reload data -->
        <collection-loader
          :key="`request-reloader-${currentRequestsReloadingCount}`"
          :first-page-loader="loadLimitsRequests"
          :page-limit="limitsRequestsQueries.limit"
          @first-page-load="setLimitsRequests"
          @next-page-load="extendLimitsRequests"
        />
      </div>
    </div>

    <drawer :is-shown.sync="isLimitsDrawerShown">
      <template slot="heading">
        {{ 'limits.limits-form-heading' | globalize }}
      </template>
      <limits-form
        @limits-changed="limitsChanged"
        :limits="selectedLimitsList"
      />
    </drawer>
  </div>
  <div v-else>
    <no-data-message
      :title-id="'limits.no-limits-list'"
      :message-id="'limits.here-will-limits-list'"
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
import { Sdk } from '@/sdk'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'
import { ACCOUNT_TYPES, STATS_OPERATION_TYPES } from '@tokend/js-sdk'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { LimitsRecord } from '@/js/records/entities/limits.record'
import { LimitsUpdateRequestRecord } from '@/js/records/requests/limits-update.record'
import config from '@/config'
import CollectionLoader from '@/vue/common/CollectionLoader'

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
  data: () => ({
    selectedAsset: '',
    isLimitsDrawerShown: false,
    vueRoutes,
    ACCOUNT_TYPES,
    formattedAccountLimits: {},
    isLimitsLoading: false,
    isLimitsRequestsLoading: false,
    limitsRequests: [],
    limitsRequestsQueries: {
      limit: config.REQUESTS_PER_PAGE,
      order: 'desc',
    },
    currentRequestsReloadingCount: 0,
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
      return this.formattedAccountLimits[this.selectedAsset] || {}
    },
  },
  async created () {
    if (!this.accountBalances.length) await this.loadCurrentBalances()
    if (this.accountBalancesAssetsCodes.length) this.setDefaultAssetCode()
    this.loadLimits()
    this.loadLimitsRequests()
  },
  methods: {
    ...mapActions({
      loadCurrentBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    setDefaultAssetCode () {
      this.selectedAsset = this.accountBalancesAssetsCodes[0]
    },
    async loadLimits () {
      this.isLimitsLoading = true
      try {
        const response = await Sdk.horizon.account.getLimits(this.accountId)

        this.formatLimits({ limits: response.data.limits })
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.isLimitsLoading = false
    },
    async loadLimitsRequests () {
      this.isLimitsRequestsLoading = true
      const response = await Sdk.horizon.request
        .getAllForLimitsUpdates({
          ...this.limitsRequestsQueries,
          requestor: this.accountId,
        })
      return response
    },
    setLimitsRequests (data) {
      this.limitsRequests = data.map(item =>
        new LimitsUpdateRequestRecord(item)
      )
      this.isLimitsRequestsLoading = false
    },
    extendLimitsRequests (data) {
      this.limitsRequests = this.limitsRequests
        .concat(data.map(item =>
          new LimitsUpdateRequestRecord(item)
        ))
    },
    formatLimits ({ limits }) {
      const formattedLimits = {}
      this.accountBalancesAssetsCodes.forEach(assetCode => {
        if (!limits) limits = []
        formattedLimits[assetCode] = limits
          .filter(item => item.limit.assetCode === assetCode)
          .reduce((acc, item) => {
            switch (item.limit.statsOpType) {
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
      this.isLimitsDrawerShown = false
      this.reloadRequests()
    },
    reloadRequests () {
      ++this.currentRequestsReloadingCount
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
@import "~@scss/mixins";

.limits {
  width: 100%;
}

.limits__asset-selector {
  margin-bottom: 1.6rem;
}

.limits__assets-select {
  display: inline-block;
  width: auto;
  min-width: 18rem;
}

.limits__requests-title {
  color: $col-text-page-heading;
  font-size: 1.6rem;
  font-weight: bold;
  margin-top: 3.2rem;
  margin-bottom: 1.6rem;

  @include respond-to(medium) { margin-top: 2.4rem }
}

.limits__requests-collection-loader {
  display: flex;
  justify-content: center;
  margin-top: 1.6rem;
}

</style>
