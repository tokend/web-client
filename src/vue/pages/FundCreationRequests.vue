<template>
  <div class="fund-creation-requests">
    <template v-if="isLoaded">
      <template v-if="requestsHistory.length">
        <drawer :is-shown.sync="isDetailsDrawerShown">
          <template v-if="isUpdateMode">
            <template slot="heading">
              {{ 'fund-form.update-fund-title' | globalize }}
            </template>
            <create-fund-form
              :fund="selectedRequest"
              @update="loadHistory"
            />
          </template>

          <template v-else>
            <template slot="heading">
              {{ 'fund-request-details.title' | globalize }}
            </template>
            <fund-details
              :request="selectedRequest"
              @update="isUpdateMode = true"
              @cancel="cancelRequest"
            />
          </template>
        </drawer>

        <!--
          :key is a hack to ensure that the component will be updated
          after computed calculated
        -->
        <select-field
          v-model="filters.baseAsset"
          :values="fundAssetCodes"
          :key="filters.baseAsset"
          class="fund-creation-requests__asset-list app__select--no-border"
        />

        <table class="app__table fund-creation-requests__table">
          <thead>
            <tr>
              <th :title="'requests-page.fund-name-header' | globalize">
                {{ 'requests-page.fund-name-header' | globalize }}
              </th>
              <th :title="'requests-page.token-code-header' | globalize">
                {{ 'requests-page.token-code-header' | globalize }}
              </th>
              <th :title="'requests-page.request-state-header' | globalize">
                {{ 'requests-page.request-state-header' | globalize }}
              </th>
              <th :title="'requests-page.created-header' | globalize">
                {{ 'requests-page.created-header' | globalize }}
              </th>
              <th :title="'requests-page.last-updated-header' | globalize">
                {{ 'requests-page.last-updated-header' | globalize }}
              </th>
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
                :title="'requests-page.request-approved-msg' | globalize"
              >
                {{ 'requests-page.request-approved-msg' | globalize }}
              </td>

              <td
                v-if="request.isPending"
                class="request-state request-state--pending"
                :title="'requests-page.request-pending-msg' | globalize"
              >
                {{ 'requests-page.request-pending-msg' | globalize }}
              </td>

              <td
                v-if="request.isRejected"
                class="request-state request-state--rejected"
                :title="'requests-page.request-rejected-msg' | globalize"
              >
                {{ 'requests-page.request-rejected-msg' | globalize }}
              </td>

              <td
                v-if="request.isCanceled"
                class="request-state request-state--canceled"
                :title="'requests-page.request-canceled-msg' | globalize"
              >
                {{ 'requests-page.request-canceled-msg' | globalize }}
              </td>
              <!-- eslint-disable max-len -->

              <td
                v-if="request.isPermanentlyRejected"
                class="request-state request-state--permanently-rejected"
                :title="'requests-page.request-permanently-rejected-msg' | globalize"
              >
                {{ 'requests-page.request-permanently-rejected-msg' | globalize }}
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
                  {{ 'requests-page.details-btn' | globalize }}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-else>
        <no-data-message
          icon-name="trending-up"
          :msg-title="'requests-page.no-request-history-title' | globalize"
          :msg-message="'requests-page.no-request-history-desc' | globalize"
        />
      </template>
    </template>

    <template v-else-if="!isLoadingFailed">
      <loader :message-id="'requests-page.loading-msg'" />
    </template>

    <template v-else>
      <p>
        {{ 'requests-page.loading-error-msg' | globalize }}
      </p>
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import SelectField from '@/vue/fields/SelectField'

import FundDetails from '@/vue/common/funds/FundDetails'
import CreateFundForm from '@/vue/forms/CreateFundForm'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { REQUEST_STATES } from '@/js/const/request-states.const'
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
    SelectField,
    FundDetails,
    CreateFundForm,
  },
  data: _ => ({
    requestsHistory: [],
    isLoaded: false,
    isLoadingFailed: false,
    isDetailsDrawerShown: false,
    selectedIndex: -1,
    isUpdateMode: false,
    REQUEST_STATES,
    filters: {
      baseAsset: '',
    },
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),
    selectedRequest () {
      return this.requestsHistory[this.selectedIndex]
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
  async created () {
    await this.loadHistory()
    if (this.requestsHistory.length) {
      this.filters.baseAsset = this.fundAssetCodes[0]
    }
  },
  methods: {
    async loadHistory () {
      try {
        const { data } = await Sdk.horizon.request.getAllForSales({
          requestor: this.account.accountId,
        })
        this.requestsHistory =
          data.map(request => RecordWrapper.request(request))
        this.isLoaded = true
      } catch (e) {
        this.isLoadingFailed = true
        ErrorHandler.process(e)
      }
    },
    showRequestDetails (index) {
      this.selectedIndex = index
      this.isUpdateMode = false
      this.isDetailsDrawerShown = true
    },
    async cancelRequest () {
      try {
        const operation = base.ManageAssetBuilder.cancelAssetRequest({
          requestID: this.selectedRequest.id,
        })
        await Sdk.horizon.transactions.submitOperations(operation)

        const { data } = await Sdk.horizon.request.get(this.selectedRequest.id)
        this.requestsHistory.splice(this.selectedIndex, 1,
          RecordWrapper.request(data)
        )

        Bus.success('fund-request-details.request-canceled-msg')
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

.fund-creation-requests {
    overflow-x: auto;
}

.fund-creation-requests__asset-list {
  width: fit-content;
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
</style>
