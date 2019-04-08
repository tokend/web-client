<template>
  <div class="limits-request-details-viewer">
    <div
      v-if="request.isApproved"
      class="request-state request-state--approved"
    >
      <p class="request-state__content">
        {{ 'limits-request-details-viewer.approved-msg' | globalize }}
      </p>
    </div>
    <div
      v-else-if="request.isPending"
      class="request-state request-state--pending"
    >
      <p class="request-state__content">
        {{ 'limits-request-details-viewer.pending-msg' | globalize }}
      </p>
    </div>

    <div
      v-else-if="request.isRejected"
      class="request-state request-state--rejected"
    >
      <p class="request-state__content">
        <!-- eslint-disable-next-line max-len -->
        {{ 'limits-request-details-viewer.rejected-msg' | globalize() }}
      </p>
    </div>

    <div
      v-else-if="request.isCanceled"
      class="request-state request-state--canceled"
    >
      <p class="request-state__content">
        {{ 'request-messages.canceled-msg' | globalize() }}
      </p>
    </div>

    <div
      v-else-if="request.isPermanentlyRejected"
      class="request-state request-state--permanently-rejected"
    >
      <p class="request-state__content">
        <!-- eslint-disable-next-line max-len -->
        {{ 'request-messages.permanently-rejected-msg' | globalize({ reason: request.rejectReason }) }}
      </p>
    </div>
    <div class="app__table limits-request-details__table">
      <table>
        <tbody>
          <tr>
            <td>
              <!-- eslint-disable-next-line -->
              {{ 'limits-requests-table-renderer.table-request-type-lbl' | globalize }}
            </td>
            <!-- eslint-disable-next-line -->
            <td :title="LIMITS_REQUEST_TYPE_TRANSLATE_ID[request.limitsRequestType] | globalize">
              <!-- eslint-disable-next-line -->
              {{ LIMITS_REQUEST_TYPE_TRANSLATE_ID[request.limitsRequestType] | globalize }}
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line -->
              {{ 'limits-request-details-viewer.table-daily-limit-lbl' | globalize }}
            </td>
            <td>
              {{ request.limits.dailyOut }} {{ request.asset }}
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line -->
              {{ 'limits-request-details-viewer.table-weekly-limit-lbl' | globalize }}
            </td>
            <td>
              {{ request.limits.weeklyOut }} {{ request.asset }}
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line -->
              {{ 'limits-request-details-viewer.table-monthly-limit-lbl' | globalize }}
            </td>
            <td>
              {{ request.limits.monthlyOut }} {{ request.asset }}
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line -->
              {{ 'limits-request-details-viewer.table-annual-limit-lbl' | globalize }}
            </td>
            <td>
              {{ request.limits.annualOut }} {{ request.asset }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="limits-request-details__buttons">
      <button
        class="app__button-raised limits-request-details__upload-btn"
        :disabled="!request.isRejected"
        @click="$emit(EVENTS.upload)"
      >
        {{ 'limits-requests-table-renderer.upload-documents-btn' | globalize }}
      </button>
    </div>
  </div>
</template>

<script>

import { LimitsUpdateRequestRecord } from '@/js/records/requests/limits-update.record'

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

const EVENTS = {
  upload: 'upload',
}

export default {
  name: 'limits-request-details-viewer',
  components: {
  },
  props: {
    request: {
      type: LimitsUpdateRequestRecord,
      required: true,
    },
  },
  data: _ => ({
    EVENTS,
    LIMITS_REQUEST_TYPE,
    LIMITS_REQUEST_STATES_STR,
    LIMITS_REQUEST_STATES_STR_TRANSLATE_ID,
    LIMITS_REQUEST_TYPE_TRANSLATE_ID,
  }),
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";
  .request-state {
    min-height: 6.4rem;
    width: 100%;
    margin-top: 2rem;
    display: none;

    .request-state__content {
      padding: 2.4rem;
      font-size: 1.3rem;
      font-weight: normal;
      color: $col-primary-txt;
    }

    @mixin apply-theme ($col-msg-background) {
      background-color: $col-msg-background;
      display: block;
    }

    &--approved { @include apply-theme($col-request-approved) }
    &--pending { @include apply-theme($col-request-pending) }
    &--rejected, &--canceled, &--permanently-rejected {
      @include apply-theme($col-request-rejected)
    }
  }

  .limits-request-details__table {
    margin-top: 2rem;

    tr td:last-child {
      text-align: right;
    }
  }

  .limits-request-details__buttons {
    margin-top: 4.9rem;
    display: flex;

    button + button {
      margin-left: auto;
    }
  }
</style>
