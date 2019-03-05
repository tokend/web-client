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
      v-else-if="request.isRejected"
      class="request-state request-state--rejected"
    >
      <p class="request-state__content">
        <!-- eslint-disable-next-line max-len -->
        {{ 'request-messages.rejected-msg' | globalize({ reason: request.rejectReason }) }}
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
        </tbody>
      </table>
    </div>

    <div class="withdrawal-request-details__buttons">
      <button
        v-ripple
        class="withdrawal-request-details__update-btn"
        :disabled="isPending || !canBeApproved"
        @click="$emit(EVENTS.approve)"
      >
        {{ 'withdrawal-request-details.approve-btn' | globalize }}
      </button>

      <button
        v-ripple
        class="withdrawal-request-details__cancel-btn"
        :disabled="isPending || !canBeRejected"
        @click="$emit(EVENTS.reject)"
      >
        {{ 'withdrawal-request-details.rejected-btn' | globalize }}
      </button>
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

const EVENTS = {
  approve: 'approve',
  reject: 'reject',
}

export default {
  name: 'withdrawal-request-details',
  components: {
    Loader,
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
    isLoaded: false,
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
</style>
