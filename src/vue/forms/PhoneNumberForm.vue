<template>
  <form class="app-form phone-number-form">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.phoneNumber"
          @blur="touchField('form.phoneNumber')"
          name="phone-number"
          :error-message="getFieldErrorMessage('form.phoneNumber')"
          :label="'phone-number-form.phone-number-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

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

    <div class="app__form-actions">
      <button
        v-ripple
        type="button"
        class="phone-number-form__btn app__button-raised"
        @click="changePhoneNumber"
        :disabled="formMixin.isDisabled"
      >
        <template>
          {{ 'phone-number-form.change-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { required } from '@validators'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { api, factorsManager } from '@/api'
import { errors } from '@tokend/js-sdk'
import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'phone-number-form',
  mixins: [FormMixin],
  data: _ => ({
    factor: {},
    form: {
      phoneNumber: '',
      code: '',
    },
    isShowSmsCode: false,
  }),
  validations: {
    form: {
      phoneNumber: { required },
      code: { required },
    },
  },
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },
  async created () {
    try {
      await this.loadPhoneNumber()
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },
  methods: {
    async loadPhoneNumber () {
      try {
        const { data } = await api.get('/identities', {
          filter: {
            address: this.accountId,
          },
        })
        this.form.phoneNumber = data.phoneNumber
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },
    async changePhoneNumber () {
      const validationRule = this.isShowSmsCode
        ? this.isFormValid()
        : this.isFormValid('form.phoneNumber')
      if (!validationRule) return
      this.disableForm()

      const endpoint = `/identities/${this.accountId}/settings/phone`
      try {
        await api.putWithSignature(endpoint, {
          data: {
            type: 'phone',
            attributes: {
              phone: this.form.phoneNumber,
            },
          },
        })
      } catch (error) {
        if (error instanceof errors.TFARequiredError) {
          this.isShowSmsCode = true
          try {
            await factorsManager.verifyTotpFactor(error, this.form.code)
            await api.putWithSignature(endpoint, {
              data: {
                type: 'phone',
                attributes: {
                  phone: this.form.phoneNumber,
                },
              },
            })
          } catch (e) {
            ErrorHandler.process(e, 'tfa-form.wrong-code-err')
          }
        } else {
          ErrorHandler.process(error)
        }
      }

      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.tfa-form__btn {
  max-width: 18rem;
  width: 100%;
}

.tfa-form__hint {
  margin-bottom: 1.2rem;
}

.tfa-form__code-hint {
  margin-top: 3rem;
}
</style>
