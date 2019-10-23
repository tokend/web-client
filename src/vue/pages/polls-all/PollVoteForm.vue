<template>
  <div class="poll-vote-form">
    <div class="poll-vote-form__question-wrp">
      <p class="poll-vote-form__question">
        {{ poll.question }}
      </p>
    </div>

    <form
      class="app__form"
      @submit.prevent="showConfirmation()"
    >
      <div class="poll-vote-form__choices">
        <div
          class="poll-vote-form__choice-wrp"
          v-for="item in poll.choices"
          :key="item.number"
        >
          <radio-field
            :name="`poll-vote-form__choice-${item.number}`"
            v-model="form.choice"
            :cb-value="item.number"
            :disabled="formMixin.isDisabled"
          >
            {{ item.description }}
          </radio-field>
        </div>
      </div>

      <template v-if="isRepeatVote">
        <p class="poll-vote-form__repeat-vote-msg">
          <template v-if="!isRepeatVoteAllowed">
            {{ 'poll-vote-form.repeat-vote-disabled-msg' | globalize }}
          </template>

          <template v-else>
            {{ 'poll-vote-form.repeat-vote-msg' | globalize }}
          </template>
        </p>
      </template>

      <div class="poll-vote-form__form-actions app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown && !isRemovalConfirmationMode"
          @ok="hideConfirmation() || submitVote()"
          @cancel="hideConfirmation"
        />

        <form-confirmation
          v-if="formMixin.isConfirmationShown && isRemovalConfirmationMode"
          message-id="poll-vote-form.remove-vote-confirmation-msg"
          @ok="hideRemovalConfirmation() || removeVote()"
          @cancel="hideRemovalConfirmation"
        />

        <template v-else-if="!formMixin.isConfirmationShown">
          <button
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled ||
              !form.choice ||
              form.choice < 0 ||
              !poll.isOpen ||
              (isRepeatVote && !isRepeatVoteAllowed)
            "
          >
            {{ 'poll-vote-form.submit-btn' | globalize }}
          </button>

          <button
            v-if="isRepeatVote && isRepeatVoteAllowed"
            type="button"
            class="app__button-raised app__button-raised--danger"
            :disabled="formMixin.isDisabled || !poll.isOpen"
            @click="showRemovalConfirmation"
          >
            {{ 'poll-vote-form.remove-vote-btn' | globalize }}
          </button>
        </template>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { base, errors } from '@tokend/js-sdk'
import { api } from '@/api'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { PollRecord } from '@/js/records/entities/poll.record'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'poll-vote-form',

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
        choice: -1,
      },
      isRepeatVote: false,
      isRemovalConfirmationMode: false,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      restrictedPollType: vuexTypes.kvPollTypeRestricted,
    }),

    isRepeatVoteAllowed () {
      return this.poll.permissionType !== this.restrictedPollType
    },
  },

  async created () {
    this.disableForm()

    try {
      await this.tryPopulateChoice()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }

    this.enableForm()
  },

  methods: {
    async tryPopulateChoice () {
      const endpoint = `/v3/polls/${this.poll.id}/relationships/votes/${this.accountId}`
      try {
        const { data } = await api.getWithSignature(endpoint)

        this.form.choice = data.voteData.singleChoice
        this.isRepeatVote = true
      } catch (error) {
        if (!(error instanceof errors.NotFoundError)) {
          throw error
        }
      }
    },

    async submitVote () {
      if (!this.form.choice < 0 || !this.form.choice) {
        return
      }

      this.disableForm()
      try {
        const operations = []
        if (this.isRepeatVote) {
          operations.push(this.buildVoteRemovalOperation())
        }
        operations.push(this.buildSingleChoiceVoteOperation())

        await api.postOperations(...operations)
        await this.tryPopulateChoice()

        Bus.success('poll-vote-form.submitted-notification')
        this.$emit(EVENTS.submitted)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },

    buildSingleChoiceVoteOperation () {
      return base.ManageVoteBuilder.createSingleChoiceVote({
        pollID: this.poll.id,
        choice: +this.form.choice,
      })
    },

    buildVoteRemovalOperation () {
      return base.ManageVoteBuilder.removeVote({
        pollID: this.poll.id,
      })
    },

    async removeVote () {
      if (!this.isRepeatVote) {
        return
      }

      this.disableForm()
      try {
        await api.postOperations(
          this.buildVoteRemovalOperation(),
        )

        this.form.choice = -1
        this.isRepeatVote = false

        Bus.success('poll-vote-form.removed-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },

    showRemovalConfirmation () {
      this.isRemovalConfirmationMode = true
      this.showConfirmation()
    },

    hideRemovalConfirmation () {
      this.isRemovalConfirmationMode = false
      this.hideConfirmation()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';
@import '~@scss/variables';

.poll-vote-form__question {
  line-height: 1.4865;
  font-size: 1.6rem;
  color: $col-text;
}

.poll-vote-form__choices {
  margin-top: 2rem;
}

.poll-vote-form__repeat-vote-msg {
  color: $col-secondary;
  font-size: 1.3rem;
  margin-top: 2.4rem;
}

.poll-vote-form__choice-wrp:not(:first-of-type) {
  margin-top: 1.2rem;
}

.poll-vote-form__form-actions.app__form-actions {
  margin-top: 3.2rem;

  .poll-vote-form__repeat-vote-msg + & {
    margin-top: 1.2rem;
  }
}
</style>
