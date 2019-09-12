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
          message-id="sponsorship-requests.approving-msg"
          ok-button-text-id="sponsorship-requests.yes-msg"
          cancel-button-text-id="sponsorship-requests.no-msg"
          @ok="approveRequest"
          @cancel="hideConfirmation"
        />
      </template>

      <template v-else>
        <button
          v-ripple
          class="
            request-actions__button
            request-actions__button--approve
            app__button-raised
          "
          :disabled="!canBeReviewed"
          @click="showConfirmation"
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
          :disabled="!canBeReviewed"
          @click="isRejectFormShown = true"
        >
          {{ 'sponsorship-requests.reject-btn' | globalize }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import RejectRequestForm from './reject-request-form'

import { SponsorshipRequest } from '../wrappers/sponsorship-request'

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
    request: { type: SponsorshipRequest, required: true },
  },

  data: _ => ({
    isRejectFormShown: false,
    isRequestApproving: false,
    EVENTS,
  }),

  computed: {
    canBeReviewed () {
      return this.request.isPending
    },
  },

  methods: {
    ...mapActions('sponsorship-requests', {
      approveSponsorshipRequest: types.APPROVE_REQUEST,
    }),

    async approveRequest () {
      this.isRequestApproving = true
      try {
        await this.approveSponsorshipRequest(this.request)
        Bus.success('sponsorship-requests.request-approved-msg')
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
}

.request-actions__button {
  & + & {
    margin-left: auto;
  }

  &--approve {
    max-width: 18rem;
    width: 100%;
  }

  &--reject {
    font-weight: 400;
  }
}

.request-actions__reject-form {
  margin-top: 2rem;
}
</style>
