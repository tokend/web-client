<template>
  <form
    novalidate
    class="app__form create-poll-form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <textarea-field
          white-autofill
          v-model="form.question"
          @blur="touchField('form.question')"
          name="create-poll-question"
          :label="'create-poll-form.question-lbl' | globalize"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage('form.question')"
          :maxlength="QUESTION_MAX_LENGTH"
        />
      </div>
    </div>

    <div
      v-for="(choice, index) in form.choices"
      :key="index"
      class="app__form-row"
    >
      <div class="app__form-field">
        <div class="create-poll-form__choice-wrp">
          <div class="create-poll-form__choice">
            <input-field
              white-autofill
              v-model="form.choices[index].description"
              @blur="touchField(`form.choices[${index}].description`)"
              :name="'create-poll-description'"
              :label="'create-poll-form.description-lbl' | globalize({
                number: index + 1
              })"
              :disabled="formMixin.isDisabled"
              :error-message="getFieldErrorMessage(`
                form.choices[${index}].description
              `)"
            />

            <button
              v-if="canDeleteChoice(index + 1)"
              type="button"
              class="create-poll-form__delete-choice-btn"
              @click="deleteChoice(index)"
              :disabled="formMixin.isDisabled"
            >
              <!-- eslint-disable-next-line max-len -->
              <i class="mdi mdi-minus-circle-outline create-poll-form__delete-choice-icon" />
            </button>
          </div>

          <div
            v-if="canAddChoice(index + 1)"
            class="create-poll-form__add-choice-wrp"
          >
            <p class="create-poll-form__add-choice">
              <button
                class="create-poll-form__add-choice-btn"
                @click="addChoice(choice)"
                :disabled="formMixin.isDisabled"
              >
                {{ 'create-poll-form.add-choice-btn' | globalize }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <date-field
          v-model="form.startTime"
          name="create-poll-form-start-time"
          :enable-time="true"
          @input="touchField('form.startTime')"
          @blur="touchField('form.startTime')"
          :label="'create-poll-form.start-time-lbl' | globalize"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage(
            'form.startTime',
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <date-field
          v-model="form.endTime"
          :enable-time="true"
          :disable-before="yesterday"
          @input="touchField('form.endTime')"
          @blur="touchField('form.endTime')"
          name="create-poll-end-time"
          :label="'create-poll-form.end-time-lbl' | globalize"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage(
            'form.endTime', { minDate: form.startTime || getCurrentDate() }
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <select-field
          v-model="form.permissionType"
          @blur="touchField('form.permissionType')"
          name="create-poll-permission-type"
          :label="'create-poll-form.permission-type-lbl' | globalize"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage(
            'form.permissionType',
          )"
        >
          <option
            v-for="pollPermissionType in pollPermissionTypes"
            :key="pollPermissionType.value"
            :value="pollPermissionType.value"
          >
            {{ pollPermissionType.labelTranslationId | globalize }}
          </option>
        </select-field>
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        :is-pending="isSubmitting"
        @ok="submit()"
        @cancel="hideConfirmation()"
      />

      <button
        v-else
        v-ripple
        type="submit"
        :disabled="formMixin.isDisabled"
        class="app__button-raised create-poll-form__btn"
      >
        <template>
          {{ 'create-poll-form.create-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import {
  required,
  maxLength,
  minDate,
} from '@validators'
import { base } from '@tokend/js-sdk'
import { DateUtil } from '@/js/utils'
import { api } from '@/api'

const QUESTION_MAX_LENGTH = 255
const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'create-poll-form-module',

  mixins: [FormMixin],

  data: _ => ({
    form: {
      question: '',
      permissionType: '',
      endTime: '',
      startTime: '',
      choices: [{ description: '', number: 1 }],
    },
    isSubmitting: false,
    QUESTION_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        question: {
          required,
          maxLength: maxLength(QUESTION_MAX_LENGTH),
        },
        permissionType: {
          required,
        },
        startTime: {
          required,
        },
        endTime: {
          required,
          minDate: minDate(this.form.startTime || moment().toISOString()),
        },
        choices: {
          $each: {
            description: {
              required,
            },
          },
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      restrictedPollType: vuexTypes.kvPollTypeRestricted,
      unrestrictedPollType: vuexTypes.kvPollTypeUnrestricted,
    }),
    yesterday () {
      return moment().subtract(1, 'days').toISOString()
    },
    pollPermissionTypes () {
      return [
        {
          labelTranslationId: 'create-poll-form.restricted-poll-lbl',
          value: this.restrictedPollType,
        },
        {
          labelTranslationId: 'create-poll-form.unrestricted-poll-lbl',
          value: this.unrestrictedPollType,
        },
      ]
    },
  },

  created () {
    if (!this.form.permissionType) {
      this.form.permissionType = this.unrestrictedPollType
    }
  },

  methods: {
    addChoice (choice) {
      this.form.choices.push({
        number: choice.number + 1,
        description: '',
      })
    },
    deleteChoice (index) {
      this.form.choices.splice(index, 1)
      this.form.choices.forEach((choice, index) => {
        choice.number = index + 1
      })
    },
    async submit () {
      if (this.isFormValid()) {
        this.disableForm()
        this.isSubmitting = true
        try {
          const createPollOperation = this.buildCreatePollOperation()
          await api.postOperations(createPollOperation)
          Bus.success('create-poll-form.request-submitted-msg')
          this.$emit(EVENTS.submitted)
        } catch (e) {
          this.enableForm()
          ErrorHandler.process(e)
        }
        this.isSubmitting = false
        this.hideConfirmation()
        this.enableForm()
      }
    },
    buildCreatePollOperation () {
      const operation = {
        permissionType: Number(this.form.permissionType),
        voteConfirmationRequired: false,
        resultProviderID: api.networkDetails.masterAccountId,
        startTime: DateUtil.toTimestamp(this.form.startTime),
        endTime: DateUtil.toTimestamp(this.form.endTime),
        numberOfChoices: this.form.choices.length,
        pollType: base.xdr.PollType.singleChoice().value,
        creatorDetails: {
          question: this.form.question,
          choices: this.form.choices,
        },
      }
      return base.ManageCreatePollRequestBuilder.createPollRequest(operation)
    },
    canDeleteChoice (index) {
      return index !== this.form.choices.length ||
        (index === this.form.choices.length && this.form.choices.length !== 1)
    },
    canAddChoice (index) {
      return index === this.form.choices.length
    },
    getCurrentDate () {
      return moment().toISOString()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';
@import '~@scss/variables';

.create-poll-form__choice-wrp {
  display: flex;
  flex-direction: column;
}

.create-poll-form__choice {
  display: flex;
  width: 100%;
}

.create-poll-form__add-choice {
  margin-top: 1rem;
}

.create-poll-form__add-choice-btn {
  cursor: pointer;
  white-space: nowrap;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    border-bottom: dotted 0.1rem;
    bottom: 0.1rem;
    left: 0;
    width: 100%;
    height: 0.1rem;
  }

  &:disabled {
    filter: grayscale(1);
    opacity: 0.7;
    cursor: default;
  }
}

.create-poll-form__delete-choice-btn {
  margin-top: 1.4rem;
  margin-left: 0.6rem;
  max-width: 2.4rem;
  max-height: 2.4rem;
  color: $col-primary-inactive;
  transition: 0.2s color;

  &:disabled {
    filter: grayscale(100%);
    cursor: default;
  }

  &:enabled:hover,
  &:enabled:focus {
    color: inherit;
  }
}

.create-poll-form__delete-choice-icon {
  font-size: 2.4rem;
}
</style>
