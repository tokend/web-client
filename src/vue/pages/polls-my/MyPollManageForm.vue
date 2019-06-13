<template>
  <div class="my-poll-manage-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="submit"
    >
      <div class="my-poll-manage-form__end-time-wrp">
        <h3 class="my-poll-manage-form-subheading app__form-subheading">
          {{ 'my-poll-manage-form.update-end-time-subheading' | globalize }}
        </h3>

        <div class="my-poll-manage-form__table app__table">
          <table>
            <tbody>
              <tr>
                <td>
                  {{ 'my-poll-manage-form.current-end-time-title' | globalize }}
                </td>
                <td>{{ poll.endTime | formatCalendar }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <date-field
              v-model="form.endTime"
              :enable-time="true"
              :disable-before="getDisableDate"
              @input="touchField('form.endTime')"
              @blur="touchField('form.endTime')"
              name="my-poll-manage-end-time"
              :label="'my-poll-manage-form.new-end-time-lbl' | globalize"
              :disabled="formMixin.isDisabled"
              :error-message="getFieldErrorMessage(
                'form.endTime', { minDate: poll.startTime || getCurrentDate() }
              )"
            />
          </div>
        </div>
        <div class="app__form-actions my-poll-manage-form__form-actions">
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
              {{ 'my-poll-manage-form.submit-btn' | globalize }}
            </button>
          </template>
        </div>
      </div>

      <div class="my-poll-manage-form__close-poll-wrp">
        <h3 class="my-poll-manage-form-subheading app__form-subheading">
          {{ 'my-poll-manage-form.close-poll-subheading' | globalize }}
        </h3>

        <div class="my-poll-manage-form__choices">
          <div
            class="my-poll-manage-form__choice-wrp"
            v-for="item in VOTING_RESULTS"
            :key="item.value"
          >
            <radio-field
              :name="`my-poll-manage-form__choice-${item.value}`"
              v-model="form.result"
              :cb-value="item.value"
              :disabled="formMixin.isDisabled"
            >
              {{ item.name | globalize }}
            </radio-field>
          </div>
        </div>

        <div class="my-poll-manage-form__form-actions app__form-actions">
          <form-confirmation
            v-if="formMixin.isConfirmationShown && isCloseConfirmationMode"
            message-id="my-poll-manage-form.close-poll-confirmation-msg"
            ok-button-text-id="my-poll-manage-form.yes-btn"
            cancel-button-text-id="my-poll-manage-form.no-btn"
            is-danger-color
            @ok="hideCloseConfirmation() || closePoll()"
            @cancel="hideCloseConfirmation"
          />
          <template v-else>
            <!-- eslint-disable max-len -->
            <button
              type="button"
              class="app__button-raised app__button-raised--danger"
              :disabled="formMixin.isDisabled || !form.result || form.result < 0"
              @click="showCloseConfirmation"
            >
              <!-- eslint-enable max-len -->
              {{ 'my-poll-manage-form.close-poll-btn' | globalize }}
            </button>
          </template>
        </div>
      </div>

      <div class="my-poll-manage-form__cancel-poll-wrp">
        <h3 class="my-poll-manage-form-subheading app__form-subheading">
          {{ 'my-poll-manage-form.cancel-poll-subheading' | globalize }}
        </h3>

        <div class="my-poll-manage-form__form-actions app__form-actions">
          <form-confirmation
            v-if="formMixin.isConfirmationShown && isCancelConfirmationMode"
            message-id="my-poll-manage-form.cancel-poll-confirmation-msg"
            ok-button-text-id="my-poll-manage-form.yes-btn"
            cancel-button-text-id="my-poll-manage-form.no-btn"
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
              {{ 'my-poll-manage-form.cancel-poll-btn' | globalize }}
            </button>
          </template>
        </div>
      </div>
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

const VOTING_RESULTS = [
  { name: 'my-poll-manage-form.passed-poll-result', value: 0 },
  { name: 'my-poll-manage-form.failed-poll-result', value: 1 },
]

export default {
  name: 'my-poll-manage-form',
  mixins: [FormMixin],
  props: {
    poll: {
      type: Object,
      required: true,
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
      return moment().isAfter(moment(this.poll.startTime))
        ? moment().subtract(1, 'days').toISOString()
        : moment(this.poll.startTime).subtract(1, 'days').toISOString()
    },
  },

  created () {
    this.form.endTime = this.poll.endTime
  },

  validations () {
    return {
      form: {
        endTime: {
          required,
          minDate: minDate(this.poll.startTime || moment().toISOString()),
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
        Bus.success('my-poll-manage-form.update-date-notification')
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
        Bus.success('my-poll-manage-form.close-notification')
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
        Bus.success('my-poll-manage-form.cancel-notification')
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
    getCurrentDate () {
      return moment().toISOString()
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

.my-poll-manage-form__form-actions:not(:first-child) {
  margin-top: 3rem;
}

.my-poll-manage-form-subheading {
  margin-top: 3rem;
  margin-bottom: 0;
}

.my-poll-manage-form__table tr td:last-child {
  text-align: right;
}

.my-poll-manage-form__table {
  margin-top: 1.5rem;
}

.my-poll-manage-form__choice-wrp:not(:first-of-type) {
  margin-top: 1.2rem;
}

.my-poll-manage-form__choices {
  margin-top: 2rem;
}
</style>
