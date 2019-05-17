<template>
  <div class="whitelist-invite-form">
    <p class="whitelist-invite-form__hint">
      {{ 'whitelist-invite-form.invite-hint' | globalize }}
    </p>

    <form
      novalidate
      class="app__form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            v-model="form.email"
            @blur="touchField('form.email')"
            name="whitelist-invite-email"
            :label="'whitelist-invite-form.email-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.email')"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          :is-pending="isFormSubmitting"
          @ok="submit"
          @cancel="hideConfirmation"
        />

        <button
          v-else
          v-ripple
          type="submit"
          class="app__button-raised"
          :disabled="formMixin.isDisabled"
        >
          {{ 'whitelist-invite-form.invite-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { api } from '@/api'

import { required, email } from '@validators'

import { SaleRecord } from '@/js/records/entities/sale.record'

const EVENTS = {
  invited: 'invited',
}
export default {
  name: 'whitelist-invite-form',
  mixins: [FormMixin],

  props: {
    sale: { type: SaleRecord, required: true },
  },

  data: _ => ({
    form: {
      email: '',
    },
    isFormSubmitting: false,
  }),

  validations () {
    return {
      form: {
        email: { required, email },
      },
    }
  },

  methods: {
    async submit () {
      this.isFormSubmitting = true
      try {
        await api.postWithSignature('/invites', {
          data: {
            type: 'whitelist-invite',
            attributes: {
              email: this.form.email,
            },
            relationships: {
              sales: {
                data: {
                  type: 'sale',
                  id: this.sale.id,
                },
              },
            },
          },
        })

        Bus.success('whitelist-invite-form.user-invited-msg')
        this.$emit(EVENTS.invited)
      } catch (e) {
        ErrorHandler.process(e)
      }

      this.isFormSubmitting = false
      this.hideConfirmation()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.whitelist-invite-form__hint {
  font-size: 1.6rem;
  margin-bottom: 2.4rem;
}
</style>
