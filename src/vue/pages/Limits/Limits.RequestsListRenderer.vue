<template>
  <div class="limits-table-renderer">
    <div
      v-if="!isLoading && requests.length"
      class="limits-table-renderer__table"
    >
      <table class="app__table">
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
            v-for="(item, i) in requests"
            :key="`limits-requests-table-row-${i}`"
          >
            <td>{{ item.updatedAt | formatDate }}</td>
            <!-- eslint-disable-next-line -->
            <td>{{ LIMITS_REQUEST_TYPE_TRANSLATE_ID[item.requestType] | globalize }}</td>
            <!-- eslint-disable-next-line -->
            <td>{{ LIMITS_REQUEST_STATES_STR_TRANSLATE_ID[item.state] | globalize }}</td>
            <td>{{ item.asset }}</td>
            <td>
              <button
                class="app__button-raised"
                @click="openDocumentsUploaderForm(item)"
                :disabled="!item.requestedDocs.length"
              >
                <!-- eslint-disable-next-line -->
                {{ 'limits-requests-table-renderer.upload-documents-btn' | globalize }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <template v-else-if="isLoading">
      <loader :message-id="'limits-requests-table-renderer.data-loading'" />
    </template>

    <template v-else>
      <no-data-message
        :title-id="'limits-requests-table-renderer.no-requests-history'"
        :message-id="'limits-requests-table-renderer.here-will-requests-list'"
      />
    </template>

    <drawer :is-shown.sync="isDocumentsUploaderFormShown">
      <template slot="heading">
        <!-- eslint-disable-next-line -->
        {{ 'limits-requests-table-renderer.document-uploader-form-heading' | globalize }}
      </template>
      <limits-documents-uploader-form
        @request-uploaded="requestUploaded"
        :request="selectedRequest"
      />
    </drawer>
  </div>
</template>

<script>
import Loader from '@/vue/common/Loader'
import NoDataMessage from '@/vue/common/NoDataMessage'
import LimitsDocumentsUploaderForm from '@/vue/forms/LimitsDocumentsUploaderForm.vue'
import Drawer from '@/vue/common/Drawer'
import {
  LIMITS_REQUEST_STATES_STR,
  LIMITS_REQUEST_TYPE,
} from '@/js/const/limits.const'

const LIMITS_REQUEST_STATES_STR_TRANSLATE_ID = Object.freeze({
  [LIMITS_REQUEST_STATES_STR.pending]: 'limits-requests-table-renderer.request-state-pending',
  [LIMITS_REQUEST_STATES_STR.cancelled]: 'limits-requests-table-renderer.request-state-cancelled',
  [LIMITS_REQUEST_STATES_STR.approved]: 'limits-requests-table-renderer.request-state-approved',
  [LIMITS_REQUEST_STATES_STR.rejected]: 'limits-requests-table-renderer.request-state-rejected',
  [LIMITS_REQUEST_STATES_STR.permanentlyRejected]: 'limits-requests-table-renderer.request-state-permanently-rejected',
})

const LIMITS_REQUEST_TYPE_TRANSLATE_ID = Object.freeze({
  [LIMITS_REQUEST_TYPE.initial]: 'limits-requests-table-renderer.request-type-initial',
  [LIMITS_REQUEST_TYPE.docsUploading]: 'limits-requests-table-renderer.request-type-docs-uploading',
})

const EVENTS = Object.freeze({
  requestsReloadAsk: 'requests-reload-ask',
})

export default {
  name: 'limits-requests-list-renderer',
  components: {
    Loader,
    Drawer,
    LimitsDocumentsUploaderForm,
    NoDataMessage,
  },
  props: {
    requests: { type: Array, required: true, default: () => [] },
    isLoading: { type: Boolean, required: true, default: false },
  },
  data: () => ({
    LIMITS_REQUEST_STATES_STR,
    LIMITS_REQUEST_STATES_STR_TRANSLATE_ID,
    LIMITS_REQUEST_TYPE_TRANSLATE_ID,
    isDocumentsUploaderFormShown: false,
    selectedRequest: null,
  }),
  methods: {
    requestUploaded () {
      this.isDocumentsUploaderFormShown = false
      this.selectedRequest = null
      this.$emit(EVENTS.requestsReloadAsk)
    },
    openDocumentsUploaderForm (request) {
      this.selectedRequest = request
      this.isDocumentsUploaderFormShown = true
    },
  },
}
</script>

<style lang="scss">
@import "~@scss/variables";

.limits-table-renderer__table-item--inactive {
  color: rgba($col-text, .3);
}

.limits-table-renderer__table-cell-info-icon {
  cursor: pointer;
  font-size: 1.6rem;
}

</style>
