<template>
  <div class="atomic-swap-actions">
    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="app__button-raised app__button-raised--danger"
      :disabled="isAtomicSwapCanceling"
      @click="showConfirmation"
    >
      {{ 'atomic-swap-actions.cancel-btn' | globalize }}
    </button>

    <form-confirmation
      v-if="formMixin.isConfirmationShown"
      message-id="atomic-swap-actions.cancellation-msg"
      ok-button-text-id="atomic-swap-actions.yes-msg"
      cancel-button-text-id="atomic-swap-actions.no-msg"
      is-danger-color
      @ok="cancelRequest"
      @cancel="hideConfirmation"
    />
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const EVENTS = {
  cancel: 'cancel',
}

export default {
  name: 'atomic-swap-actions',
  mixins: [FormMixin],

  props: {
    atomicSwap: { type: AtomicSwapRecord, required: true },
  },

  data: _ => ({
    isAtomicSwapCanceling: false,
    EVENTS,
  }),

  methods: {
    async cancelRequest () {
      this.hideConfirmation()
      this.isRequestCanceling = true

      try {
        await this.cancelUpdateAssetRequest(this.request.id)
        Bus.success('atomic-swap-actions.atomic-swap-canceled-msg')
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
.atomic-swap-actions {
  display: flex;
  margin-top: 2rem;
}
</style>
