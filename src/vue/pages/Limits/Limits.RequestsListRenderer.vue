<template>
  <div class="limits-requests-list-renderer">
    <div
      v-if="!isLoading && !isLoadingFailed && requests.length"
      class="limits-requests-list-renderer__table
            app__table
            app__table--with-shadow"
    >
      <table>
        <thead>
          <tr>
            <th>
              {{ 'limits-requests-table-renderer.table-date-lbl' | globalize }}
            </th>
            <th>
              <!-- eslint-disable-next-line -->
              {{ 'limits-requests-table-renderer.table-request-type-lbl' | globalize }}
            </th>
            <th>
              {{ 'limits-requests-table-renderer.table-state-lbl' | globalize }}
            </th>
            <th>
              {{ 'limits-requests-table-renderer.table-asset-lbl' | globalize }}
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(request, i) in requests"
            :request="request"
            :key="i">
            <td :title="request.updatedAt | formatDate">
              {{ request.updatedAt | formatDate }}
            </td>
            <!-- eslint-disable-next-line -->
            <td :title="LIMITS_REQUEST_TYPE_TRANSLATION_ID[request.limitsRequestType] | globalize">
              <!-- eslint-disable-next-line -->
              {{ LIMITS_REQUEST_TYPE_TRANSLATION_ID[request.limitsRequestType] | globalize }}
            </td>
            <!-- eslint-disable-next-line -->
            <td :title="LIMITS_REQUEST_STATES_STR_TRANSLATION_ID[request.state] | globalize">
              <!-- eslint-disable-next-line -->
              {{ LIMITS_REQUEST_STATES_STR_TRANSLATION_ID[request.state] | globalize }}
            </td>
            <td :title="request.asset">
              {{ request.asset }}
            </td>
            <td class="limits-requests-list-renderer__show-details-cell">
              <a
                class="request-details-btn
                  limits-requests-list-renderer__show-details-btn"
                @click="showRequestDetails (request)"
              >
                {{ 'limits-requests-table-renderer.details-btn' | globalize }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template v-else-if="!isLoading && !isLoadingFailed && !requests.length">
      <!-- eslint-disable max-len -->
      <no-data-message
        :title="'limits-requests-table-renderer.no-requests-history' | globalize"
        :message="'limits-requests-table-renderer.here-will-requests-list' | globalize"
      />
      <!-- eslint-enable max-len -->
    </template>

    <template v-else-if="isLoading && !isLoadingFailed">
      <loader :message-id="'limits-requests-table-renderer.data-loading'" />
    </template>

    <template v-else-if="!isLoading && isLoadingFailed">
      <!-- eslint-disable max-len -->
      <no-data-message
        :title="'limits-requests-table-renderer.loading-failed' | globalize"
        :message="'limits-requests-table-renderer.loading-failed-message' | globalize"
      >
        <!-- eslint-enable max-len -->
        <button
          class="app__button-raised
                limits-requests-list-renderer__reload-requests-btn"
          @click="askRequestsReload"
        >
          {{ 'limits-requests-table-renderer.load-requests-btn' | globalize }}
        </button>
      </no-data-message>
    </template>

    <drawer :is-shown.sync="isDocumentsUploaderFormShown">
      <template slot="heading">
        <!-- eslint-disable-next-line -->
        {{ 'limits-requests-table-renderer.document-uploader-form-heading' | globalize }}
      </template>
      <limits-documents-uploader-form
        @request-uploaded="requestUploaded"
        :request="selectedRequest" />
    </drawer>

    <drawer :is-shown.sync="isDetailsDrawerShown">
      <template slot="heading">
        <!-- eslint-disable-next-line -->
        {{ 'limits-requests-table-renderer.request-details-drawer-heading' | globalize }}
      </template>
      <limits-request-details-viewer
        @upload="showDocumentUploadForm"
        :request="selectedRequest"
      />
    </drawer>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import LimitsDocumentsUploaderForm from '@/vue/forms/LimitsDocumentsUploaderForm.vue'
import LimitsRequestDetailsViewer from './Limits.RequestDetailsViewer.vue'
import Drawer from '@/vue/common/Drawer'
import {
  LIMITS_REQUEST_STATES_STR,
  LIMITS_REQUEST_TYPE,
} from '@/js/const/limits.const'

const EVENTS = Object.freeze({
  requestsReloadAsk: 'requests-reload-ask',
})

const LIMITS_REQUEST_STATES_STR_TRANSLATION_ID = Object.freeze({
  [LIMITS_REQUEST_STATES_STR.pending]: 'limits-requests-table-renderer.request-state-pending',
  [LIMITS_REQUEST_STATES_STR.cancelled]: 'limits-requests-table-renderer.request-state-cancelled',
  [LIMITS_REQUEST_STATES_STR.approved]: 'limits-requests-table-renderer.request-state-approved',
  [LIMITS_REQUEST_STATES_STR.rejected]: 'limits-requests-table-renderer.request-state-rejected',
  [LIMITS_REQUEST_STATES_STR.permanentlyRejected]: 'limits-requests-table-renderer.request-state-permanently-rejected',
})

const LIMITS_REQUEST_TYPE_TRANSLATION_ID = Object.freeze({
  [LIMITS_REQUEST_TYPE.initial]: 'limits-requests-table-renderer.request-type-initial',
  [LIMITS_REQUEST_TYPE.docsUploading]: 'limits-requests-table-renderer.request-type-docs-uploading',
})

export default {
  name: 'limits-requests-list-renderer',
  components: {
    Loader,
    Drawer,
    NoDataMessage,
    LimitsDocumentsUploaderForm,
    LimitsRequestDetailsViewer,
  },
  props: {
    requests: { type: Array, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
    isLoadingFailed: { type: Boolean, required: true, default: false },
  },
  data: () => ({
    LIMITS_REQUEST_STATES_STR,
    LIMITS_REQUEST_TYPE_TRANSLATION_ID,
    LIMITS_REQUEST_STATES_STR_TRANSLATION_ID,
    isDocumentsUploaderFormShown: false,
    isDetailsDrawerShown: false,
    selectedRequest: null,
  }),
  methods: {
    requestUploaded () {
      this.isDocumentsUploaderFormShown = false
      this.selectedRequest = null
      this.askRequestsReload()
    },
    askRequestsReload () {
      this.$emit(EVENTS.requestsReloadAsk)
    },
    showRequestDetails (request) {
      this.selectedRequest = request
      this.isDetailsDrawerShown = true
    },
    showDocumentUploadForm () {
      this.isDocumentsUploaderFormShown = true
      this.isDetailsDrawerShown = false
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";
.limits-requests-list-renderer__reload-requests-btn {
  margin-top: 1.6rem;
}
.limits-requests-list-renderer__table-cell-btn {
  // allows buttons to look good on mobile screens
  box-sizing: content-box;
  min-width: 13rem;
}

.limits-requests-list-renderer__upload-btn {
  margin: auto;
}

.limits-requests-list-renderer__show-details-cell {
  text-align: center;
}

.limits-requests-list-renderer__show-details-btn {
  font-size: 1.2rem;
  color: $col-primary-lighten;
  cursor: pointer;
}
</style>
