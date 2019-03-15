<template>
  <div class="sale-creation-request-actions-bar">
    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="sale-creation-request-actions-bar__update-btn app__button-raised"
      :disabled="isRequestCancelling || !canBeUpdated"
      @click="$emit(EVENTS.updateAsk)"
    >
      {{ 'sale-creation-requests.update-btn' | globalize }}
    </button>

    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="sale-creation-request-actions-bar__cancel-btn app__button-flat"
      :disabled="isRequestCancelling || !canBeCanceled"
      @click="showConfirmation"
    >
      {{ 'sale-creation-requests.cancel-btn' | globalize }}
    </button>

    <form-confirmation
      v-if="formMixin.isConfirmationShown"
      message-id="sale-creation-requests.cancellation-msg"
      ok-button-text-id="sale-creation-requests.yes-msg"
      cancel-button-text-id="sale-creation-requests.no-msg"
      @ok="cancelRequest"
      @cancel="hideConfirmation"
    />
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { SaleCreationRequest } from '../wrappers/sale-creation-request'

import { mapActions } from 'vuex'
import { types } from '../store/types'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  updateAsk: 'update-ask',
  cancel: 'cancel',
}

export default {
  name: 'sale-creation-request-actions-bar',
  mixins: [FormMixin],

  props: {
    request: { type: SaleCreationRequest, required: true },
  },

  data: _ => ({
    isRequestCancelling: false,
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
    ...mapActions('sale-creation-requests', {
      cancelSaleCreationRequest: types.CANCEL_ASSET_CREATION_REQUEST,
    }),

    async cancelRequest () {
      this.hideConfirmation()
      this.isRequestCancelling = true

      try {
        await this.cancelSaleCreationRequest(this.request.id)
        Bus.success('sale-creation-requests.request-canceled-msg')
        this.$emit(EVENTS.cancel)
      } catch (e) {
        this.isRequestCancelling = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.sale-creation-request-actions-bar {
  display: flex;

  button + button {
    margin-left: auto;
  }
}

.sale-creation-request-actions-bar__update-btn {
  margin-bottom: 2rem;
  width: 18rem;
}

.sale-creation-request-actions-bar__cancel-btn {
  margin-bottom: 2rem;
  font-weight: normal;
}
</style>
