<template>
  <form
    novalidate
    class="app__form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="poll-manage-form__close-poll-wrp">
      <h3 class="poll-manage-form-subheading app__form-subheading">
        {{ 'poll-manage-form.close-poll-subheading' | globalize }}
      </h3>

      <p class="poll-manage-form-description">
        {{ 'poll-manage-form.close-poll-description' | globalize }}
      </p>

      <div class="poll-manage-form__choices">
        <div
          class="poll-manage-form__choice-wrp"
          v-for="item in VOTING_RESULTS"
          :key="item.value"
        >
          <radio-field
            :name="`poll-manage-form__choice-${item.value}`"
            v-model="form.result"
            :cb-value="item.value"
            :disabled="formMixin.isDisabled"
          >
            {{ item.name | globalize }}
          </radio-field>
        </div>
      </div>

      <div class="poll-manage-form__form-actions app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          message-id="poll-manage-form.close-poll-confirmation-msg"
          ok-button-text-id="poll-manage-form.yes-btn"
          cancel-button-text-id="poll-manage-form.no-btn"
          is-danger-color
          @ok="hideConfirmation() || closePoll()"
          @cancel="hideConfirmation"
        />
        <template v-else>
          <button
            type="submit"
            class="app__button-raised app__button-raised--danger"
            :disabled="formMixin.isDisabled ||
              !form.result ||
              form.result < 0
            "
          >
            {{ 'poll-manage-form.close-poll-btn' | globalize }}
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
import { required } from '@validators'

const VOTING_RESULTS = [
  { name: 'poll-manage-form.passed-poll-result', value: 0 },
  { name: 'poll-manage-form.failed-poll-result', value: 1 },
]

const EVENTS = {
  pollClosed: 'poll-closed',
}

export default {
  name: 'close-poll-form',
  mixins: [FormMixin],
  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
  },
  data () {
    return {
      form: {
        result: -1,
      },
      VOTING_RESULTS,
    }
  },

  validations () {
    return {
      form: {
        result: {
          required,
        },
      },
    }
  },

  methods: {
    async closePoll () {
      this.disableForm()
      try {
        await api.postOperations(
          this.buildClosePollOperation(),
        )
        Bus.success('poll-manage-form.close-notification')
        this.$emit(EVENTS.pollClosed)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },

    buildClosePollOperation () {
      return base.ManagePollBuilder.closePoll({
        pollID: this.poll.id,
        result: Number(this.form.result),
        details: '{}',
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

.poll-manage-form__choice-wrp:not(:first-of-type) {
  margin-top: 1.2rem;
}

.poll-manage-form__choices {
  margin-top: 2rem;
}

.poll-manage-form-description {
  margin-top: 1rem;
}
</style>
