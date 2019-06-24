<template>
  <div class="kyc-recovery-general-form">
    <p class="kyc-recovery-general-form__account-info-title">
      {{ 'verification-form.account-information-lbl' | globalize }}
    </p>
    <form
      novalidate
      class="app-form kyc-recovery-general-form__tag"
      @submit.prevent="isAllFormsValid() && showConfirmation()"
    >
      <section-country
        :is-disabled="formMixin.isDisabled"
        :is-country-change-disabled="isCountryChangeDisabled"
        ref="country-form"
      />
      <section-personal
        :is-disabled="formMixin.isDisabled"
        ref="personal-form"
      />
      <section-address
        :is-disabled="formMixin.isDisabled"
        ref="address-form"
      />
      <section-documents
        :is-disabled="formMixin.isDisabled"
        ref="documents-form"
      />

      <section-selfie
        :is-disabled="formMixin.isDisabled"
        :verification-code="verificationCode"
        ref="selfie-form"
      />
      <div class="app__form-actions">
        <form-confirmation
          v-if="formMixin.isConfirmationShown"
          @ok="hideConfirmation() || submit()"
          @cancel="hideConfirmation"
        />
        <button
          v-ripple
          v-else
          type="submit"
          class="kyc-recovery-general-form__submit-btn"
          :disabled="formMixin.isDisabled"
        >
          {{ (Number(requestId) > 0
            ? 'verification-form.update-btn'
            : 'verification-form.create-btn'
          ) | globalize }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'
import _get from 'lodash/get'

import { DocumentContainer } from '@/js/helpers/DocumentContainer'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { vuexTypes } from '@/vuex'
import { mapGetters } from 'vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'

import SectionCountry from './components/section-country'
import SectionPersonal from './components/section-personal'
import SectionAddress from './components/section-address'
import SectionDocuments from './components/section-documents'
import SectionSelfie from './components/section-selfie'
import SectionMixin from './components/section.mixin'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'kyc-recovery-general-form',
  components: {
    SectionCountry,
    SectionPersonal,
    SectionAddress,
    SectionDocuments,
    SectionSelfie,
  },
  mixins: [FormMixin, SectionMixin],
  props: {
    requestId: { type: String, default: '' },
    isFormDisabled: { type: Boolean, default: false },
  },
  data: _ => ({
    isCountryChangeDisabled: false,
    DOCUMENT_TYPES,
  }),

  computed: {
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    verificationCode () {
      return this.accountId.slice(1, 6)
    },
  },

  created () {
    if (this.isFormPopulateable) {
      this.form = this.parseKycData(this.latestRequestData)

      if (this.isFormDisabled) {
        this.disableForm()
      }
      // Disabling country change to prevent updating role for
      // unfulfilled requests. Is temporary until canceling change
      // role requests is implemented on backend:
      this.isCountryChangeDisabled = true
    }
  },

  methods: {
    isAllFormsValid () {
      let isValid = true

      // we need to trigger errors in all sections,
      // even if we've already found invalid one
      Object.values(this.$refs).forEach(ref => {
        if (!ref.isFormValid()) {
          isValid = false
        }
      })

      return isValid
    },
    async submit () {
      this.disableForm()
      try {
        await this.uploadDocuments()
        const requestData = this.getFormData()
        this.$emit(EVENTS.submit, requestData)
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
      this.enableForm()
    },

    parseKycData (kycData) {
      return {
        personal: {
          firstName: kycData.first_name,
          lastName: kycData.last_name,
        },
        documents: {
          avatar: this.wrapDocument(kycData, DOCUMENT_TYPES.kycAvatar),
          idDocument: this.wrapDocument(kycData, DOCUMENT_TYPES.kycIdDocument),
          verificationPhoto: this.wrapDocument(
            kycData,
            DOCUMENT_TYPES.kycSelfie,
          ),
        },
      }
    },

    wrapDocument (kycData, documentType) {
      if (_get(kycData, `documents.${documentType}.key`)) {
        return new DocumentContainer(kycData.documents[documentType])
      } else {
        return null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';
@import './scss/styles';

.kyc-recovery-general-form {
  margin-top: 4rem;
}

.kyc-recovery-general-form__tag {
  margin-top: 1rem;
  background-color: $col-block-bg;
  padding: 2.4rem;

  @include box-shadow();
}

.kyc-recovery-general-form__submit-btn {
  margin-right: auto;
  width: 100%;
  max-width: 20rem;

  @include button-raised();
}

.kyc-recovery-general-form__verification-code-btn {
  margin-top: 1.5rem;
}

.kyc-recovery-general-form__account-info-title {
  color: $col-primary;
  font-size: 1.3rem;
}

.kyc-recovery-general-form__block {
  &:not(:first-child) {
    .kyc-recovery-general-form__tag > & {
      margin-top: 6rem;
    }
  }
}

.kyc-recovery-general-form__block-label {
  font-size: 1.5rem;
  font-weight: 700;
}

.kyc-recovery-general-form__photo-explanation {
  font-size: 1.5rem;
}
</style>
