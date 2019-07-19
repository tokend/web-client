<template>
  <div class="atomic-swap-actions">
    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="app__button-raised app__button-raised--danger"
      :disabled="isAtomicSwapCanceling || atomicSwap.isCanceled"
      @click="cancelRequest"
    >
      {{ 'atomic-swap-actions.cancel-btn' | globalize }}
    </button>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { AtomicSwapRecord } from '@/js/records/entities/atomic-swap.record'
import { api } from '@/api'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { base } from '@tokend/js-sdk'

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
      this.isAtomicSwapCanceling = true

      try {
        await api.postOperations(
          this.buildCancelAtomicSwapOperation(),
        )
        Bus.success('atomic-swap-actions.atomic-swap-canceled-msg')
        this.$emit(EVENTS.cancel)
      } catch (e) {
        this.isAtomicSwapCanceling = false
        ErrorHandler.process(e)
      }
    },

    buildCancelAtomicSwapOperation () {
      return base.CancelAtomicSwapAskBuilder.cancelAtomicSwapAsk({
        askID: this.atomicSwap.id,
      })
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
