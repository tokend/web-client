<template>
  <form
    novalidate
    class="reject-request-form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="reject-request-form__row">
      <div class="reject-request-form__field">
        <textarea-field
          name="sponsorship-request-reject-reason"
          v-model="form.rejectReason"
          @blur="touchField('form.rejectReason')"
          :label="'sponsorship-requests.reject-reason' | globalize"
          :maxlength="REJECT_REASON_MAX_LENGTH"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage(
            'form.rejectReason', {
              length: REJECT_REASON_MAX_LENGTH
            }
          )"
        />
      </div>
    </div>

    <div class="reject-request-form__actions">
      <template v-if="formMixin.isConfirmationShown">
        <form-confirmation
          :is-pending="isRequestRejecting"
          message-id="sponsorship-requests.rejecting-msg"
          ok-button-text-id="sponsorship-requests.yes-msg"
          cancel-button-text-id="isponsorship-requests.no-msg"
          @ok="rejectRequest"
          @cancel="hideConfirmation"
        />
      </template>

      <template v-else>
        <button
          v-ripple
          type="submit"
          class="
            reject-request-form__action-btn
            reject-request-form__action-btn--reject
            app__button-raised
          "
        >
          {{ 'sponsorship-requests.reject-action-btn' | globalize }}
        </button>

        <button
          v-ripple
          type="button"
          class="reject-request-form__action-btn app__button-flat"
          @click="$emit(EVENTS.close)"
        >
          {{ 'sponsorship-requests.cancel-btn' | globalize }}
        </button>
      </template>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { SponsorshipRequest } from '../wrappers/sponsorship-request'

import { mapActions } from 'vuex'
import { types } from '../store/types'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { required, maxLength } from '@validators'

const EVENTS = {
  requestRejected: 'request-rejected',
  close: 'close',
}

const REJECT_REASON_MAX_LENGTH = 250

export default {
  name: 'reject-request-form',
  mixins: [FormMixin],

  props: {
    request: { type: SponsorshipRequest, required: true },
  },

  data: _ => ({
    form: {
      rejectReason: '',
    },
    isRequestRejecting: false,
    EVENTS,
    REJECT_REASON_MAX_LENGTH,
  }),

  validations: {
    form: {
      rejectReason: {
        required,
        maxLength: maxLength(REJECT_REASON_MAX_LENGTH),
      },
    },
  },

  methods: {
    ...mapActions('sponsorship-requests', {
      rejectSponsorshipRequest: types.REJECT_REQUEST,
    }),

    async rejectRequest () {
      this.isRequestRejecting = true
      try {
        await this.rejectSponsorshipRequest({
          request: this.request,
          reason: this.form.rejectReason,
        })
        Bus.success('sponsorship-requests.request-rejected-msg')
        this.$emit(EVENTS.requestRejected)
      } catch (e) {
        this.isRequestRejecting = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.reject-request-form__actions {
  margin-top: 2rem;
  display: flex;
}

.reject-request-form__action-btn {
  & + & {
    margin-left: auto;
  }
}

.reject-request-form__action-btn--reject {
  max-width: 18rem;
  width: 100%;
}
</style>
