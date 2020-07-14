<template>
  <form
    class="kyc-corporate-form"
    @submit.prevent="confirm"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @change="former.setAttr('name', form.name)"
          @blur="touchField('form.name')"
          name="verification-corporate-name"
          :label="'verification-form.name-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.name')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.company"
          @change="former.setAttr('company', form.company)"
          @blur="touchField('form.company')"
          name="verification-corporate-company"
          :label="'verification-form.company-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.company')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <template v-if="!former.isRecoveryOpBuilder">
      <div class="app__form-row">
        <div class="app__form-field">
          <file-field
            v-model="form.avatar"
            @input="former.setAttr('avatar', form.avatar)"
            name="verification-corporate-avatar"
            :note="'verification-form.image-type-note' | globalize"
            :file-extensions="['jpg', 'png']"
            :document-type="$DOCUMENT_TYPES.kycAvatar"
            :label="'verification-form.avatar-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
    </template>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.headquarters"
          @change="former.setAttr('headquarters', form.headquarters)"
          @blur="touchField('form.headquarters')"
          name="verification-corporate-headquarters"
          :label="'verification-form.headquarters-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.headquarters')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.industry"
          @change="former.setAttr('industry', form.industry)"
          @blur="touchField('form.industry')"
          name="verification-corporate-industry"
          :label="'verification-form.industry-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.industry')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          type="number"
          :min="minTeamSize"
          :step="1"
          v-model="form.teamSize"
          @change="former.setAttr('teamSize', form.teamSize)"
          @blur="touchField('form.teamSize')"
          name="verification-corporate-team-size"
          :label="'verification-form.team-size-lbl' | globalize"
          :error-message="
            getFieldErrorMessage('form.teamSize', { minValue: minTeamSize })
          "
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.website"
          @change="former.setAttr('website', form.website)"
          @blur="touchField('form.website')"
          name="verification-corporate-website"
          :label="'verification-form.website-lbl' | globalize"
          :error-message="getFieldErrorMessage('form.website')"
          :disabled="formMixin.isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation(); submit()"
        @cancel="hideConfirmation"
      />
      <button
        v-ripple
        v-else
        type="submit"
        class="app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        <template v-if="former.willUpdateRequest">
          {{ 'verification-form.update-btn' | globalize }}
        </template>

        <template v-else>
          {{ 'verification-form.create-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import { KycCorporateFormer } from '@/js/formers/KycCorporateFormer'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { delay } from '@/js/helpers/delay'
import { mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { required, validateUrl, integer, minValue } from '@validators'
import verificationFormMixin from '@/vue/mixins/verification-form.mixin'
import config from '@/config'

export default {
  name: 'kyc-corporate-form',

  mixins: [verificationFormMixin],

  props: {
    former: {
      type: KycCorporateFormer,
      default: () => new KycCorporateFormer(),
    },
  },

  data () {
    const attrs = this.former.attrs || {}
    return {
      form: {
        name: attrs.name || '',
        company: attrs.company || '',
        avatar: attrs.avatar || null,
        headquarters: attrs.headquarters || '',
        industry: attrs.industry || '',
        teamSize: attrs.teamSize || '',
        website: attrs.website || '',
      },
      minTeamSize: 1,
    }
  },

  validations () {
    return {
      form: {
        name: { required },
        company: { required },
        headquarters: { required },
        industry: { required },
        teamSize: {
          required,
          integer,
          minValue: minValue(this.minTeamSize),
        },
        website: {
          required,
          validateUrl,
        },
      },
    }
  },

  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKycRecovery: vuexTypes.LOAD_KYC_RECOVERY,
    }),

    async submit () {
      this.disableForm()
      try {
        const ops = await this.former.buildOps()
        await api.postOperations(...ops)

        // TODO: after actions should not be here
        if (this.former.isUpdateOpBuilder) {
          await this.afterKycSubmit()
        } else if (this.former.isRecoveryOpBuilder) {
          await this.afterKycRecoverySubmit()
        }
        this.$emit('submitted')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },

    async afterKycSubmit () {
      await delay(config.RELOAD_TIMEOUT) // w8 for the horizon ingest
      await this.loadKyc() // update the current kyc state
      Bus.success('verification-form.request-submitted-msg')
    },

    async afterKycRecoverySubmit () {
      await delay(config.RELOAD_TIMEOUT)
      await this.loadAccount()
      await this.loadKycRecovery()
      Bus.success('kyc-recovery.request-submitted-msg')
    },

    async confirm () {
      if (!this.isFormValid()) return
      this.showConfirmation()
    },
  },
}
</script>
