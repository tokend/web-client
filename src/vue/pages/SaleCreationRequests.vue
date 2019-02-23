<template>
  <div class="sale-creation-requests">
    <template v-if="isAssetsLoaded && ownedAssets.length">
      <!-- eslint-disable max-len -->
      <select-field
        v-model="filters.baseAsset"
        :values="ownedAssets"
        key-as-value-text="nameAndCode"
        class="sale-creation-requests__asset-list app__select app__select--no-border"
      />
      <!-- eslint-enable max-len -->

      <template v-if="isHistoryLoaded">
        <template v-if="requestsHistory.length">
          <drawer :is-shown.sync="isDetailsDrawerShown">
            <template v-if="isUpdateMode">
              <template slot="heading">
                {{ 'sale-creation-requests.update-sale-title' | globalize }}
              </template>

              <create-sale-form
                :request="selectedRequest"
                @request-updated="closeDetailsDrawer() || initFirstPageLoader()"
              />
            </template>

            <template v-else>
              <template slot="heading">
                {{ 'sale-creation-requests.details-title' | globalize }}
              </template>

              <sale-request-details
                :request="selectedRequest"
                @update-ask="isUpdateMode = true"
                @cancel-ask="cancelRequest"
              />
            </template>
          </drawer>

          <div class="app__table sale-creation-requests__table">
            <table>
              <thead>
                <tr>
                  <!-- eslint-disable max-len -->
                  <th :title="'sale-creation-requests.sale-name-header' | globalize">
                    {{ 'sale-creation-requests.sale-name-header' | globalize }}
                  </th>
                  <th :title="'sale-creation-requests.asset-code-header' | globalize">
                    {{ 'sale-creation-requests.asset-code-header' | globalize }}
                  </th>
                  <th :title="'sale-creation-requests.request-state-header' | globalize">
                    {{ 'sale-creation-requests.request-state-header' | globalize }}
                  </th>
                  <th :title="'sale-creation-requests.created-header' | globalize">
                    {{ 'sale-creation-requests.created-header' | globalize }}
                  </th>
                  <th :title="'sale-creation-requests.last-updated-header' | globalize">
                    {{ 'sale-creation-requests.last-updated-header' | globalize }}
                  </th>
                  <!-- eslint-enable max-len -->
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(request, index) in requestsHistory"
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
                      {{ 'sale-creation-requests.details-btn' | globalize }}
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
            title-id="sale-creation-requests.no-request-history-title"
            message-id="sale-creation-requests.no-request-history-desc"
          />
        </template>
      </template>

      <template v-else-if="!isLoadingFailed">
        <loader :message-id="'sale-creation-requests.loading-msg'" />
      </template>

      <template v-else>
        <p>
          {{ 'sale-creation-requests.loading-error-msg' | globalize }}
        </p>
      </template>

      <collection-loader
        class="sale-creation-requests__loader"
        v-show="requestsHistory.length"
        :first-page-loader="firstPageLoader"
        @first-page-load="setHistory"
        @next-page-load="extendHistory"
        @error="isLoadingFailed = true"
      />
    </template>

    <template v-else-if="isAssetsLoaded">
      <no-data-message
        icon-name="trending-up"
        title-id="sale-creation-requests.no-owned-assets-title"
        message-id="sale-creation-requests.no-owned-assets-desc"
      />
    </template>

    <template v-else>
      <loader :message-id="'sale-creation-requests.loading-msg'" />
    </template>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import Drawer from '@/vue/common/Drawer'
import NoDataMessage from '@/vue/common/NoDataMessage'
import CollectionLoader from '@/vue/common/CollectionLoader'
import SelectField from '@/vue/fields/SelectField'

import CreateSaleForm from '@/vue/forms/CreateSaleForm'
import SaleRequestDetails from '@/vue/pages/sales/SaleRequestDetails'

import OwnedAssetsLoaderMixin from '@/vue/mixins/owned-assets-loader.mixin'

import { Sdk } from '@/sdk'
import { base } from '@tokend/js-sdk'

import { RecordWrapper } from '@/js/records'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'sale-creation-requests',
  components: {
    Loader,
    Drawer,
    NoDataMessage,
    CollectionLoader,
    SelectField,
    CreateSaleForm,
    SaleRequestDetails,
  },
  mixins: [OwnedAssetsLoaderMixin],

  data: _ => ({
    requestsHistory: [],
    isHistoryLoaded: false,
    isAssetsLoaded: false,
    isLoadingFailed: false,
    isDetailsDrawerShown: false,
    selectedIndex: -1,
    isUpdateMode: false,
    filters: {
      baseAsset: '',
    },
    firstPageLoader: () => {},
  }),
  computed: {
    selectedRequest () {
      return this.requestsHistory[this.selectedIndex]
    },
  },

  watch: {
    'filters.baseAsset.code': function (value) {
      if (value) {
        this.initFirstPageLoader()
      }
    },
  },

  async created () {
    await this.loadOwnedAssets()
    this.isAssetsLoaded = true

    if (this.ownedAssets.length) {
      this.filters.baseAsset = this.ownedAssets[0]
    }
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
      const baseAssetCode = this.filters.baseAsset.code

      return function () {
        return Sdk.horizon.request.getAllForSales({
          requestor: accountId,
          base_asset: baseAssetCode,
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

        Bus.success('sale-creation-requests.request-canceled-msg')
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

.sale-creation-requests__asset-list {
  width: fit-content;
}

.sale-creation-requests__table {
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

.sale-creation-requests__loader {
  margin-top: .8rem;
}
</style>
