<template>
  <div class="my-poll-manage-form">
    <form
      novalidate
      class="app__form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <poll-state-viewer :poll-state="poll.pollState.value" />

      <poll-details
        class="my-poll-manage-form__poll-details"
        :poll="poll"
      />

      <div class="app__form-row">
        <div class="app__form-field">
          <date-field
            v-model="form.endTime"
            :enable-time="true"
            :disable-before="getDisableDate"
            @input="touchField('form.endTime')"
            @blur="touchField('form.endTime')"
            name="my-poll-manage-end-time"
            :label="'my-poll-manage-form.end-time-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            :error-message="getFieldErrorMessage(
              'form.endTime', { minDate: poll.startTime || getCurrentDate() }
            )"
          />
        </div>
      </div>

      <div class="my-poll-manage-form__form-actions app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown && !isCloseConfirmationMode
            && !isCancelConfirmationMode"
          @ok="hideConfirmation() || updatePoll()"
          @cancel="hideConfirmation"
        />

        <form-confirmation
          v-if="formMixin.isConfirmationShown && isCloseConfirmationMode"
          message-id="my-poll-manage-form.close-poll-confirmation-msg"
          @ok="hideCloseConfirmation() || closePoll()"
          @cancel="hideCloseConfirmation"
        />

        <form-confirmation
          v-if="formMixin.isConfirmationShown && isCancelConfirmationMode"
          message-id="my-poll-manage-form.cancel-poll-confirmation-msg"
          @ok="hideCancelConfirmation() || cancelPoll()"
          @cancel="hideCancelConfirmation"
        />

        <template v-else-if="!formMixin.isConfirmationShown">
          <div class="my-poll-manage-form__buttons-wrp">
            <button
              type="submit"
              class="app__button-raised"
              :disabled="formMixin.isDisabled"
            >
              {{ 'my-poll-manage-form.submit-btn' | globalize }}
            </button>
            <div class="my-poll-manage-form__buttons-raised">
              <!-- eslint-disable max-len -->
              <button
                type="button"
                class="app__button-raised app__button-raised--danger my-poll-manage-form__button--close"
                :disabled="formMixin.isDisabled"
                @click="showCloseConfirmation"
              >
                <!-- eslint-enable max-len -->
                {{ 'my-poll-manage-form.close-poll-btn' | globalize }}
              </button>

              <button
                type="button"
                class="app__button-raised app__button-raised--danger"
                :disabled="formMixin.isDisabled"
                @click="showCancelConfirmation"
              >
                {{ 'my-poll-manage-form.cancel-poll-btn' | globalize }}
              </button>
            </div>
          </div>
        </template>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'
import PollStateViewer from '@/vue/pages/polls/PollStateViewer'
import PollDetails from '@/vue/pages/polls/PollDetails'
import {
  required,
  minDate,
} from '@validators'
import moment from 'moment'

export default {
  name: 'my-poll-manage-form',
  components: {
    PollStateViewer,
    PollDetails,
  },
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
      },
      isCloseConfirmationMode: false,
      isCancelConfirmationMode: false,
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
      },
    }
  },

  methods: {

    showCancelConfirmation () {
      this.isCancelConfirmationMode = true
      this.showConfirmation()
    },

    hideCancelConfirmation () {
      this.isCancelConfirmationMode = false
      this.hideConfirmation()
    },

    showCloseConfirmation () {
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
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';
@import '~@scss/variables';

.my-poll-manage-form__buttons-wrp {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.my-poll-manage-form__buttons-raised {
  display: flex;
}

.my-poll-manage-form__button--close {
  margin-right: 1rem;
}

.my-poll-manage-form__poll-details {
  margin-top: 2rem;
}

</style>
