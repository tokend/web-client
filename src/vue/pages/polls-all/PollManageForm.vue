<template>
  <div class="poll-manage-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="submit"
    >
      <template v-if="isPollOwner">
        <div class="poll-manage-form__end-time-wrp">
          <h3
            class="poll-manage-form-subheading__end-time app__form-subheading"
          >
            {{ 'poll-manage-form.update-end-time-subheading' | globalize }}
          </h3>

          <div class="app__form-row">
            <div class="app__form-field">
              <date-field
                v-model="form.endTime"
                :enable-time="true"
                :disable-before="getDisableDate"
                @input="touchField('form.endTime')"
                @blur="touchField('form.endTime')"
                name="poll-manage-end-time"
                :label="'poll-manage-form.new-end-time-lbl' | globalize"
                :disabled="formMixin.isDisabled"
                :error-message="getFieldErrorMessage(
                  'form.endTime', { minDate: getMinDate() }
                )"
              />
              <vue-markdown
                class="app__form-field-description poll-manage-form__time-hint"
                :source="'poll-manage-form.current-end-time-title' | globalize({
                  time: poll.endsAt
                })"
              />
            </div>
          </div>
          <div class="app__form-actions poll-manage-form__form-actions">
            <form-confirmation
              v-if="formMixin.isConfirmationShown && !isCloseConfirmationMode
                && !isCancelConfirmationMode"
              @ok="hideConfirmation() || updatePoll()"
              @cancel="hideConfirmation"
            />

            <template v-else>
              <button
                type="submit"
                class="app__button-raised"
                :disabled="formMixin.isDisabled"
              >
                {{ 'poll-manage-form.submit-btn' | globalize }}
              </button>
            </template>
          </div>
        </div>
      </template>

      <template v-if="isPollResultProvider">
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
              v-if="formMixin.isConfirmationShown && isCloseConfirmationMode"
              message-id="poll-manage-form.close-poll-confirmation-msg"
              ok-button-text-id="poll-manage-form.yes-btn"
              cancel-button-text-id="poll-manage-form.no-btn"
              is-danger-color
              @ok="hideCloseConfirmation() || closePoll()"
              @cancel="hideCloseConfirmation"
            />
            <template v-else>
              <!-- eslint-disable max-len -->
              <button
                type="button"
                class="app__button-raised app__button-raised--danger"
                :disabled="formMixin.isDisabled ||
                  !form.result ||
                  form.result < 0
                "
                @click="showCloseConfirmation"
              >
                <!-- eslint-enable max-len -->
                {{ 'poll-manage-form.close-poll-btn' | globalize }}
              </button>
            </template>
          </div>
        </div>
      </template>

      <template v-if="isPollOwner">
        <div class="poll-manage-form__cancel-poll-wrp">
          <h3 class="poll-manage-form-subheading app__form-subheading">
            {{ 'poll-manage-form.cancel-poll-subheading' | globalize }}
          </h3>

          <p class="poll-manage-form-description">
            {{ 'poll-manage-form.cancel-poll-description' | globalize }}
          </p>

          <div class="poll-manage-form__form-actions app__form-actions">
            <form-confirmation
              v-if="formMixin.isConfirmationShown && isCancelConfirmationMode"
              message-id="poll-manage-form.cancel-poll-confirmation-msg"
              ok-button-text-id="poll-manage-form.yes-btn"
              cancel-button-text-id="poll-manage-form.no-btn"
              is-danger-color
              @ok="hideCancelConfirmation() || cancelPoll()"
              @cancel="hideCancelConfirmation"
            />

            <template v-else>
              <button
                type="button"
                class="app__button-raised app__button-raised--danger"
                :disabled="formMixin.isDisabled"
                @click="showCancelConfirmation"
              >
                {{ 'poll-manage-form.cancel-poll-btn' | globalize }}
              </button>
            </template>
          </div>
        </div>
      </template>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import {
  required,
  minDate,
} from '@validators'
import moment from 'moment'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { base } from '@tokend/js-sdk'
import { DateUtil } from '@/js/utils'
import { PollRecord } from '@/js/records/entities/poll.record'
import VueMarkdown from 'vue-markdown'

