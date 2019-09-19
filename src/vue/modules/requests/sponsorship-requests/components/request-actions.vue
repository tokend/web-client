<template>
  <div class="request-actions">
    <button
      v-ripple
      class="
        request-actions__button
        request-actions__button--approve
        app__button-raised
      "
      :disabled="!canBeReviewed || isDisabled"
      @click="sendRequest(CONTRACT_ACTIONS.approve)"
    >
      {{ 'sponsorship-requests.approve-btn' | globalize }}
    </button>

    <button
      v-ripple
      class="
        request-actions__button
        request-actions__button--reject
        app__button-flat
      "
      :disabled="!canBeReviewed || isDisabled"
      @click="sendRequest(CONTRACT_ACTIONS.permanentlyReject)"
    >
      {{ 'sponsorship-requests.reject-btn' | globalize }}
    </button>
  </div>
</template>

<script>
import { SponsorshipRequest } from '../wrappers/sponsorship-request'

import { mapActions } from 'vuex'
import { types } from '../store/types'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  requestUpdated: 'request-updated',
}

const CONTRACT_ACTIONS = {
  approve: 1,
  permanentlyReject: 3,
}

export default {
  name: 'request-actions',

  props: {
    request: { type: SponsorshipRequest, required: true },
  },

  data: _ => ({
    EVENTS,
    isDisabled: false,
    CONTRACT_ACTIONS,
  }),

  computed: {
    canBeReviewed () {
      return this.request.isPending
    },
  },

  methods: {
    ...mapActions('sponsorship-requests', {
      approveOrRejectRequest: types.APPROVE_OR_REJECT_REQUEST,
    }),

    async sendRequest (action) {
      this.isDisabled = true
      try {
        await this.approveOrRejectRequest(
          {
            requestId: this.request.id,
            action,
          })
        if (action === CONTRACT_ACTIONS.approve) {
          Bus.success('sponsorship-requests.request-approved-msg')
        } else {
          Bus.success('sponsorship-requests.request-rejected-msg')
        }
        this.$emit(EVENTS.requestUpdated)
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isDisabled = false
    },
  },
}
</script>

<style lang="scss" scoped>
.request-actions {
  display: flex;
  justify-content: space-between;
}
</style>
