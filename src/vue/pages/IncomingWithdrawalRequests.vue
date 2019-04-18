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
            :is-pending="isPending"
            @approve="approveRequest"
            @reject="rejectRequest"
          />
        </drawer>

        <!-- eslint-disable max-len -->
        <div
          class="app__table
                 app__table--with-shadow
                 incoming-withdrawal-requests__table"
        >
          <table>
            <thead>
              <tr>
                <th :title="'incoming-withdrawal-requests.requestor-header' | globalize">
                  {{ 'incoming-withdrawal-requests.requestor-header' | globalize }}
                </th>
                <th :title="'incoming-withdrawal-requests.amount-header' | globalize">
                  {{ 'incoming-withdrawal-requests.amount-header' | globalize }}
                </th>
                <th :title="'incoming-withdrawal-requests.request-state-header' | globalize">
                  {{ 'incoming-withdrawal-requests.request-state-header' | globalize }}
                </th>
                <!-- eslint-enable max-len -->
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(request, index) in requestsHistory"
                :key="index"
              >
                <td :title="request.requestor">
                  <email-getter :account-id="request.requestor" />
                </td>

                <td :title="request.amount | formatMoney">
                  {{ request.amount | formatMoney }}
                  {{ request.asset }}
                </td>

                <!-- eslint-disable max-len -->
                <td
                  v-if="request.isApproved"
                  class="incoming-withdrawal-requests__request-state incoming-withdrawal-requests__request-state--approved"
                  :title="'incoming-withdrawal-requests.request-approved-state' | globalize"
                >
                  {{ 'incoming-withdrawal-requests.approved-state' | globalize }}
                </td>

                <td
                  v-if="request.isPending"
                  class="incoming-withdrawal-requests__request-state incoming-withdrawal-requests__request-state--pending"
                  :title="'incoming-withdrawal-requests.request-pending-state' | globalize"
                >
                  {{ 'incoming-withdrawal-requests.pending-state' | globalize }}
                </td>

                <td
                  v-if="request.isRejected"
                  class="incoming-withdrawal-requests__request-state incoming-withdrawal-requests__request-state--rejected"
                  :title="'incoming-withdrawal-requests.request-rejected-state' | globalize"
                >
                  {{ 'incoming-withdrawal-requests.rejected-state' | globalize }}
                </td>

                <td
                  v-if="request.isPermanentlyRejected"
                  class="incoming-withdrawal-requests__request-state incoming-withdrawal-requests__request-state--permanently-rejected"
                  :title="'incoming-withdrawal-requests.request-permanently-rejected-state' | globalize"
                >
                  {{ 'incoming-withdrawal-requests.permanently-rejected-state' | globalize }}
                </td>
                <!-- eslint-enable max-len -->

                <td>
                  <a
                    class="incoming-withdrawal-requests__review-btn"
                    @click="showRequestDetails(index)"
                  >
                    {{ 'incoming-withdrawal-requests.review-btn' | globalize }}
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

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import WithdrawalRequestDetails from '@/vue/pages/withdrawals/WithdrawalRequestDetails'
import { base } from '@tokend/js-sdk'
import { Api } from '@/api'
import {
  WithdrawalDetailsRequestRecord,
} from '@/js/records/requests/withdrawal-details.record'
import EmailGetter from '@/vue/common/EmailGetter'

const HORIZON_VERSION_PREFIX = 'v3'

export default {
  name: 'incoming-withdrawal-requests',
  components: {
    Loader,
    Drawer,
    NoDataMessage,
    CollectionLoader,
    WithdrawalRequestDetails,
    EmailGetter,
  },

  data: _ => ({
    requestsHistory: [],
    isHistoryLoaded: false,
    isLoadingFailed: false,
    isPending: false,
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

  created () {
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
        const endpoint = `/${HORIZON_VERSION_PREFIX}/create_withdraw_requests`
        return Api.api.getWithSignature(endpoint, {
          filter: {
            reviewer: accountId,
          },
          include: ['request_details'],
        })
      }
    },

    async setHistory (data) {
      this.requestsHistory = await this.changeRequestHistoryRequest(data)
      this.isHistoryLoaded = true
    },

    async extendHistory (data) {
      this.requestsHistory = await this.requestsHistory.concat(
        await this.changeRequestHistoryRequest(data)
      )
    },

    async changeRequestHistoryRequest (data) {
      return Promise.all(
        data
          .map(request => new WithdrawalDetailsRequestRecord(request))
          .map(async request => {
            request.asset = await this.getAssetFromBalanceId(request)
            return request
          })
      )
    },

    async getAssetFromBalanceId (request) {
      const { _rawResponse: token } = await Api.api
        .get(`balances/${request.balanceId}/asset`)
      return token.data.code
    },

    showRequestDetails (index) {
      this.selectedIndex = index
      this.isDetailsDrawerShown = true
    },

    async approveRequest () {
      this.isPending = true
      try {
        const action = base.xdr.ReviewRequestOpAction.approve().value
        await this.reviewWithdraw({ action }, this.selectedRequest)
        await this.rewriteWithdrawalRequest()

        Bus.success('incoming-withdrawal-requests.request-approved-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isPending = false
    },

    async rejectRequest (rejectReason) {
      this.isPending = true
      try {
        const action = base.xdr.ReviewRequestOpAction.permanentReject().value
        await this.reviewWithdraw(
          { action, reason: rejectReason },
          this.selectedRequest
        )
        await this.rewriteWithdrawalRequest()

        Bus.success('incoming-withdrawal-requests.request-rejected-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isPending = false
    },

    async reviewWithdraw ({ action, reason = '' }, ...requests) {
      const operations = requests.map(function (item) {
        const opts = {
          requestID: item.id,
          requestHash: item.hash,
          requestType: item.requestTypeI,
          reviewDetails: {
            tasksToAdd: 0,
            tasksToRemove: item.pendingTasks,
            externalDetails: {},
          },
          action,
          reason,
        }
        return base.ReviewRequestBuilder.reviewWithdrawRequest({
          ...opts,
          requestDetails: JSON.stringify(opts.reviewDetails),
        })
      })
      await Api.api.postOperations(...operations)
    },
    async rewriteWithdrawalRequest () {
      /* eslint-disable-next-line max-len */
      const endpoint = `/${HORIZON_VERSION_PREFIX}/requests/${this.selectedRequest.id}`
      const { data } = await Api.api.getWithSignature(endpoint, {
        filter: {
          reviewer: this.accountId,
        },
        include: ['request_details'],
      })
      let withdraw = new WithdrawalDetailsRequestRecord(data)
      withdraw.asset = await this.getAssetFromBalanceId(withdraw)

      this.requestsHistory.splice(this.selectedIndex, 1, withdraw)
    },
  },
}
</script>

<style lang="scss">
  .incoming-withdrawal-requests__asset-list {
    width: fit-content;
  }

  .incoming-withdrawal-requests__table {
    margin-top: 2.1rem;

    tr td:last-child {
      width: 3rem;
      text-align: right;
    }

    .incoming-withdrawal-requests__request-state {
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
  }

  .incoming-withdrawal-requests__review-btn {
    font-size: 1.2rem;
    color: $col-primary-lighten;
    cursor: pointer;
  }

  .incoming-withdrawal-requests__loader {
    margin-top: .8rem;
  }
</style>
