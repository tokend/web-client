<template>
  <form
    @submit.prevent="submit()"
    class="app-form telegram-form"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.telegram"
          @blur="touchField('form.telegram')"
          @input="hideSmsCodeAndClearField()"
          name="telegram"
          type="telegram"
          :error-message="getFieldErrorMessage('form.telegram')"
          :label="'telegram-form.telegram-lbl' | globalize"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>
    <template v-if="isShowCode">
      <div class="app__form-row">
        <div class="app__form-field">
          <p>
            {{ 'telegram-form.info-msg' | globalize }}:
          </p>
          <a :href="botUrl">{{ botUrl }}</a>
        </div>
      </div>
      <transition name="telegram-form__transition">
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              v-model="form.code"
              @blur="touchField('form.code')"
              name="code"
              :error-message="getFieldErrorMessage('form.code')"
              :label="'telegram-form.code-from-sms-lbl' | globalize"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
      </transition>
    </template>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="telegram-form__btn app__button-raised"
        :disabled="formMixin.isDisabled || isUserPhoneNumber"
      >
        <template v-if="isTelegramEnabled">
          {{ 'telegram-form.change-btn' | globalize }}
        </template>
        <template v-else>
          {{ 'telegram-form.add-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import IdentityGetter from '@/vue/mixins/identity-getter'

import {
  required,
  telegramUsername,
} from '@validators'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { api, factorsManager } from '@/api'
import { errors } from '@tokend/js-sdk'
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'telegram-form',
  mixins: [FormMixin, IdentityGetter],
  data: _ => ({
    form: {
      telegram: '',
      code: '',
    },
    botUrl: '',
    isShowCode: false,
    userTelegram: '',
  }),

  validations: {
    form: {
      telegram: { required, telegramUsername },
      code: { required },
    },
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      isTelegramEnabled: vuexTypes.isTelegramEnabled,
    }),
    isUserPhoneNumber () {
      return this.userTelegram === this.form.telegram
    },
  },

  async created () {
    const telegram = await this.getTelegramUsernameByAccountId(this.accountId)
    this.form.telegram = telegram
    this.userTelegram = telegram
  },

  methods: {
    ...mapActions({
      loadFactors: vuexTypes.LOAD_FACTORS,
      loadNewIdentities: vuexTypes.LOAD_IDENTITIES_BY_ACCOUNT_ID,
    }),
    async submit () {
      const validationRule = this.isShowCode
        ? this.isFormValid()
        : this.isFormValid('form.telegram')
      if (!validationRule) return
      this.disableForm()

      try {
        await this.changeTelegramUsername()
      } catch (error) {
        if (error instanceof errors.ConflictError) {
          ErrorHandler.process(error, 'telegram-form.exist-telegram-err')
        } else if (error instanceof errors.TFARequiredError) {
          this.botUrl = error.meta.botUrl
          this.isShowCode = true
          this.verifyCode(error)
        } else {
          ErrorHandler.process(error)
        }
      }

      this.enableForm()
    },

    async changeTelegramUsername () {
      const endpoint = `/identities/${this.accountId}/settings/telegram`
      await api.putWithSignature(endpoint, {
        data: {
          type: 'telegram-username',
          attributes: {
            username: this.form.telegram,
          },
        },
      })
    },

    async verifyCode (error) {
      if (!this.form.code) {
        this.enableForm()
        return
      }
      try {
        await factorsManager.verifyTotpFactor(error, this.form.code)
        await this.changeTelegramUsername()
        await this.loadNewIdentities(this.accountId)
        this.$emit(EVENTS.submitted)
        if (this.isTelegramEnabled) {
          Bus.success('telegram-form.telegram-changed-msg')
        } else {
          Bus.success('telegram-form.telegram-added-msg')
        }
      } catch (e) {
        ErrorHandler.process(e, 'telegram-form.wrong-sms-code-err')
      }
    },

    hideSmsCodeAndClearField () {
      this.isShowCode = false
      this.form.code = ''
      // reset validation empty field error
      this.$v.form.code.$reset()
    },
  },
}
</script>

<style lang="scss" scoped>
  @import './app-form';

  .telegram-form__btn {
    max-width: 18rem;
    width: 100%;
  }

  .telegram-form__transition-enter-active {
    animation: telegram-form__transition-keyframes 0.2s ease-in-out;
  }

  .telegram-form__transition-leave-active {
    display: none;
    animation: telegram-form__transition-keyframes 0s ease-in-out reverse;
  }

  @keyframes telegram-form__transition-keyframes {
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
