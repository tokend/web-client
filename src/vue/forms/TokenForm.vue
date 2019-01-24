<template>
  <form
    novalidate
    class="app__form token-form"
    @submit.prevent="isFormValid() && showFormConfirmation()"
  >
    <form-stepper
      :steps="STEPS"
      :current-step.sync="currentStep"
    >
      <template v-if="currentStep === STEPS.information.number">
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.information.name"
              @blur="touchField('form.information.name')"
              id="token-name"
              :label="'token-form.name-lbl' | globalize"
              :error-message="getErrorMessage(
                'form.information.name',
                null,
                STEPS.information
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.information.code"
              @blur="touchField('form.information.code')"
              id="token-code"
              :label="'token-form.code-lbl' | globalize"
              :error-message="getErrorMessage(
                'form.information.code',
                null,
                STEPS.information
              )"
              :disabled="formMixin.isDisabled || isUpdateRequestType"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.information.maxIssuanceAmount"
              @blur="touchField('form.information.maxIssuanceAmount')"
              id="token-max-issuance-amount"
              :label="'token-form.max-issuance-amount-lbl' | globalize"
              :error-message="getErrorMessage(
                'form.information.maxIssuanceAmount',
                { from: MIN_AMOUNT, to: MAX_AMOUNT },
                STEPS.information
              )"
              :disabled="formMixin.isDisabled || isUpdateRequestType"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <tick-field
              v-model="form.information.policies"
              :disabled="formMixin.isDisabled"
              :cb-value="ASSET_POLICIES.transferable"
            >
              {{ 'token-form.transferable-lbl' | globalize }}
            </tick-field>
          </div>
        </div>
        <div class="app__form-row token-form__kyc-required-row">
          <div class="app__form-field">
            <tick-field
              v-model="form.information.policies"
              :disabled="formMixin.isDisabled"
              :cb-value="ASSET_POLICIES.requiresKyc"
            >
              {{ 'token-form.kyc-required-lbl' | globalize }}
            </tick-field>
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <file-field
              v-model="form.information.logo"
              :note="'token-form.logo-note' | globalize"
              accept=".jpg, .png"
              :document-type="DOCUMENT_TYPES.assetLogo"
              :label="'token-form.logo-lbl' | globalize"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-actions">
          <button
            v-ripple
            class="token-form__btn"
            :disabled="formMixin.isDisabled"
            @click.prevent="next('form.information')"
          >
            {{ 'token-form.next-btn' | globalize }}
          </button>
        </div>
      </template>
      <template v-if="currentStep === STEPS.terms.number">
        <div class="app__form-row">
          <div class="app__form-field">
            <file-field
              v-model="form.terms.terms"
              :note="'token-form.terms-note' | globalize"
              accept=".jpg, .png, .pdf"
              :document-type="DOCUMENT_TYPES.assetTerms"
              :label="'token-form.terms-lbl' | globalize"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-actions">
          <form-confirmation
            v-if="formMixin.isFormConfirmationShown"
            @ok="hideFormConfirmation() || submit()"
            @cancel="hideFormConfirmation"
          />
          <button
            v-ripple
            v-else
            type="submit"
            class="token-form__btn"
            :disabled="formMixin.isDisabled"
          >
            {{ 'token-form.submit-btn' | globalize }}
          </button>
        </div>
      </template>
    </form-stepper>
  </form>
</template>

<script>
import FormStepper from '@/vue/common/FormStepper'
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { DocumentUploader } from '@/js/helpers/document-uploader'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { AssetUpdateRequestRecord } from '@/js/records/requests/asset-update.record'

import config from '@/config'
import { Sdk } from '@/sdk'
import { base, ASSET_POLICIES, REQUEST_TYPES } from '@tokend/js-sdk'

import { required, amountRange } from '@validators'

const STEPS = {
  information: {
    number: 1,
    titleId: 'token-form.information-step',
  },
  terms: {
    number: 2,
    titleId: 'token-form.terms-step',
  },
}
const ASSET_CREATION_REQUEST_ID = '0'
const EVENTS = {
  update: 'update',
}
const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

export default {
  name: 'token-form',
  components: {
    FormStepper,
  },
  mixins: [FormMixin],
  props: {
    request: { type: Object, default: null },
  },
  data: _ => ({
    form: {
      information: {
        name: '',
        code: '',
        maxIssuanceAmount: '',
        logo: null,
        policies: [],
      },
      terms: {
        terms: null,
      },
    },
    currentStep: 1,
    STEPS,
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DOCUMENT_TYPES,
    ASSET_POLICIES,
  }),
  validations () {
    return {
      form: {
        information: {
          name: { required },
          code: { required },
          maxIssuanceAmount: {
            required,
            amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
          },
        },
      },
    }
  },
  computed: {
    tokenRequestOpts () {
      const requestId = this.request
        ? this.request.id
        : ASSET_CREATION_REQUEST_ID
      const logo = this.form.information.logo
      const terms = this.form.terms.terms

      return {
        requestID: requestId,
        code: this.form.information.code,
        preissuedAssetSigner: config.NULL_ASSET_SIGNER,
        initialPreissuedAmount: this.form.information.maxIssuanceAmount,
        maxIssuanceAmount: this.form.information.maxIssuanceAmount,
        policies: this.form.information.policies.reduce((a, b) => (a | b), 0),
        details: {
          name: this.form.information.name,
          logo: logo ? logo.getDetailsForSave() : EMPTY_DOCUMENT,
          terms: terms ? terms.getDetailsForSave() : EMPTY_DOCUMENT,
        },
      }
    },
    isUpdateRequestType () {
      return this.request &&
        this.request.requestTypeI === REQUEST_TYPES.assetUpdate
    },
  },
  created () {
    if (this.request) {
      this.setForm()
    }
  },
  methods: {
    setForm () {
      this.form = {
        information: {
          name: this.request.assetName,
          code: this.request.assetCode,
          maxIssuanceAmount: this.request.maxIssuanceAmount,
          logo: this.request.logo.key
            ? new DocumentContainer(this.request.logo)
            : null,
          policies: this.request.policies,
        },
        terms: {
          terms: this.request.terms.key
            ? new DocumentContainer(this.request.terms)
            : null,
        },
      }
    },
    next (formStep) {
      this.hideFormConfirmation()
      if (this.isFormValid(formStep)) {
        this.currentStep++
      }
    },
    getErrorMessage (field, opts, step) {
      if (this.currentStep === step.number) {
        return this.getFieldErrorMessage(field, opts)
      } else {
        return ''
      }
    },
    async submit () {
      if (!this.isFormValid()) return

      this.disableForm()
      try {
        await this.uploadDocuments()
        let operation
        if (this.request instanceof AssetUpdateRequestRecord) {
          operation =
            base.ManageAssetBuilder.assetUpdateRequest(this.tokenRequestOpts)
        } else {
          operation =
            base.ManageAssetBuilder.assetCreationRequest(this.tokenRequestOpts)
        }
        await Sdk.horizon.transactions.submitOperations(operation)
        Bus.success('token-form.token-request-submitted-msg')
        if (this.request) {
          this.$emit(EVENTS.update)
        }
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async uploadDocuments () {
      const documents = [
        this.form.information.logo,
        this.form.terms.terms,
      ]
      for (let document of documents) {
        if (document && !document.key) {
          const documentKey = await DocumentUploader.uploadDocument(
            document.getDetailsForUpload()
          )
          document.setKey(documentKey)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.token-form__btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 14.4rem;
}

.token-form {
  .token-form__kyc-required-row {
    margin-top: 2.1rem;
  }
}
</style>
