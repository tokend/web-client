<template>
  <div
    v-if="isLoaded"
    class="withdrawal-request-details"
  >
    <div
      v-if="request.isApproved"
      class="request-state request-state--approved"
    >
      <p class="request-state__content">
        {{ 'request-messages.approved-msg' | globalize }}
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

    <div class="app__table withdrawal-request-details__table">
      <table>
        <tbody>
          <tr>
            <td>
              {{ 'withdrawal-request-details.requestor-email' | globalize }}
            </td>
            <td>
              {{ requestorEmail }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'withdrawal-request-details.requestor-id' | globalize }}
            </td>
            <td>
              {{ request.requestor }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'withdrawal-request-details.address' | globalize }}
            </td>
            <td>
              {{ request.address }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'withdrawal-request-details.amount' | globalize }}
            </td>
            <td>
              {{ request.amount | formatMoney }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'withdrawal-request-details.fixed-fee' | globalize }}
            </td>
            <td>
              {{ request.fixedFee | formatMoney }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'withdrawal-request-details.percent-fee' | globalize }}
            </td>
            <td>
              {{ request.percentFee | formatMoney }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'withdrawal-request-details.total-fee' | globalize }}
            </td>
            <td>
              {{ (+request.percentFee + +request.fixedFee) | formatMoney }}
            </td>
          </tr>

          <tr>
            <td>
              {{ 'withdrawal-request-details.created' | globalize }}
            </td>
            <td>
              {{ request.createdAt | formatDate }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="withdrawal-request-details__buttons">
      <button
        v-ripple
        class="withdrawal-request-details__update-btn"
        :disabled="isPending || !canBeApproved || isShowReasonField"
        @click="$emit(EVENTS.approve)"
      >
        {{ 'withdrawal-request-details.approve-btn' | globalize }}
      </button>

      <button
        v-ripple
        class="withdrawal-request-details__cancel-btn"
        :disabled="isPending || !canBeRejected || isShowReasonField"
        @click="showReasonField"
      >
        {{ 'withdrawal-request-details.rejected-btn' | globalize }}
      </button>
    </div>

    <div
      class="withdrawal-request-details__form-row"
      v-if="isShowReasonField && !request.isPermanentlyRejected"
    >
      <div class="withdrawal-request-details__form-field">
        <textarea-field
          id="withdrawal-request-details-reject-reason"
          name="withdrawal-request-details-reject-reason"
          v-model="rejectReason"
          :label="'withdrawal-request-details.reject-reason' | globalize"
          :maxlength="formNoteMaxLength"
        />
      </div>
    </div>

    <div class="withdrawal-request-details__form-actions">
      <form-confirmation
        v-if="isShowReasonField && !request.isPermanentlyRejected"
        :is-pending="isPending"
        :message-id="'withdrawal-request-details.message-text-default'"
        @cancel="showReasonField"
        @ok="$emit(EVENTS.reject, rejectReason)"
      />
    </div>
  </div>
  <div v-else>
    <loader :message-id="'issuance.loading-msg'" />
  </div>
</template>

<script>
import { ASSET_POLICIES, REQUEST_TYPES } from '@tokend/js-sdk'

import { REQUEST_STATES } from '@/js/const/request-states.const'

import config from '@/config'

import IdentityGetterMixin from '@/vue/mixins/identity-getter'

import { RequestRecord } from '../../../js/records/request-record'
import Loader from '../../common/Loader'
import { ErrorHandler } from '../../../js/helpers/error-handler'
import TextareaField from '../../fields/TextareaField'
import FormConfirmation from '../../common/FormConfirmation'

const EVENTS = {
  approve: 'approve',
  reject: 'reject',
}

export default {
  name: 'withdrawal-request-details',
  components: {
    Loader,
    TextareaField,
    FormConfirmation,
  },
  mixins: [IdentityGetterMixin],
  props: {
    request: {
      type: [RequestRecord],
      required: true,
    },
    isPending: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: _ => ({
    requestorEmail: '',
    rejectReason: '',
    isLoaded: false,
    formNoteMaxLength: 250,
    isShowReasonField: false,
    config,
    ASSET_POLICIES,
    EVENTS,
    REQUEST_STATES,
    REQUEST_TYPES,
  }),
  computed: {
    canBeApproved () {
      return this.request.isRejected || this.request.isPending
    },
    canBeRejected () {
      return this.request.isPending
    },
  },
  async created () {
    await this.getRequestorEmail()
    this.isLoaded = true
  },
  methods: {
    async getRequestorEmail () {
      try {
        /* eslint-disable-next-line max-len */
        this.requestorEmail = await this.getEmailByAccountId(this.request.requestor)
      } catch (error) {
        ErrorHandler.process(error)
      }
    },
    showReasonField () {
      this.isShowReasonField = !this.isShowReasonField
    },
  },
}
</script>

<style lang="scss" scoped>
  @import "~@scss/variables";
  @import "~@scss/mixins";

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

  .withdrawal-request-details__table {
    margin-top: 2rem;

    tr td:last-child {
      text-align: right;
    }
  }

  .withdrawal-request-details__buttons {
    margin-top: 4.9rem;
    display: flex;

    button + button {
      margin-left: auto;
    }
  }

  .withdrawal-request-details__update-btn {
    @include button-raised();

    margin-bottom: 2rem;
    width: 18rem;
  }

  .withdrawal-request-details__cancel-btn {
    @include button-flat();

    margin-bottom: 2rem;
    font-weight: normal;
  }

  .withdrawal-details {
    display: flex;
    align-items: center;

    .withdrawal-details__info {
      margin-left: 1.8rem;
    }
  }

  .withdrawal-request-details__form-actions {
    margin-top: 2rem;
  }

  .withdrawal-request-details__form-row {
    margin-top: 2rem;
  }
</style>
