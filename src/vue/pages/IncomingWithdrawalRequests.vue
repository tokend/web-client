<template>
  <div class="incoming-withdrawal-requests">
    <template v-if="isHistoryLoaded">
      <template v-if="requestsHistory.length">
        <drawer :is-shown.sync="isDetailsDrawerShown">
          <template slot="heading">
            {{ 'incoming-withdrawal-requests.details-title' | globalize }}
          </template>

          <withdrawal-request-details
            :request="selectedRequest"
            :is-pending="isRequestRejected"
            @approve="isUpdateMode = true"
            @reject="rejectRequest()"
          />
        </drawer>

        <div class="app__table incoming-withdrawal-requests__table">
          <table>
            <thead>
              <tr>
                <!-- eslint-disable max-len -->
                <th :title="'incoming-withdrawal-requests.amount-header' | globalize">
                  {{ 'incoming-withdrawal-requests.amount-header' | globalize }}
                </th>
                <th :title="'incoming-withdrawal-requests.request-state-header' | globalize">
                  {{ 'incoming-withdrawal-requests.request-state-header' | globalize }}
                </th>
                <th :title="'incoming-withdrawal-requests.requestor-header' | globalize">
                  {{ 'incoming-withdrawal-requests.requestor-header' | globalize }}
                </th>
                <!-- eslint-enable max-len -->
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(request, index) in requestsHistory"
                :key="index"
              >
                <td :title="request.amount | formatMoney">
                  {{ request.amount | formatMoney }}
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
                <!-- eslint-disable max-len -->

                <td
                  v-if="request.isPermanentlyRejected"
                  class="request-state request-state--permanently-rejected"
                  :title="'request-states.request-permanently-rejected-state' | globalize"
                >
                  {{ 'request-states.permanently-rejected-state' | globalize }}
                </td>
                <!-- eslint-enable max-len -->

                <td :title="request.requestor">
                  {{ request.requestor }}
                </td>
                <td>
                  <a
                    class="request-details-btn"
                    @click="showRequestDetails(index)"
                  >
                    {{ 'incoming-withdrawal-requests.details-btn' | globalize }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else>
        <no-data-message
          icon-name="trending-up"
          title-id="incoming-withdrawal-requests.no-request-history-title"
          message-id="incoming-withdrawal-requests.no-request-history-desc"
        />
      </template>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader :message-id="'incoming-withdrawal-requests.loading-msg'" />
    </template>

    <template v-else>
      <p>
        {{ 'incoming-withdrawal-requests.loading-error-msg' | globalize }}
      </p>
    </template>

    <collection-loader
      class="incoming-withdrawal-requests__loader"
      v-show="requestsHistory.length"
      :first-page-loader="firstPageLoader"
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

import { Sdk } from '@/sdk'

import { RecordWrapper } from '@/js/records'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import WithdrawalRequestDetails from './withdrawals/WithdrawalRequestDetails'
import { base } from '@tokend/js-sdk'

export default {
  name: 'incoming-withdrawal-requests',
  components: {
    Loader,
    Drawer,
    NoDataMessage,
    CollectionLoader,
    WithdrawalRequestDetails,
  },

  data: _ => ({
    requestsHistory: [],
    isHistoryLoaded: false,
    isLoadingFailed: false,
    isRequestRejected: false,
    isDetailsDrawerShown: false,
    selectedIndex: -1,
    firstPageLoader: () => {},
  }),
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
    selectedRequest () {
      return this.requestsHistory[this.selectedIndex]
    },
  },

  async created () {
    this.initFirstPageLoader()
  },

  methods: {
    initFirstPageLoader () {
      this.isHistoryLoaded = false
      this.requestsHistory = []
      this.firstPageLoader = this.getFirstPageLoader(this.accountId)
    },

    closeDetailsDrawer () {
      this.isDetailsDrawerShown = false
    },

    getFirstPageLoader (accountId) {
      return function () {
        return Sdk.horizon.request.getAllForWithdrawals({
          requestor: accountId,
        })
      }
    },

    setHistory (data) {
      this.requestsHistory =
          data.map(request => RecordWrapper.request(request))

      this.isHistoryLoaded = true
    },

    extendHistory (data) {
      this.requestsHistory = this.requestsHistory.concat(
        data.map(request => RecordWrapper.request(request))
      )
    },

    showRequestDetails (index) {
      this.selectedIndex = index
      this.isDetailsDrawerShown = true
    },

    async rejectRequest () {
      this.isRequestRejected = true
      try {
        const action = base.xdr.ReviewRequestOpAction.reject().value
        await this._reviewWithdraw({ action }, this.selectedRequest)
        const { data } = await Sdk.horizon.request.get(this.selectedRequest.id)
        this.requestsHistory.splice(this.selectedIndex, 1,
          RecordWrapper.request(data)
        )

        Bus.success('incoming-withdrawal-requests.request-rejected-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isRequestRejected = false
    },
    _reviewWithdraw ({ action, reason = '' }, ...requests) {
      const operations = requests.map(function (item) {
        const opts = {
          requestID: item.id,
          requestHash: item.hash,
          requestType: item.request_type_i || item.requestTypeI,
          reviewDetails: {
            tasksToAdd: 0,
            tasksToRemove: item.pendingTasks || item.pending_tasks,
            externalDetails: '{}',
          },
          action,
          reason
        }
        return base.ReviewRequestBuilder.reviewWithdrawRequest({
          ...opts,
          requestDetails: '{}',
        })
      })
      return Sdk.horizon.transactions.submitOperations(...operations)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";
  @import "~@scss/mixins";

  .incoming-withdrawal-requests__asset-list {
    width: fit-content;
  }

  .incoming-withdrawal-requests__table {
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
    &--permanently-rejected:before {
      background-color: $col-error;
    }
  }

  .incoming-withdrawal-requests__loader {
    margin-top: .8rem;
  }
</style>
