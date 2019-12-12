<template>
  <form
    novalidate
    class="app__form"
    @submit.prevent="submit"
  >
    <div class="cancel-poll-form">
      <h3 class="cancel-poll-form-subheading app__form-subheading">
        {{ 'cancel-poll-form.cancel-poll-subheading' | globalize }}
      </h3>

      <p class="cancel-poll-form-description">
        {{ 'cancel-poll-form.cancel-poll-description' | globalize }}
      </p>

      <div class="cancel-poll-form__form-actions app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          message-id="cancel-poll-form.cancel-poll-confirmation-msg"
          ok-button-text-id="cancel-poll-form.yes-btn"
          cancel-button-text-id="cancel-poll-form.no-btn"
          is-danger-color
          @ok="hideConfirmation() || cancelPoll()"
          @cancel="hideConfirmation"
        />

        <template v-else>
          <button
            type="submit"
            class="app__button-raised app__button-raised--danger"
            :disabled="formMixin.isDisabled"
          >
            {{ 'cancel-poll-form.cancel-poll-btn' | globalize }}
          </button>
        </template>
      </div>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { base } from '@tokend/js-sdk'
import { PollRecord } from '@/js/records/entities/poll.record'

const EVENTS = {
  pollCanceled: 'poll-canceled',
}

export default {
  name: 'cancel-poll-form',
  mixins: [FormMixin],
  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
  },

  methods: {
    submit () {
      this.showConfirmation()
    },

    async cancelPoll () {
      this.disableForm()
      try {
        await api.postOperations(
          this.buildCancelPollOperation(),
        )
        Bus.success('cancel-poll-form.cancel-notification')
        this.$emit(EVENTS.pollCanceled)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },

    buildCancelPollOperation () {
      return base.ManagePollBuilder.cancelPoll({
        pollID: this.poll.id,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';
@import '~@scss/variables';

.cancel-poll-form__form-actions:not(:first-child) {
  margin-top: 2rem;
}

.cancel-poll-form-subheading {
  margin-top: 0;
  margin-bottom: 0;
}

.cancel-poll-form-description {
  margin-top: 1rem;
  color: $col-text;
}
</style>
