<template>
  <div class="mass-invitation-form">
    <form @submit.prevent="submit()">
      <div class="app__form-row">
        <div class="app__form-field">
          <p class="mass-invitation-form__how-to-invitees">
            {{ 'mass-invitation-form.how-to-invitees-paragraph' | globalize }}
          </p>

          <textarea-field
            name="mass-invitation-invitees"
            v-model="form.invitees"
            :label="'mass-invitation-form.invitees-lbl' | globalize"
            :disabled="formMixin.isDisabled"
            @blur="touchField('form.invitees')"
            :error-message="getFieldErrorMessage('form.invitees')"
            rows="8"
          />
        </div>
      </div>

      <div class="app__form-actions">
        <button
          v-ripple
          :disabled="formMixin.isDisabled"
          class="app__form-submit-btn app__button-raised"
          type="submit"
        >
          {{ 'mass-invitation-form.submit-btn' | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import { required } from '@validators'

import { CsvUtil } from '@/js/utils/csv.util'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { api } from '@/api'

const EVENTS = {
  submitted: 'submitted',
}

export default {
  name: 'mass-invitation-form',

  mixins: [FormMixin],

  props: {
    invitees: { type: String, default: '' },
  },

  data () {
    return {
      form: {
        invitees: this.invitees || '',
      },
    }
  },

  validations () {
    return {
      form: {
        invitees: {
          required,
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),
  },

  methods: {
    async submit () {
      this.disableForm()

      try {
        const emails = CsvUtil.parseConcat(this.form.invitees, {
          trim: true,
          filterEmpty: true,
          delimiters: CsvUtil.delimiters.common,
        })

        const endpoint = `/integrations/dns/businesses/${this.accountId}/clients`
        const body = {
          data: emails.map(email => ({
            type: 'clients',
            attributes: { email },
          })),
        }
        await api.postWithSignature(endpoint, body)

        this.$emit(EVENTS.submitted)
        Bus.success('mass-invitation-form.invited-successfully-notification')
      } catch (error) {
        ErrorHandler.process(error)
      }

      this.enableForm()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';
@import '@/scss/variables';

p.mass-invitation-form__how-to-invitees {
  line-height: 1.5;
  font-size: 1.6rem;
  margin-bottom: 2.4rem;
}
</style>
