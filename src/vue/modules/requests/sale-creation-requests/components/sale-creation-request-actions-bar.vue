<template>
  <div class="sale-creation-request-actions-bar">
    <!--
      Currently, we cannot definitely identify the sale by its request,
      therefore we temporarily disable view button.
    -->
    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="sale-creation-request-actions-bar__view-btn app__button-raised"
      :disabled="true"
    >
      {{ 'sale-creation-requests.view-btn' | globalize }}
    </button>

    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="sale-creation-request-actions-bar__update-btn app__button-raised"
      :disabled="isRequestCanceling || !canBeUpdated"
      @click="$emit(EVENTS.updateAsk)"
    >
      {{ 'sale-creation-requests.update-btn' | globalize }}
    </button>

    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="sale-creation-request-actions-bar__cancel-btn app__button-flat"
      :disabled="isRequestCanceling || !canBeCanceled"
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
    ...mapActions('sale-creation-requests', {
      cancelSaleCreationRequest: types.CANCEL_SALE_CREATION_REQUEST,
    }),

    async cancelRequest () {
      this.hideConfirmation()
      this.isRequestCanceling = true

      try {
        await this.cancelSaleCreationRequest(this.request.id)
        Bus.success('sale-creation-requests.request-canceled-msg')
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
@import "~@scss/variables";

.sale-creation-request-actions-bar {
  display: flex;
}

.sale-request-details__view-btn {
  max-width: 14.4rem;
  width: 100%;
}

.sale-creation-request-actions-bar__update-btn {
  margin-left: 1.2rem;
  max-width: 14.4rem;
  width: 100%;
  font-weight: bold;
  color: $col-button-flat-light-text;
  box-shadow: 0 .5rem 1.5rem 0 $col-button-flat-light-shadow;
  background-color: $col-button-flat-light-bg;;
}

.sale-creation-request-actions-bar__cancel-btn {
  font-weight: normal;
  margin-left: auto;
}
</style>
