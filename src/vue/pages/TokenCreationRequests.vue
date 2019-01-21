<template>
  <div class="token-creation-requests">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDetailsDrawerShown">
        <template slot="heading">
          {{ 'token-request-details.title' | globalize }}
        </template>
        <token-request-details :request="selectedRequest" />
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
            <td>{{ request.assetDetails.code }}</td>
            <td
              class="request-state"
              :class="`request-state--${request.requestState}`"
            >
              {{ getRequestStateMessage(request.requestState) }}
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

import { Sdk } from '@/sdk'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

import { globalize } from '@/vue/filters/globalize'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'token-creation-requests',
  components: {
    Loader,
    Drawer,
    TokenRequestDetails,
  },
  data: _ => ({
    requestsHistory: [],
    isLoaded: false,
    isLoadingFailed: false,
    isDetailsDrawerShown: false,
    selectedRequest: null,
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
          request.assetDetails = request.details.assetCreate ||
            request.details.assetUpdate
          return request
        })
      } catch (error) {
        this.isFailed = true
        ErrorHandler.processWithoutFeedback(error)
      }
    },
    showRequestDetails (request) {
      this.selectedRequest = request
      this.isDetailsDrawerShown = true
    },
    getRequestStateMessage (requestState) {
      switch (requestState) {
        case REQUEST_STATES_STR.pending:
          return globalize('requests-page.request-pending-msg')
        case REQUEST_STATES_STR.approved:
          return globalize('requests-page.request-approved-msg')
        case REQUEST_STATES_STR.rejected:
          return globalize('requests-page.request-rejected-msg')
        case REQUEST_STATES_STR.cancelled:
          return globalize('requests-page.request-cancelled-msg')
        case REQUEST_STATES_STR.permanentlyRejected:
          return globalize('requests-page.request-permanently-rejected-msg')
        default:
          return ''
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
  text-transform: capitalize;

  &--approved,
  &--pending,
  &--rejected {
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
  }

  &--approved:before {
    background-color: $col-success;
  }

  &--pending:before {
    background-color: $col-warning;
  }

  &--rejected:before,
  &--cancelled:before,
  &--permanentlyRejected:before {
    background-color: $col-error;
  }
}
</style>
