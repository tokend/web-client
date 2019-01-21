<template>
  <div class="token-creation-requests">
    <template v-if="isLoaded">
      <drawer :is-shown.sync="isDetailsDrawerShown">
        <template slot="heading">
          {{ 'requests-page.token-request-details-title' | globalize }}
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
            <td>{{ request.details.code }}</td>
            <td>{{ request.requestState }}</td>
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
import Drawer from '@/vue//common/Drawer'

import { Sdk } from '@/sdk'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'token-creation-requests',
  components: {
    Loader,
    Drawer,
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
          request.details = request.details.assetCreate ||
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
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";

.token-creation-requests__table {
  overflow-x: auto;
  box-shadow: 0 0.6rem 1rem 0 $col-table-shadow;
}

.request-details-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
  cursor: pointer;
}
</style>
