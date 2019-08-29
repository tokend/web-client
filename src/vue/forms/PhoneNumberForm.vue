<template>
  <form
    @submit.prevent="submit()"
    class="app-form phone-number-form"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.phoneNumber"
          @blur="touchField('form.phoneNumber')"
          @input="hideSmsCodeAndClearField()"
          name="phone-number"
          type="phone-number"
          :error-message="getFieldErrorMessage('form.phoneNumber')"
          :label="'phone-number-form.phone-number-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <transition name="phone-number-form__transition">
      <template v-if="isShowSmsCode">
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              v-model="form.code"
              @blur="touchField('form.code')"
              name="code"
              :error-message="getFieldErrorMessage('form.code')"
              :label="'phone-number-form.code-from-sms-lbl' | globalize"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
      </template>
    </transition>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="phone-number-form__btn app__button-raised"
        :disabled="formMixin.isDisabled || isPhoneNumberChanged"
      >
        <template v-if="isPhoneEnabled">
          {{ 'phone-number-form.change-btn' | globalize }}
        </template>
        <template v-else>
          {{ 'phone-number-form.add-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import {
  required,
  validatePhoneNumber,
} from '@validators'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { api, factorsManager } from '@/api'
import { errors } from '@tokend/js-sdk'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'
import IdentityGetter from '@/vue/mixins/identity-getter'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'phone-number-form',
  mixins: [FormMixin, IdentityGetter],
  data: _ => ({
    form: {
      phoneNumber: '',
      code: '',
    },
    isShowSmsCode: false,
    userPhoneNumber: '',
    totpFactorError: {},
  }),

  validations: {
    form: {
      phoneNumber: { required, validatePhoneNumber },
      code: { required },
    },
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isPhoneEnabled: vuexTypes.isPhoneEnabled,
    }),
    isPhoneNumberChanged () {
      return this.userPhoneNumber === this.form.phoneNumber
    },
  },

  async created () {
    const phoneNumber = await this.getPhoneByAccountId(this.accountId, true)
    this.form.phoneNumber = phoneNumber.substr(1)
    this.userPhoneNumber = phoneNumber.substr(1)
  },

  methods: {
    async submit () {
      const validationRule = this.isShowSmsCode
        ? this.isFormValid()
        : this.isFormValid('form.phoneNumber')
      if (!validationRule) return
      this.disableForm()

      try {
        if (!this.isShowSmsCode) {
          await this.changePhoneNumber()
        } else {
          await this.verifySmsCode(this.totpFactorError)
          await this.changePhoneNumber()
        }
        this.$emit(EVENTS.submitted)
        if (this.isPhoneEnabled) {
          Bus.success('phone-number-form.phone-number-changed-msg')
        } else {
          Bus.success('phone-number-form.phone-number-added-msg')
        }
        this.enableForm()
      } catch (e) {
        // All errors are processed above in the methods
      }
    },

    async changePhoneNumber () {
      try {
        const endpoint = `/identities/${this.accountId}/settings/phone`
        await api.putWithSignature(endpoint, {
          data: {
            type: 'phone',
            attributes: {
              phone: '+' + this.form.phoneNumber,
            },
          },
        })
      } catch (e) {
        if (e instanceof errors.ConflictError) {
          ErrorHandler.process(e, 'phone-number-form.exist-phone-number-err')
        } else if (e instanceof errors.TFARequiredError) {
          this.isShowSmsCode = true
          this.totpFactorError = e
          this.enableForm()
        } else {
          ErrorHandler.process(e)
        }
        throw new Error(e)
      }
    },

    async verifySmsCode (error) {
      try {
        await factorsManager.verifyTotpFactor(error, this.form.code)
      } catch (e) {
        ErrorHandler.process(e, 'phone-number-form.wrong-sms-code-err')
        throw new Error(e)
      }
    },

    hideSmsCodeAndClearField () {
      this.isShowSmsCode = false
      this.form.code = ''
      // reset validation empty field error
      this.$v.form.code.$reset()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.phone-number-form__btn {
  max-width: 18rem;
  width: 100%;
}

.phone-number-form__transition-enter-active {
  animation: phone-number-form__transition-keyframes 0.2s ease-in-out;
}

.phone-number-form__transition-leave-active {
  display: none;
  animation: phone-number-form__transition-keyframes 0s ease-in-out reverse;
}

@keyframes phone-number-form__transition-keyframes {
  from {
    opacity: 0;
    max-height: 0;
  }

  to {
    opacity: 1;
    max-height: 4.4rem;
  }
}
</style>
