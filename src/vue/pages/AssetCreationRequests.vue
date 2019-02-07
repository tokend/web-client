<template>
  <div class="asset-creation-requests">
    <template v-if="isLoaded">
      <template v-if="requestsHistory.length">
        <drawer :is-shown.sync="isDetailsDrawerShown">
          <template v-if="isUpdateMode">
            <template slot="heading">
              {{ 'asset-form.update-token-title' | globalize }}
            </template>

            <asset-create-form
              v-if="isAssetCreateRequest"
              :asset-for-update="selectedRequest.assetCode"
              @update="loadHistory"
            />

            <asset-update-form
              v-else
              :asset-for-update="selectedRequest.assetCode"
              @update="loadHistory"
            />
          </template>
          <template v-else>
            <template slot="heading">
              {{ 'asset-request-details.title' | globalize }}
            </template>
            <asset-request-details
              :request="selectedRequest"
              @update="isUpdateMode = true"
              @cancel="cancelRequest"
            />
          </template>
        </drawer>
        <table class="app__table asset-creation-requests__table">
          <thead>
            <tr>
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
              v-for="(request, index) in requestsHistory"
              :key="index"
            >
              <td :title="request.assetCode">
                {{ request.assetCode }}
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
import AssetRequestDetails from '@/vue/pages/assets/AssetRequestDetails'

import AssetCreateForm from '@/vue/forms/AssetCreateForm'
import AssetUpdateForm from '@/vue/forms/AssetUpdateForm'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { REQUEST_STATES } from '@/js/const/request-states.const'
import { AssetCreateRequestRecord } from '@/js/records/requests/asset-create.record'

import { RecordWrapper } from '@/js/records'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'asset-creation-requests',
  components: {
    Loader,
    Drawer,
    NoDataMessage,
    AssetRequestDetails,
    AssetCreateForm,
    AssetUpdateForm,
  },
  data: _ => ({
    requestsHistory: [],
    isLoaded: false,
    isLoadingFailed: false,
    isDetailsDrawerShown: false,
    selectedIndex: -1,
    isUpdateMode: false,
    REQUEST_STATES,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),
    selectedRequest () {
      return this.requestsHistory[this.selectedIndex]
    },
    isAssetCreateRequest () {
      return this.selectedRequest instanceof AssetCreateRequestRecord
    },
  },
  async created () {
    await this.loadHistory()
  },
  methods: {
    async loadHistory () {
      try {
        const { data } = await Sdk.horizon.request.getAllForAssets({
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
          this.createRequestRecord(data)
        )

        Bus.success('asset-request-details.request-canceled-msg')
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

.asset-creation-requests__table {
  overflow-x: auto;
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
