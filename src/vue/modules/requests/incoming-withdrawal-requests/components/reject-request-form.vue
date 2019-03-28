<template>
  <div
    v-if="isShown"
    class="reject-request-form"
  >
    <div class="reject-request-form-row">
      <div class="reject-request-form-field">
        <textarea-field
          id="withdrawal-request-reject-reason"
          name="withdrawal-request-reject-reason"
          v-model="form.rejectReason"
          @blur="touchField('form.rejectReason')"
          :label="'withdrawal-request-details.reject-reason' | globalize"
          :maxlength="REJECT_REASON_MAX_LENGTH"
          :error-message="getFieldErrorMessage(
            'form.rejectReason', {
              length: REJECT_REASON_MAX_LENGTH
            }
          )"
        />
      </div>
    </div>

    <div class="reject-request-form-actions">
      <form-confirmation
        :is-pending="isRequestProcessing"
        :message-id="'withdrawal-request-details.message-text-default'"
        @cancel="$emit(EVENTS.updateIsShown, false)"
        @ok="rejectRequest"
      />
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'

import { mapActions } from 'vuex'
import { types } from '../store/types'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { required, maxLength } from '@validators'

const EVENTS = {
  requestRejected: 'request-rejected',
  updateIsShown: 'update:isShown',
}

const REJECT_REASON_MAX_LENGTH = 250

export default {
  name: 'reject-request-form',
  mixins: [FormMixin],

  props: {
    request: { type: IncomingWithdrawalRequest, required: true },
    isShown: { type: Boolean, default: false },
  },

  data: _ => ({
    form: {
      rejectReason: '',
    },
    isRequestProcessing: false,
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
    ...mapActions('incoming-withdrawal-requests', {
      rejectWithdrawalRequest: types.REJECT_REQUEST,
    }),

    async rejectRequest () {
      if (!this.isFormValid()) return

      this.isRequestProcessing = true

      try {
        await this.rejectWithdrawalRequest({
          request: this.request,
          reason: this.form.rejectReason,
        })
        Bus.success('incoming-withdrawal-requests.request-rejected-msg')
        this.$emit(EVENTS.requestRejected)
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.isRequestProcessing = false
    },
  },
}
</script>

<style lang="scss" scoped>
.reject-request-form-row, .reject-request-form-actions {
  margin-top: 2rem;
}
</style>