const VOTING_RESULTS = [
  { name: 'poll-manage-form.passed-poll-result', value: 0 },
  { name: 'poll-manage-form.failed-poll-result', value: 1 },
]

const EVENTS = {
  updatedEndTime: 'updatedEndTime',
  closedPoll: 'closedPoll',
  canceledPoll: 'canceledPoll',
}

export default {
  name: 'poll-manage-form',
  components: {
    VueMarkdown,
  },
  mixins: [FormMixin],
  props: {
    poll: {
      type: PollRecord,
      required: true,
    },
    isPollOwner: {
      type: Boolean,
      default: false,
    },
    isPollResultProvider: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      form: {
        endTime: '',
        result: -1,
      },
      isCloseConfirmationMode: false,
      isCancelConfirmationMode: false,
      VOTING_RESULTS,
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
    getDisableDate () {
      return moment().isAfter(moment(this.poll.startsAt))
        ? moment().subtract(1, 'days').toISOString()
        : moment(this.poll.startsAt).subtract(1, 'days').toISOString()
    },
  },

  created () {
    this.form.endTime = this.poll.endsAt
  },

  validations () {
    return {
      form: {
        endTime: {
          required,
          minDate: minDate(this.getMinDate()),
        },
        result: {
          required,
        },
      },
    }
  },

  methods: {
    submit () {
      if (!this.isFormValid('form.endTime')) return
      this.showConfirmation()
    },
    async updatePoll () {
      this.disableForm()
      try {
        await api.postOperations(
          this.buildUpdatePollEndTimeOperation(),
        )
        Bus.success('poll-manage-form.update-date-notification')
        this.$emit(EVENTS.updatedEndTime)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },

    async closePoll () {
      this.disableForm()
      try {
        await api.postOperations(
          this.buildClosePollOperation(),
        )
        Bus.success('poll-manage-form.close-notification')
        this.$emit(EVENTS.closedPoll)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },

    async cancelPoll () {
      this.disableForm()
      try {
        await api.postOperations(
          this.buildCancelPollOperation(),
        )
        Bus.success('poll-manage-form.cancel-notification')
        this.$emit(EVENTS.canceledPoll)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
    },

    showCancelConfirmation () {
      this.isCancelConfirmationMode = true
      this.showConfirmation()
    },

    hideCancelConfirmation () {
      this.isCancelConfirmationMode = false
      this.hideConfirmation()
    },

    showCloseConfirmation () {
      if (!this.isFormValid('form.result')) return
      this.isCloseConfirmationMode = true
      this.showConfirmation()
    },

    hideCloseConfirmation () {
      this.isCloseConfirmationMode = false
      this.hideConfirmation()
    },
    getMinDate () {
      return moment().isAfter(moment(this.poll.startsAt))
        ? moment().toISOString()
        : moment(this.poll.startsAt).toISOString()
    },
    buildUpdatePollEndTimeOperation () {
      return base.ManagePollBuilder.updatePollEndTime({
        pollID: this.poll.id,
        newEndTime: DateUtil.toTimestamp(this.form.endTime),
      })
    },
    buildClosePollOperation () {
      return base.ManagePollBuilder.closePoll({
        pollID: this.poll.id,
        result: Number(this.form.result),
        details: '{}',
      })
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

.poll-manage-form-subheading__end-time {
  margin-top: 0;
  margin-bottom: 0;
}

.poll-manage-form__table tr td:last-child {
  text-align: right;
}

.poll-manage-form__table {
  margin-top: 1.5rem;
}

.poll-manage-form__choice-wrp:not(:first-of-type) {
  margin-top: 1.2rem;
}

.poll-manage-form__choices {
  margin-top: 2rem;
}

.poll-manage-form__time-hint {
  p {
    font-size: 1.2rem;
  }

  strong {
    color: $col-text-highlighted;
  }
}

.poll-manage-form-description {
  margin-top: 1rem;
}
</style>
