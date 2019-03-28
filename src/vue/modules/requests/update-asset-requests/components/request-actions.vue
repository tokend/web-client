<template>
  <div class="request-actions">
    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="request-actions__update-btn app__button-raised"
      :disabled="isRequestCanceling || !canBeUpdated"
      @click="$emit(EVENTS.updateAsk)"
    >
      {{ 'update-asset-requests.update-btn' | globalize }}
    </button>

    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="request-actions__cancel-btn app__button-flat"
      :disabled="isRequestCanceling || !canBeCanceled"
      @click="showConfirmation"
    >
      {{ 'update-asset-requests.cancel-btn' | globalize }}
    </button>

    <form-confirmation
      v-if="formMixin.isConfirmationShown"
      message-id="update-asset-requests.cancellation-msg"
      ok-button-text-id="update-asset-requests.yes-msg"
      cancel-button-text-id="update-asset-requests.no-msg"
      @ok="cancelRequest"
      @cancel="hideConfirmation"
    />
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'

import { mapActions } from 'vuex'
import { types } from '../store/types'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  updateAsk: 'update-ask',
  cancel: 'cancel',
}

export default {
  name: 'request-actions',
  mixins: [FormMixin],

  props: {
    request: { type: UpdateAssetRequest, required: true },
  },

  data: _ => ({
    isRequestCanceling: false,
    EVENTS,
  }),

  computed: {
    canBeUpdated () {
      return this.request.isRejected || this.request.isPending
    },

    canBeCanceled () {
      return this.request.isPending
    },
  },

  methods: {
    ...mapActions('update-asset-requests', {
      cancelUpdateAssetRequest: types.CANCEL_REQUEST,
    }),

    async cancelRequest () {
      this.hideConfirmation()
      this.isRequestCanceling = true

      try {
        await this.cancelUpdateAssetRequest(this.request.id)
        Bus.success('update-asset-requests.request-canceled-msg')
        this.$emit(EVENTS.cancel)
      } catch (e) {
        this.isRequestCanceling = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.request-actions {
  display: flex;

  button + button {
    margin-left: auto;
  }
}

.request-actions__update-btn {
  margin-bottom: 2rem;
  width: 18rem;
}

.request-actions__cancel-btn {
  margin-bottom: 2rem;
  font-weight: normal;
}
</style>
