<template>
  <form
    novalidate
    class="app__form create-poll-form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          type="number"
          v-model="form.permissionType"
          @blur="touchField('form.permissionType')"
          name="create-poll-permission-type"
          :label="'create-poll-form.permission-type-lbl' | globalize"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage(
            'form.permissionType',
          )"
        />
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
          :label="'create-poll-form.close-time-lbl' | globalize"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage(
            'form.endTime',
          )"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          name="create-poll-vote-confirmation-required"
          v-model="form.isVoteConfirmationRequired"
          :disabled="formMixin.isDisabled"
        >
          {{ 'create-poll-form.vote-confirmation-required-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <div class="create-poll-form__result-provider-id-wrp">
          <input-field
            white-autofill
            v-model="form.resultProviderID"
            @blur="touchField('form.resultProviderID')"
            name="create-poll-result-provider-id"
            :label="'create-poll-form.result-provider-id-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage(
              'form.resultProviderID',
            )"
          />
          <button
            v-ripple
            type="button"
            class="app__button-flat create-poll-form__insert-account-id-btn"
            @click="form.resultProviderID = accountId"
            :disabled="formMixin.isDisabled"
          >
            {{ 'create-asset-form.use-my-account-id-btn' | globalize }}
          </button>
        </div>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <textarea-field
          white-autofill
          v-model="form.question"
          @blur="touchField('form.question')"
          name="create-poll-question"
          :label="'create-poll-form.question-lbl' | globalize"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage(
            'form.question',
          )"
        />
      </div>
    </div>

    <div
      v-for="(choice, index) in form.choices"
      :key="index"
      class="app__form-row">
      <div class="app__form-field">
        <div class="create-poll-form__choice-description-wrp">
          <!-- eslint-disable max-len -->
          <input-field
            white-autofill
            v-model="form.choices[index].description"
            @blur="touchField(`form.choices[${index}].description`)"
            :name="'create-poll-description'"
            :label="'create-poll-form.description-lbl' | globalize({ number: index + 1 })"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage(`form.choices[${index}].description`)"
          />
          <!-- eslint-enable max-len -->
          <button
            v-ripple
            v-if="choice.canDelete"
            type="button"
            class="app__button-flat create-poll-form__add-description-btn"
            @click="deleteDescription(index + 1)"
            :disabled="formMixin.isDisabled"
          >
            -
          </button>
          <button
            v-ripple
            v-else
            type="button"
            class="app__button-flat create-poll-form__add-description-btn"
            @click="addDescription(choice, index)"
            :disabled="formMixin.isDisabled"
          >
            +
          </button>
        </div>
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="submit()"
        @cancel="hideConfirmation()"
      />

      <button
        v-else
        v-ripple
        type="submit"
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
import { required, maxLength, minDate } from '@validators'
import { globalize } from '@/vue/filters/globalize'

const NAME_MAX_LENGTH = 255
const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'create-poll-form-module',
  mixins: [FormMixin],
  data: _ => ({
    form: {
      question: '',
      permissionType: null,
      numberOfChoices: null,
      endTime: '',
      startTime: '',
      isVoteConfirmationRequired: false,
      resultProviderID: '',
      choices: [{ description: '', number: 1, canDelete: false }],
    },
  }),
  validations () {
    return {
      form: {
        question: {
          required,
          maxLength: maxLength(NAME_MAX_LENGTH),
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
        resultProviderID: {
          required,
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
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    yesterday () {
      return moment().subtract(1, 'days').toISOString()
    },
  },
  methods: {
    addDescription (choice, index) {
      if (!choice.description) return
      choice.canDelete = true
      this.form.choices.push({
        number: index + 1,
        description: '',
        canDelete: false,
      })
    },
    deleteDescription (index) {
      this.form.choices.splice(index, 1)
    },
    async submit () {
      if (this.isFormValid()) {
        this.isDisabled = true
        try {
          await this.submitCreatePollRequest()
          Bus.success('create-poll-form.request-submitted-msg')
          this.$emit(EVENTS.submit)
        } catch (e) {
          this.isDisabled = false
          ErrorHandler.process(e)
        }
      }
    },
    getChoiceErrorMsg (index) {
      if (this.$v.form.choices.$each[index].description.$invalid &&
      this.$v.form.choices.$each[index].description.$dirty) {
        return globalize('validation.field-error_required')
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.create-poll-form__result-provider-id-wrp {
  display: flex;
  align-items: center;
}

.create-poll-form__insert-account-id-btn {
  margin-left: 0.4rem;
}

.create-poll-form__choice-description-wrp {
  display: flex;
  align-items: center;
}
</style>
