<template>
  <div class="limits-request-details-viewer">
    <div
      v-if="request.isApproved"
      class="limits-request-details-viewer__request-state
             limits-request-details-viewer__request-state--approved"
    >
      <p class="limits-request-details-viewer__request-state-content">
        {{ 'limits-request-details-viewer.approved-msg' | globalize }}
      </p>
    </div>
    <div
      v-else-if="request.isPending"
      class="limits-request-details-viewer__request-state
             limits-request-details-viewer__request-state--pending"
    >
      <p class="limits-request-details-viewer__request-state-content">
        {{ 'limits-request-details-viewer.pending-msg' | globalize }}
      </p>
    </div>

    <div
      v-else-if="request.isRejected"
      class="limits-request-details-viewer__request-state
             limits-request-details-viewer__request-state--rejected"
    >
      <p class="limits-request-details-viewer__request-state-content">
        {{ 'limits-request-details-viewer.rejected-msg' | globalize }}
      </p>
    </div>

    <div
      v-else-if="request.isCanceled"
      class="limits-request-details-viewer__request-state
             limits-request-details-viewer__request-state--canceled"
    >
      <p class="limits-request-details-viewer__request-state-content">
        {{ 'request-messages.canceled-msg' | globalize }}
      </p>
    </div>

    <div
      v-else-if="request.isPermanentlyRejected"
      class="limits-request-details-viewer__request-state
             limits-request-details-viewer__request-state--permanently-rejected"
    >
      <p class="limits-request-details-viewer__request-state-content">
        <!-- eslint-disable-next-line max-len -->
        {{ 'request-messages.permanently-rejected-outgoing-msg' | globalize({ reason: request.rejectReason }) }}
      </p>
    </div>
    <div class="app__table limits-request-details-viewer__table">
      <table>
        <tbody>
          <tr>
            <td>
              <!-- eslint-disable-next-line -->
              {{ 'limits-requests-table-renderer.table-request-type-lbl' | globalize }}
            </td>
            <!-- eslint-disable-next-line -->
            <td :title="LIMITS_REQUEST_TYPE_TRANSLATION_ID[request.limitsRequestType] | globalize">
              <!-- eslint-disable-next-line -->
              {{ LIMITS_REQUEST_TYPE_TRANSLATION_ID[request.limitsRequestType] | globalize }}
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line -->
              {{ 'limits-request-details-viewer.table-daily-limit-lbl' | globalize }}
            </td>
            <td>
              <template
                v-if="request.limits.dailyOut">
                {{ request.limits.dailyOut }} {{ request.asset }}
              </template>
              <template v-else>
                {{ 'limits-request-details-viewer.not-set-lbl' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line -->
              {{ 'limits-request-details-viewer.table-weekly-limit-lbl' | globalize }}
            </td>
            <td>
              <template
                v-if="request.limits.weeklyOut">
                {{ request.limits.weeklyOut }} {{ request.asset }}
              </template>
              <template v-else>
                {{ 'limits-request-details-viewer.not-set-lbl' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line -->
              {{ 'limits-request-details-viewer.table-monthly-limit-lbl' | globalize }}
            </td>
            <td>
              <template
                v-if="request.limits.monthlyOut">
                {{ request.limits.monthlyOut }} {{ request.asset }}
              </template>
              <template v-else>
                {{ 'limits-request-details-viewer.not-set-lbl' | globalize }}
              </template>
            </td>
          </tr>
          <tr>
            <td>
              <!-- eslint-disable-next-line -->
              {{ 'limits-request-details-viewer.table-annual-limit-lbl' | globalize }}
            </td>
            <td>
              <template
                v-if="request.limits.annualOut">
                {{ request.limits.annualOut }} {{ request.asset }}
              </template>
              <template v-else>
                {{ 'limits-request-details-viewer.not-set-lbl' | globalize }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="limits-request-details-viewer__buttons">
      <button
        class="app__button-raised limits-request-details-viewer__upload-btn"
        :disabled="!request.isRejected"
        @click="$emit(EVENTS.upload)"
      >
        {{ 'limits-request-details-viewer.upload-documents-btn' | globalize }}
      </button>
    </div>
  </div>
</template>

<script>

import { LimitsUpdateRequestRecord } from '@/js/records/requests/limits-update.record'

import {
  LIMITS_REQUEST_TYPE,
} from '@/js/const/limits.const'

const LIMITS_REQUEST_TYPE_TRANSLATION_ID = Object.freeze({
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
    LIMITS_REQUEST_TYPE_TRANSLATION_ID,
  }),
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";
  .limits-request-details-viewer__request-state {
    min-height: 6.4rem;
    width: 100%;
    margin-top: 2rem;
    display: none;

    .limits-request-details-viewer__request-state-content {
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

  .limits-request-details-viewer__table {
    margin-top: 2rem;

    tr td:last-child {
      text-align: right;
    }
  }

  .limits-request-details-viewer__buttons {
    margin-top: 4.9rem;
    display: flex;

    button + button {
      margin-left: auto;
    }
  }
</style>
