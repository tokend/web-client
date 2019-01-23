<template>
  <div class="token-creation-requests">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDetailsDrawerShown">
        <template v-if="isUpdating">
          <template slot="heading">
            {{ 'token-form.update-token-title' | globalize }}
          </template>
          <token-form
            v-if="isUpdating"
            :request="selectedRequest"
            @update="loadHistory"
          />
        </template>
        <template v-else>
          <template slot="heading">
            {{ 'token-request-details.title' | globalize }}
          </template>
          <token-request-details
            :request="selectedRequest"
            @update="updateToken"
          />
        </template>
      </drawer>
      <table class="app__table token-creation-requests__table">
        <thead>
          <tr>
            <th>
              {{ 'requests-page.token-code-header' | globalize }}
            </th>
            <th>
              {{ 'requests-page.request-state-header' | globalize }}
            </th>
            <th>
              {{ 'requests-page.created-header' | globalize }}
            </th>
            <th>
              {{ 'requests-page.last-updated-header' | globalize }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(request, i) in requestsHistory"
            :key="i"
          >
            <td>{{ request.assetCode }}</td>
            <td
              v-if="request.stateI === REQUEST_STATES.approved"
              class="request-state request-state--approved"
            >
              {{ 'requests-page.request-approved-msg' | globalize }}
            </td>
            <td
              v-if="request.stateI === REQUEST_STATES.pending"
              class="request-state request-state--pending"
            >
              {{ 'requests-page.request-pending-msg' | globalize }}
            </td>
            <td
              v-if="request.stateI === REQUEST_STATES.rejected"
              class="request-state request-state--rejected"
            >
              {{ 'requests-page.request-rejected-msg' | globalize }}
            </td>
            <td
              v-if="request.stateI === REQUEST_STATES.canceled"
              class="request-state request-state--canceled"
            >
              {{ 'requests-page.request-canceled-msg' | globalize }}
            </td>
            <td
              v-if="request.stateI === REQUEST_STATES.permanentlyRejected"
              class="request-state request-state--permanently-rejected"
            >
              {{
                'requests-page.request-permanently-rejected-msg' | globalize
              }}
            </td>
            <td>{{ request.createdAt | formatCalendar }}</td>
            <td>{{ request.updatedAt | formatCalendar }}</td>
            <td>
              <a
                class="request-details-btn"
                @click="showRequestDetails(request)"
              >
                {{ 'requests-page.details-btn' | globalize }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
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
import TokenRequestDetails from '@/vue/common/TokenRequestDetails'
import TokenForm from '@/vue/forms/TokenForm'

import { Sdk } from '@/sdk'

import { REQUEST_STATES } from '@/js/const/request-states.const'
import { AssetCreateRequestRecord } from '@/js/records/requests/asset-create.record'
import { AssetUpdateRequestRecord } from '@/js/records/requests/asset-update.record'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'token-creation-requests',
  components: {
    Loader,
    Drawer,
    TokenRequestDetails,
    TokenForm,
  },
  data: _ => ({
    requestsHistory: [],
    isLoaded: false,
    isLoadingFailed: false,
    isDetailsDrawerShown: false,
    selectedRequest: null,
    isUpdating: false,
    REQUEST_STATES,
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),
  },
  async created () {
    await this.loadHistory()
    this.isLoaded = true
  },
  methods: {
    async loadHistory () {
      try {
        const { data } = await Sdk.horizon.request.getAllForAssets({
          requestor: this.account.accountId,
        })
        this.requestsHistory = data.map(request => {
          if (request.details.assetCreate) {
            return new AssetCreateRequestRecord(request)
          } else {
            return new AssetUpdateRequestRecord(request)
          }
        })
      } catch (e) {
        this.isFailed = true
        console.error(e)
        ErrorHandler.process(e)
      }
    },
    showRequestDetails (request) {
      this.selectedRequest = request
      this.isUpdating = false
      this.isDetailsDrawerShown = true
    },
    async updateToken () {
      try {
        if (this.selectedRequest instanceof AssetUpdateRequestRecord) {
          const { data } =
            await Sdk.horizon.assets.get(this.selectedRequest.assetCode)
          this.selectedRequest = Object.assign(this.selectedRequest, {
            maxIssuanceAmount: data.maxIssuanceAmount,
          })
        }
        this.isUpdating = true
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.token-creation-requests__table {
  overflow-x: auto;
  box-shadow: 0 0.6rem 1rem 0 $col-table-shadow;

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
