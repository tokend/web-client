<template>
  <div class="fund-creation-requests">
    <template v-if="isLoaded">
      <template v-if="requestsHistory.length">
        <drawer :is-shown.sync="isDetailsDrawerShown">
          <template v-if="isUpdateMode">
            <template slot="heading">
              {{ 'fund-creation-requests.update-fund-title' | globalize }}
            </template>
            <!--
              TODO: add ability to update fund, when fund form is ready
              to do it
            -->
          </template>

          <template v-else>
            <template slot="heading">
              {{ 'fund-creation-requests.details-title' | globalize }}
            </template>
            <fund-request-details
              :request="selectedRequest"
              @update-ask="isUpdateMode = true"
              @cancel-ask="cancelRequest"
            />
          </template>
        </drawer>

        <!--
          :key is a hack to ensure that the component will be updated
          after computed calculated
        -->
        <!-- eslint-disable max-len -->
        <select-field
          v-model="filters.baseAsset"
          :values="fundAssetCodes"
          :key="filters.baseAsset"
          class="fund-creation-requests__asset-list app__select app__select--no-border"
        />
        <!-- eslint-enable max-len -->

        <div class="fund-creation-requests__table-wrp">
          <table class="app__table fund-creation-requests__table">
            <thead>
              <tr>
                <!-- eslint-disable max-len -->
                <th :title="'fund-creation-requests.fund-name-header' | globalize">
                  {{ 'fund-creation-requests.fund-name-header' | globalize }}
                </th>
                <th :title="'fund-creation-requests.asset-code-header' | globalize">
                  {{ 'fund-creation-requests.asset-code-header' | globalize }}
                </th>
                <th :title="'fund-creation-requests.request-state-header' | globalize">
                  {{ 'fund-creation-requests.request-state-header' | globalize }}
                </th>
                <th :title="'fund-creation-requests.created-header' | globalize">
                  {{ 'fund-creation-requests.created-header' | globalize }}
                </th>
                <th :title="'fund-creation-requests.last-updated-header' | globalize">
                  {{ 'fund-creation-requests.last-updated-header' | globalize }}
                </th>
                <!-- eslint-enable max-len -->
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(request, index) in filteredRequests"
                :key="index"
              >
                <td :title="request.name">
                  {{ request.name }}
                </td>

                <td :title="request.baseAsset">
                  {{ request.baseAsset }}
                </td>

                <td
                  v-if="request.isApproved"
                  class="request-state request-state--approved"
                  :title="'request-states.request-approved-state' | globalize"
                >
                  {{ 'request-states.approved-state' | globalize }}
                </td>

                <td
                  v-if="request.isPending"
                  class="request-state request-state--pending"
                  :title="'request-states.request-pending-state' | globalize"
                >
                  {{ 'request-states.pending-state' | globalize }}
                </td>

                <td
                  v-if="request.isRejected"
                  class="request-state request-state--rejected"
                  :title="'request-states.request-rejected-state' | globalize"
                >
                  {{ 'request-states.rejected-state' | globalize }}
                </td>

                <td
                  v-if="request.isCanceled"
                  class="request-state request-state--canceled"
                  :title="'request-states.request-canceled-state' | globalize"
                >
                  {{ 'request-states.canceled-state' | globalize }}
                </td>
                <!-- eslint-disable max-len -->

                <td
                  v-if="request.isPermanentlyRejected"
                  class="request-state request-state--permanently-rejected"
                  :title="'request-states.request-permanently-rejected-state' | globalize"
                >
                  {{ 'request-states.permanently-rejected-state' | globalize }}
                </td>
                <!-- eslint-enable max-len -->

                <td :title="request.createdAt | formatCalendar">
                  {{ request.createdAt | formatCalendar }}
                </td>
                <td :title="request.updatedAt | formatCalendar">
                  {{ request.updatedAt | formatCalendar }}
                </td>
                <td>
                  <a
                    class="request-details-btn"
                    @click="showRequestDetails(index)"
                  >
                    {{ 'fund-creation-requests.details-btn' | globalize }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else>
        <!-- eslint-disable max-len -->
        <no-data-message
          icon-name="trending-up"
          :msg-title="'fund-creation-requests.no-request-history-title' | globalize"
          :msg-message="'fund-creation-requests.no-request-history-desc' | globalize"
        />
        <!-- eslint-enable max-len -->
      </template>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader :message-id="'fund-creation-requests.loading-msg'" />
    </template>

    <template v-else>
      <p>
        {{ 'fund-creation-requests.loading-error-msg' | globalize }}
      </p>
    </template>

    <collection-loader
      class="fund-creation-requests__loader"
      v-show="requestsHistory.length"
      :first-page-loader="getHistory"
      @first-page-load="setHistory"
      @next-page-load="extendHistory"
      @error="isLoadingFailed = true"
    />
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'
import SelectField from '@/vue/fields/SelectField'

import FundRequestDetails from '@/vue/pages/funds/FundRequestDetails'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { RecordWrapper } from '@/js/records'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'fund-creation-requests',
  components: {
    Loader,
    Drawer,
    NoDataMessage,
    CollectionLoader,
    SelectField,
    FundRequestDetails,
  },

  data: _ => ({
    requestsHistory: [],
    isLoaded: false,
    isLoadingFailed: false,
    isDetailsDrawerShown: false,
    selectedIndex: -1,
    isUpdateMode: false,
    filters: {
      baseAsset: '',
    },
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),

    selectedRequest () {
      return this.filteredRequests[this.selectedIndex]
    },

    fundAssetCodes () {
      return this.requestsHistory
        .map(request => request.baseAsset)
        .filter((asset, i, self) => self.indexOf(asset) === i)
    },

    filteredRequests () {
      return this.requestsHistory
        .filter(request => request.baseAsset === this.filters.baseAsset)
    },
  },

  methods: {
    async getHistory () {
      const response = await Sdk.horizon.request.getAllForSales({
        requestor: this.account.accountId,
      })

      return response
    },

    setHistory (data) {
      this.requestsHistory =
        data.map(request => RecordWrapper.request(request))

      if (this.requestsHistory.length) {
        this.filters.baseAsset = this.fundAssetCodes[0]
      }

      this.isLoaded = true
    },

    extendHistory (data) {
      this.requestsHistory = this.requestsHistory.concat(
        data.map(request => RecordWrapper.request(request))
      )
    },

    showRequestDetails (index) {
      this.selectedIndex = index
      this.isUpdateMode = false
      this.isDetailsDrawerShown = true
    },

    async cancelRequest () {
      try {
        const operation = base.SaleRequestBuilder.cancelSaleCreationRequest({
          requestID: this.selectedRequest.id,
        })
        await Sdk.horizon.transactions.submitOperations(operation)

        const { data } = await Sdk.horizon.request.get(this.selectedRequest.id)
        this.requestsHistory.splice(this.selectedIndex, 1,
          RecordWrapper.request(data)
        )

        Bus.success('fund-creation-requests.request-canceled-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.fund-creation-requests__asset-list {
  width: fit-content;
}

.fund-creation-requests__table-wrp {
  overflow-x: auto;
}

.fund-creation-requests__table {
  margin-top: 2.1rem;
  @include box-shadow();

  tr td:last-child {
    width: 3rem;
    text-align: right;
  }
}

.request-details-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
  cursor: pointer;
}

.request-state {
  padding-left: 3rem;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    width: 0.6rem;
    height: 0.6rem;
    top: 1.7rem;
    transform: translateY(-50%);
    left: 1.6rem;
    border-radius: 100%;
  }

  &--approved:before {
    background-color: $col-success;
  }

  &--pending:before {
    background-color: $col-warning;
  }

  &--rejected:before,
  &--canceled:before,
  &--permanently-rejected:before {
    background-color: $col-error;
  }
}

.fund-creation-requests__loader {
  margin-top: .8rem;
}
</style>
