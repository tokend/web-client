<template>
  <form
    novalidate
    class="app__form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="poll-update-end-time-form">
      <!-- eslint-disable max-len -->
      <h3
        class="poll-update-end-time-form-subheading__end-time app__form-subheading"
      >
        {{ 'poll-update-end-time-form.update-end-time-subheading' | globalize }}
      </h3>
      <!-- eslint-enable max-len -->

      <div class="app__form-row">
        <div class="app__form-field">
          <date-field
            v-model="form.endTime"
            :enable-time="true"
            :disable-before="getDisableDate"
            @input="touchField('form.endTime')"
            @blur="touchField('form.endTime')"
            name="poll-manage-end-time"
            :label="'poll-update-end-time-form.new-end-time-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage(
              'form.endTime', { minDate: getMinDate() }
            )"
          />
          <!-- eslint-disable max-len -->

          <vue-markdown
            class="app__form-field-description poll-update-end-time-form__time-hint"
            :source="'poll-update-end-time-form.current-end-time-title' | globalize({
              time: poll.endsAt
            })"
          />
          <!-- eslint-enable max-len -->
        </div>
      </div>
      <div class="app__form-actions poll-update-end-time-form__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          @ok="hideConfirmation() || updatePoll()"
          @cancel="hideConfirmation"
        />

        <template v-else>
          <button
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'poll-update-end-time-form.submit-btn' | globalize }}
          </button>
        </template>
      </div>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
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

const EVENTS = {
  endTimeUpdated: 'end-time-updated',
}

export default {
  name: 'poll-update-end-time-form',
  components: {
    VueMarkdown,
  },
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
        endTime: '',
      },
    }
  },

  computed: {
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
      },
    }
  },

  methods: {
    async updatePoll () {
      this.disableForm()
      try {
        await api.postOperations(
          this.buildUpdatePollEndTimeOperation(),
        )
        Bus.success('poll-update-end-time-form.update-date-notification')
        this.$emit(EVENTS.endTimeUpdated)
      } catch (error) {
        ErrorHandler.process(error)
      }
      this.enableForm()
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
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';
@import '~@scss/variables';

.poll-update-end-time-form__form-actions:not(:first-child) {
  margin-top: 2rem;
}

.poll-update-end-time-form-subheading__end-time {
  margin-top: 0;
  margin-bottom: 0;
}

.poll-update-end-time-form__time-hint {
  p {
    font-size: 1.2rem;
  }

  strong {
    color: $col-text-highlighted;
  }
}

</style>
