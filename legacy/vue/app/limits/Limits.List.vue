<template>
  <md-card class="limits-list">
    <h2 class="app__page-heading limits-list__heading">
      {{ i18n.lim_limits_requests() }}
    </h2>
    <md-table class="limits-list__table">
      <template v-if="list.length">
        <md-table-row class="limits-list__row">
          <md-table-head>{{ i18n.lim_date() }}</md-table-head>
          <md-table-head>{{ i18n.lbl_request_type() }}</md-table-head>
          <md-table-head>{{ i18n.lim_state() }}</md-table-head>
          <md-table-head>{{ i18n.lim_asset() }}</md-table-head>
          <md-table-head>
            <!-- upload docs button -->
          </md-table-head>
        </md-table-row>
        <template v-for="(request, i) in list">
          <md-table-row
            class="limits-list__table-row"
            :key="i"
          >
            <md-table-cell class="limits-list__cell limits-list__cell--date">
              {{ i18n.d(request.createdAt) }}
            </md-table-cell>
            <md-table-cell class="limits-list__cell limits-list__cell--type">
              {{
                LIMITS_REQUEST_TYPE_STR[
                  get(request, 'details.requestType', '-')
                ]
              }}
            </md-table-cell>
            <md-table-cell class="limits-list__cell limits-list__cell--state">
              {{ getState(request.state) }}
            </md-table-cell>
            <md-table-cell class="limits-list__cell limits-list__cell--asset">
              {{ get(request, 'tokenCode', '-') }}
            </md-table-cell>
            <md-table-cell class="limits-list__cell limits-list__cell--button">
              <md-button
                :disabled="request.state !== REQUEST_STATES_STR.rejected"
                @click="viewRequest(request)"
              >
                {{ i18n.lim_upload_documents_btn() }}
              </md-button>
            </md-table-cell>
          </md-table-row>
        </template>
      </template>
      <template v-else>
        <div class="limits-list__no-requests">
          <md-icon class="md-size-4x">trending_up</md-icon>
          <h2 class="limits-list__no-requests-header">
            {{ i18n.lim_no_changing_requests() }}
          </h2>
          <p>{{ i18n.lim_no_changing_requests_desc() }}</p>
        </div>
      </template>
    </md-table>
    <div class="limits-list__more-requests-btn-outer">
      <md-button
        class="limits__more-requests-btn md-primary"
        @click="loadNext()"
      >
        {{ i18n.lbl_more() }}
      </md-button>
    </div>
    <modal
      v-if="isUploadingDocs"
      @close-request="isUploadingDocs = false"
      max-width="30rem"
    >
      <documents-uploader
        :request="selectedRequest"
        @close-request="isUploadingDocs = false"
      />
    </modal>
  </md-card>
</template>

<script>
import { i18n } from '../../../js/i18n/index'
import {
  REQUEST_STATES_STR,
  LIMITS_REQUEST_TYPE_STR
} from '../../../js/const/const'
import Modal from '../common/Modal'
import DocumentsUploader from './Limits.DocumentsUploader'
import get from 'lodash/get'
import { mapActions } from 'vuex'
import { vuexTypes } from '../../../vuex/types'

export default {
  components: {
    Modal,
    DocumentsUploader },
  props: { list: { type: Array, default () { return [] } } },
  data: _ => ({
    i18n,
    isUploadingDocs: false,
    selectedRequest: null,
    REQUEST_STATES_STR,
    LIMITS_REQUEST_TYPE_STR
  }),
  methods: {
    get,
    ...mapActions({
      loadNext: vuexTypes.NEXT_LIMITS_REQUESTS
    }),
    viewRequest (request) {
      this.selectedRequest = request
      this.isUploadingDocs = true
    },
    getState (state) {
      if (state === REQUEST_STATES_STR.permanentlyRejected) {
        return REQUEST_STATES_STR.rejected
      } else if (state === REQUEST_STATES_STR.rejected) {
        return i18n.lbl_requesting()
      } else {
        return state
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.limits-list__heading {
  margin: 1.5rem;
  padding-top: 1rem;
}

.limits-list__no-requests {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 1.5rem;
}

.limits-list__no-requests-header {
  margin-bottom: 0.5rem;
}

.limits-list__more-requests-btn-outer {
  text-align: center;
}
.limits-list__cell--date {
  width: 20%;
}
.limits-list__cell--type {
  width: 25%;
}
.limits-list__cell--state {
  width: 25%;
  text-transform: capitalize;
}
.limits-list__cell--asset {
  width: 20%;
}
.limits-list__cell--btn {
  width: 10%;
}
</style>
