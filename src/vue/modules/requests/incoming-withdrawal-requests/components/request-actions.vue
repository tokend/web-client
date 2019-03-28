<template>
  <div class="request-actions">
    <reject-request-form
      v-if="isRejectFormShown"
      class="request-actions__reject-form"
      :request="request"
      @close="isRejectFormShown = false"
      @request-rejected="$emit(EVENTS.requestUpdated)"
    />

    <div v-else class="request-actions__buttons">
      <template v-if="formMixin.isConfirmationShown">
        <form-confirmation
          :is-pending="isRequestApproving"
          message-id="incoming-withdrawal-requests.approving-msg"
          ok-button-text-id="incoming-withdrawal-requests.yes-msg"
          cancel-button-text-id="incoming-withdrawal-requests.no-msg"
          @ok="approveRequest"
          @cancel="hideConfirmation"
        />
      </template>

      <template v-else>
        <button
          v-ripple
          class="request-actions__approve-btn app__button-raised"
          :disabled="!canBeApproved"
          @click="showConfirmation"
        >
          {{ 'incoming-withdrawal-requests.approve-btn' | globalize }}
        </button>

        <button
          v-ripple
          class="request-actions__reject-btn app__button-flat"
          :disabled="!canBeRejected"
          @click="isRejectFormShown = true"
        >
          {{ 'incoming-withdrawal-requests.reject-btn' | globalize }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import RejectRequestForm from './reject-request-form'

import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'

import { mapActions } from 'vuex'
import { types } from '../store/types'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  requestUpdated: 'request-updated',
}

export default {
  name: 'request-actions',
  components: {
    RejectRequestForm,
  },
  mixins: [FormMixin],

  props: {
    request: { type: IncomingWithdrawalRequest, required: true },
  },

  data: _ => ({
    isRejectFormShown: false,
    isRequestApproving: false,
    EVENTS,
  }),

  computed: {
    canBeApproved () {
      return this.request.isRejected || this.request.isPending
    },

    canBeRejected () {
      return this.request.isPending
    },
  },

  methods: {
    ...mapActions('incoming-withdrawal-requests', {
      approveWithdrawalRequest: types.APPROVE_REQUEST,
    }),

    async approveRequest () {
      this.isRequestApproving = true
      try {
        await this.approveWithdrawalRequest(this.request)
        Bus.success('incoming-withdrawal-requests.request-approved-msg')
        this.$emit(EVENTS.requestUpdated)
      } catch (e) {
        this.isRequestApproving = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.request-actions__buttons {
  display: flex;

  button + button {
    margin-left: auto;
  }
}

.request-actions__approve-btn {
  max-width: 18rem;
  width: 100%;
}

.request-actions__reject-btn {
  font-weight: normal;
}

.request-actions__reject-form {
  margin-top: 2rem;
}
</style>
