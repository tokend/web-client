<template>
  <div class="actions-bar">
    <div class="actions-bar__buttons">
      <button
        v-ripple
        class="actions-bar__approve-btn app__button-raised"
        :disabled="!canBeApproved"
        @click="approveRequest"
      >
        {{ 'withdrawal-request-details.approve-btn' | globalize }}
      </button>

      <button
        v-ripple
        class="actions-bar__reject-btn app__button-flat"
        :disabled="!canBeRejected"
        @click="isRejectFormShown = true"
      >
        {{ 'withdrawal-request-details.rejected-btn' | globalize }}
      </button>
    </div>

    <reject-request-form
      :is-shown.sync="isRejectFormShown"
      :request="request"
      @request-rejected="$emit(EVENTS.requestUpdated)"
    />
  </div>
</template>

<script>
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
  name: 'actions-bar',
  components: {
    RejectRequestForm,
  },

  props: {
    request: { type: IncomingWithdrawalRequest, required: true },
  },

  data: _ => ({
    isRejectFormShown: false,
    isRequestProcessing: false,
    EVENTS,
  }),

  computed: {
    canBeApproved () {
      return (this.request.isRejected || this.request.isPending) &&
        !(this.isRequestProcessing || this.isRejectFormShown)
    },

    canBeRejected () {
      return this.request.isPending &&
        !(this.isRequestProcessing || this.isRejectFormShown)
    },
  },

  methods: {
    ...mapActions('incoming-withdrawal-requests', {
      approveWithdrawalRequest: types.APPROVE_REQUEST,
    }),

    async approveRequest () {
      this.isRequestProcessing = true

      try {
        await this.approveWithdrawalRequest(this.request)
        Bus.success('incoming-withdrawal-requests.request-approved-msg')
        this.$emit(EVENTS.requestUpdated)
      } catch (e) {
        this.isRequestProcessing = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.actions-bar__buttons {
  display: flex;

  button + button {
    margin-left: auto;
  }
}

.actions-bar__approve-btn {
  max-width: 18rem;
  width: 100%;
}

.actions-bar__reject-btn {
  font-weight: normal;
}
</style>
