<template>
  <div class="verification-general-form">
    <form
      novalidate
      class="app-form verification-general-form__tag"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="verification-general-form__block">
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.personal.firstName"
              @blur="touchField('form.personal.firstName')"
              name="verification-general-first-name"
              :label="'verification-form.first-name-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.personal.firstName')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.personal.lastName"
              @blur="touchField('form.personal.lastName')"
              name="verification-general-last-name"
              :label="'verification-form.last-name-lbl' | globalize"
              :error-message="getFieldErrorMessage('form.personal.lastName')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="verification-general-form__submit-btn app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ 'verification-form.create-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import VerificationFormMixin from '@/vue/mixins/verification-form.mixin'

import { api } from '@/api'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

import { BLOB_TYPES } from '@tokend/js-sdk'

import { required } from '@validators'
import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'customer-kyc-form',
  mixins: [VerificationFormMixin],

  data: _ => ({
    form: {
      personal: {
        firstName: '',
        lastName: '',
      },
    },
    isLoaded: false,
    isLoadingFailed: false,
  }),

  validations: {
    form: {
      personal: {
        firstName: { required },
        lastName: { required },
      },
    },
  },

  computed: {
    ...mapGetters({
      kvEntryGeneralRoleId: vuexTypes.kvEntryGeneralRoleId,
      isAccountRoleReseted: vuexTypes.isAccountRoleReseted,
      accountRoleToSet: vuexTypes.kycAccountRoleToSet,
      previousAccountRole: vuexTypes.kycPreviousRequestAccountRoleToSet,
    }),
  },

  methods: {
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        const kycBlobId = await this.createKycBlob(BLOB_TYPES.kycGeneral)
        const operation = this.createKycOperation(
          kycBlobId,
          this.kvEntryGeneralRoleId,
        )
        await api.postOperations(operation)
        do {
          await this.loadKyc()
          await this.delay(3000)
        } while (this.kycState !== REQUEST_STATES_STR.pending)
        Bus.success('verification-form.request-submitted-msg')
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },

    delay (ms) {
      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve, reject) => {
        resolve(setTimeout(resolve, ms))
      })
    },

    createKycData () {
      return {
        first_name: this.form.personal.firstName,
        last_name: this.form.personal.lastName,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.verification-general-form {
  margin-top: 4rem;
}

.verification-general-form__tag {
  margin-top: 1rem;
  background-color: $col-block-bg;
  padding: 2.4rem;

  @include box-shadow();
}

.verification-general-form__submit-btn {
  margin-right: auto;
  width: 100%;
  max-width: 20rem;
}

.verification-general-form__account-info-title {
  color: $col-primary;
  font-size: 1.3rem;
}

.verification-general-form__block {
  &:not(:first-child) {
    .verification-general-form__tag > & {
      margin-top: 6rem;
    }
  }
}

.verification-general-form__block-label {
  font-size: 1.5rem;
  font-weight: 700;
}

</style>
