<template>
  <div class="request-actions">
    <!--
      Currently, we cannot definitely identify the sale by its request,
      therefore we temporarily disable view button.
    -->
    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="request-actions__view-btn app__button-raised"
      :disabled="true"
    >
      {{ 'create-sale-requests.view-btn' | globalize }}
    </button>

    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="request-actions__update-btn app__button-raised"
      :disabled="isRequestCanceling || !canBeUpdated"
      @click="$emit(EVENTS.updateAsk)"
    >
      {{ 'create-sale-requests.update-btn' | globalize }}
    </button>

    <button
      v-ripple
      v-if="!formMixin.isConfirmationShown"
      class="request-actions__cancel-btn app__button-flat"
      :disabled="isRequestCanceling || !canBeCanceled"
      @click="showConfirmation"
    >
      {{ 'create-sale-requests.cancel-btn' | globalize }}
    </button>

    <form-confirmation
      v-if="formMixin.isConfirmationShown"
      message-id="create-sale-requests.cancellation-msg"
      ok-button-text-id="create-sale-requests.yes-msg"
      cancel-button-text-id="create-sale-requests.no-msg"
      @ok="cancelRequest"
      @cancel="hideConfirmation"
    />
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { CreateSaleRequest } from '../wrappers/create-sale-request'

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
    request: { type: CreateSaleRequest, required: true },
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
    ...mapActions('create-sale-requests', {
      cancelCreateSaleRequest: types.CANCEL_REQUEST,
    }),

    async cancelRequest () {
      this.hideConfirmation()
      this.isRequestCanceling = true

      try {
        await this.cancelCreateSaleRequest(this.request.id)
        Bus.success('create-sale-requests.request-canceled-msg')
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

.request-actions {
  display: flex;
}

.sale-request-details__view-btn {
  max-width: 14.4rem;
  width: 100%;
}

.request-actions__update-btn {
  margin-left: 1.2rem;
  max-width: 14.4rem;
  width: 100%;
  font-weight: bold;
  color: $col-button-flat-light-text;
  box-shadow: 0 .5rem 1.5rem 0 $col-button-flat-light-shadow;
  background-color: $col-button-flat-light-bg;;
}

.request-actions__cancel-btn {
  font-weight: normal;
  margin-left: auto;
}
</style>
