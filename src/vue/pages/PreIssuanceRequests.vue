<template>
  <div class="pre-issuance-requests">
    <template v-if="isLoaded">
      <template v-if="requestsHistory.length">
        <div class="app__table app__table--with-shadow">
          <table>
            <thead>
              <tr>
                <!-- eslint-disable max-len -->
                <th :title="'pre-issuance-requests.asset-code-header' | globalize">
                  {{ 'pre-issuance-requests.asset-code-header' | globalize }}
                </th>
                <th :title="'pre-issuance-requests.amount-header' | globalize">
                  {{ 'pre-issuance-requests.amount-header' | globalize }}
                </th>
                <th :title="'pre-issuance-requests.request-state-header' | globalize">
                  {{ 'pre-issuance-requests.request-state-header' | globalize }}
                </th>
                <th :title="'pre-issuance-requests.created-header' | globalize">
                  {{ 'pre-issuance-requests.created-header' | globalize }}
                </th>
                <!-- eslint-enable max-len -->
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(request, index) in requestsHistory"
                :key="index"
              >
                <td :title="request.assetCode">
                  {{ request.assetCode }}
                </td>

                <td :title="request.amount | formatMoney">
                  {{ request.amount | formatMoney }}
                </td>

                <td
                  v-if="request.isApproved"
                  class="pre-issuance-requests__request-state
                         pre-issuance-requests__request-state--approved"
                  :title="'request-states.approved-state' | globalize"
                >
                  {{ 'request-states.approved-state' | globalize }}
                </td>

                <td
                  v-if="request.isPending"
                  class="pre-issuance-requests__request-state
                         pre-issuance-requests__request-state--pending"
                  :title="'request-states.pending-state' | globalize"
                >
                  {{ 'request-states.pending-state' | globalize }}
                </td>

                <td
                  v-if="request.isRejected"
                  class="pre-issuance-requests__request-state
                         pre-issuance-requests__request-state--rejected"
                  :title="'request-states.rejected-state' | globalize"
                >
                  {{ 'request-states.rejected-state' | globalize }}
                </td>

                <td
                  v-if="request.isCanceled"
                  class="pre-issuance-requests__request-state
                         pre-issuance-requests__request-state--canceled"
                  :title="'request-states.canceled-state' | globalize"
                >
                  {{ 'request-states.canceled-state' | globalize }}
                </td>

                <!-- eslint-disable max-len -->
                <td
                  v-if="request.isPermanentlyRejected"
                  class="pre-issuance-requests__request-state pre-issuance-requests__request-state--permanently-rejected"
                  :title="'request-states.permanently-rejected-state' | globalize"
                >
                  {{ 'request-states.permanently-rejected-state' | globalize }}
                </td>
                <!-- eslint-enable max-len -->

                <td :title="request.createdAt | formatCalendar">
                  {{ request.createdAt | formatCalendar }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else>
        <no-data-message
          icon-name="trending-up"
          title-id="pre-issuance-requests.no-request-history-title"
          message-id="pre-issuance-requests.no-request-history-desc"
        />
      </template>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader message-id="pre-issuance-requests.loading-msg" />
    </template>

    <template v-else>
      <p>
        {{ 'pre-issuance-requests.loading-error-msg' | globalize }}
      </p>
    </template>

    <collection-loader
      class="pre-issuance-requests__loader"
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
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'

import { Sdk } from '@/sdk'

import { RecordWrapper } from '@/js/records'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'pre-issuance-requests',
  components: {
    Loader,
    NoDataMessage,
    CollectionLoader,
  },

  data: _ => ({
    requestsHistory: [],
    isLoaded: false,
    isLoadingFailed: false,
    firstPageLoader: () => {},
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },

  created () {
    this.initFirstPageLoader()
  },

  methods: {
    initFirstPageLoader () {
      this.isDetailsDrawerShown = false
      this.isLoaded = false
      this.requestsHistory = []
      this.firstPageLoader = this.getFirstPageLoader(this.accountId)
    },

    getFirstPageLoader (accountId) {
      return function () {
        return Sdk.horizon.request.getAllForPreissuances({
          requestor: accountId,
        })
      }
    },

    setHistory (data) {
      this.requestsHistory =
        data.map(request => RecordWrapper.request(request))
      this.isLoaded = true
    },

    extendHistory (data) {
      this.requestsHistory = this.requestsHistory.concat(
        data.map(request => RecordWrapper.request(request))
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.pre-issuance-requests__request-state {
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

.pre-issuance-requests__loader {
  margin-top: .8rem;
}
</style>
