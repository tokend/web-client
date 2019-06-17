<template>
  <form
    novalidate
    class="app__form"
    @submit.prevent="submit"
  >
    <div class="poll-manage-form__cancel-poll-wrp">
      <h3 class="poll-manage-form-subheading app__form-subheading">
        {{ 'poll-manage-form.cancel-poll-subheading' | globalize }}
      </h3>

      <p class="poll-manage-form-description">
        {{ 'poll-manage-form.cancel-poll-description' | globalize }}
      </p>

      <div class="poll-manage-form__form-actions app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          message-id="poll-manage-form.cancel-poll-confirmation-msg"
          ok-button-text-id="poll-manage-form.yes-btn"
          cancel-button-text-id="poll-manage-form.no-btn"
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
            {{ 'poll-manage-form.cancel-poll-btn' | globalize }}
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
        Bus.success('poll-manage-form.cancel-notification')
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

.poll-manage-form__form-actions:not(:first-child) {
  margin-top: 2rem;
}

.poll-manage-form-subheading {
  margin-top: 5rem;
  margin-bottom: 0;
}

.poll-manage-form-description {
  margin-top: 1rem;
}
</style>
