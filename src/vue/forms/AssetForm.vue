<template>
  <form-stepper
    v-if="isLoaded"
    :steps="STEPS"
    :current-step.sync="currentStep"
    :disabled="formMixin.isDisabled"
  >
    <form
      novalidate
      v-if="currentStep === STEPS.information.number"
      class="app__form asset-form"
      @submit.prevent="next('form.information')"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.information.name"
            @blur="touchField('form.information.name')"
            id="asset-name"
            :label="'asset-form.name-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.information.name',
              { length: NAME_MAX_LENGTH }
            )"
            :maxlength="NAME_MAX_LENGTH"
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
            id="asset-code"
            :label="'asset-form.code-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.information.code',
              { length: CODE_MAX_LENGTH }
            )"
            :maxlength="CODE_MAX_LENGTH"
            :disabled="formMixin.isDisabled || isUpdateMode"
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
            id="asset-max-issuance-amount"
            :label="'asset-form.max-issuance-amount-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.information.maxIssuanceAmount',
              { from: MIN_AMOUNT, to: MAX_AMOUNT }
            )"
            :disabled="formMixin.isDisabled || isUpdateMode"
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
            {{ 'asset-form.transferable-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row asset-form__kyc-required-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.information.policies"
            :disabled="formMixin.isDisabled"
            :cb-value="ASSET_POLICIES.requiresKyc"
          >
            {{ 'asset-form.kyc-required-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <file-field
            v-model="form.information.logo"
            :note="'asset-form.logo-note' | globalize"
            accept=".jpg, .png"
            :document-type="DOCUMENT_TYPES.assetLogo"
            :label="'asset-form.logo-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
      <div class="app__form-actions">
        <button
          v-ripple
          type="submit"
          class="asset-form__btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'asset-form.next-btn' | globalize }}
        </button>
      </div>
    </form>
    <form
      v-if="currentStep === STEPS.advanced.number"
      class="app__form asset-form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="app__form-row asset-form__kyc-required-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.advanced.isPreissuanceDisabled"
            :disabled="formMixin.isDisabled || isUpdateMode"
          >
            {{ 'asset-form.additional-issuance-check' | globalize }}
          </tick-field>
        </div>
      </div>
      <template v-if="!form.advanced.isPreissuanceDisabled">
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.advanced.preissuedAssetSigner"
              @blur="touchField('form.advanced.preissuedAssetSigner')"
              id="asset-preissued-asset-signer"
              :label="'asset-form.preissued-asset-signer-lbl' | globalize"
              :error-message="getFieldErrorMessage(
                'form.advanced.preissuedAssetSigner',
              )"
              :disabled="formMixin.isDisabled || isUpdateMode"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.advanced.initialPreissuedAmount"
              @blur="touchField('form.advanced.initialPreissuedAmount')"
              id="asset-initial-preissued-amount"
              :label="'asset-form.initial-preissued-amount-lbl' | globalize"
              :error-message="getFieldErrorMessage(
                'form.advanced.initialPreissuedAmount',
                { from: MIN_AMOUNT, to: form.information.maxIssuanceAmount }
              )"
              :disabled="formMixin.isDisabled || isUpdateMode"
            />
          </div>
        </div>
      </template>
      <div class="app__form-row">
        <div class="app__form-field">
          <file-field
            v-model="form.advanced.terms"
            :note="'asset-form.terms-note' | globalize"
            accept=".jpg, .png, .pdf"
            :document-type="DOCUMENT_TYPES.assetTerms"
            :label="'asset-form.terms-lbl' | globalize"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>
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
          class="asset-form__btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'asset-form.submit-btn' | globalize }}
        </button>
      </div>
    </form>
  </form-stepper>
  <loader
    v-else
    :message-id="'asset-form.loading-msg'"
  />
</template>

<script>
import FormStepper from '@/vue/common/FormStepper'
import Loader from '@/vue/common/Loader'
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { DocumentUploader } from '@/js/helpers/document-uploader'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { AssetCreateRequestRecord } from '@/js/records/requests/asset-create.record'
import { AssetUpdateRequestRecord } from '@/js/records/requests/asset-update.record'

import config from '@/config'
import { Sdk } from '@/sdk'
import { base, ASSET_POLICIES } from '@tokend/js-sdk'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { required, requiredUnless, amountRange, maxLength } from '@validators'

const STEPS = {
  information: {
    number: 1,
    titleId: 'asset-form.information-step',
  },
  advanced: {
    number: 2,
    titleId: 'asset-form.advanced-step',
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

const CODE_MAX_LENGTH = 16
const NAME_MAX_LENGTH = 255

export default {
  name: 'asset-form',
  components: {
    FormStepper,
    Loader,
  },
  mixins: [FormMixin],
  props: {
    request: { type: Object, default: _ => ({}) },
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
      advanced: {
        isPreissuanceDisabled: false,
        preissuedAssetSigner: '',
        initialPreissuedAmount: '',
        terms: null,
      },
    },
    isLoaded: false,
    currentStep: 1,
    STEPS,
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DOCUMENT_TYPES,
    ASSET_POLICIES,
    CODE_MAX_LENGTH,
    NAME_MAX_LENGTH,
  }),
  validations () {
    return {
      form: {
        information: {
          name: {
            required,
            maxLength: maxLength(NAME_MAX_LENGTH),
          },
          code: {
            required,
            maxLength: maxLength(CODE_MAX_LENGTH),
          },
          maxIssuanceAmount: {
            required,
            amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
          },
        },
        advanced: {
          preissuedAssetSigner: {
            required: requiredUnless(function () {
              return this.form.advanced.isPreissuanceDisabled
            }),
          },
          initialPreissuedAmount: {
            required: requiredUnless(function () {
              return this.form.advanced.isPreissuanceDisabled
            }),
            amountRange: amountRange(
              this.MIN_AMOUNT,
              this.form.information.maxIssuanceAmount
            ),
          },
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),
    assetRequestOpts () {
      const requestId = this.request.id || ASSET_CREATION_REQUEST_ID
      const logo = this.form.information.logo
      const terms = this.form.advanced.terms

      const preissuedAssetSigner = this.form.advanced.isPreissuanceDisabled
        ? config.NULL_ASSET_SIGNER
        : this.form.advanced.preissuedAssetSigner
      const initialPreissuedAmount = this.form.advanced.isPreissuanceDisabled
        ? this.form.information.maxIssuanceAmount
        : this.form.advanced.initialPreissuedAmount

      return {
        requestID: requestId,
        code: this.form.information.code,
        preissuedAssetSigner: preissuedAssetSigner,
        initialPreissuedAmount: initialPreissuedAmount,
        maxIssuanceAmount: this.form.information.maxIssuanceAmount,
        policies: this.form.information.policies.reduce((a, b) => (a | b), 0),
        details: {
          name: this.form.information.name,
          logo: logo ? logo.getDetailsForSave() : EMPTY_DOCUMENT,
          terms: terms ? terms.getDetailsForSave() : EMPTY_DOCUMENT,
        },
      }
    },
    isUpdateMode () {
      return this.request instanceof AssetUpdateRequestRecord
    },
  },
  async created () {
    await this.tryPopulateForm(this.request)
    this.isLoaded = true
  },
  methods: {
    async tryPopulateForm (request) {
      if (request.id) {
        try {
          const assetCreationRequest =
            await this.fetchAssetCreationRequest(request.assetCode)
          const assetRecord = new AssetCreateRequestRecord(
            assetCreationRequest
          )
          const isPreissuanceDisabled =
            assetRecord.preissuedAssetSigner === config.NULL_ASSET_SIGNER

          this.form = {
            information: {
              name: request.assetName,
              code: request.assetCode,
              maxIssuanceAmount: assetRecord.maxIssuanceAmount,
              logo: request.logo.key
                ? new DocumentContainer(request.logo)
                : null,
              policies: request.policies,
            },
            advanced: {
              isPreissuanceDisabled: isPreissuanceDisabled,
              preissuedAssetSigner: isPreissuanceDisabled
                ? ''
                : assetRecord.preissuedAssetSigner,
              initialPreissuedAmount: isPreissuanceDisabled
                ? ''
                : assetRecord.initialPreissuedAmount,
              terms: request.terms.key
                ? new DocumentContainer(request.terms)
                : null,
            },
          }
        } catch (e) {
          ErrorHandler.processWithoutFeedback(e)
        }
      }
    },
    async fetchAssetCreationRequest (assetCode) {
      const { data } = await Sdk.horizon.request.getAllForAssets({
        requestor: this.account.accountId,
      })
      return data.find(request => {
        return request.details.assetCreate &&
          request.details.assetCreate.code === assetCode
      })
    },
    next (formStep) {
      if (this.isFormValid(formStep)) {
        this.currentStep++
      }
    },
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        await this.uploadDocuments()
        let operation
        if (this.isUpdateMode) {
          operation =
            base.ManageAssetBuilder.assetUpdateRequest(this.assetRequestOpts)
        } else {
          operation =
            base.ManageAssetBuilder.assetCreationRequest(this.assetRequestOpts)
        }
        await Sdk.horizon.transactions.submitOperations(operation)
        Bus.success('asset-form.token-request-submitted-msg')
        if (this.request.id) {
          this.$emit(EVENTS.update)
        }
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },
    async uploadDocuments () {
      const documents = [
        this.form.information.logo,
        this.form.advanced.terms,
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

.asset-form__btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 14.4rem;
}

.asset-form {
  .asset-form__kyc-required-row {
    margin-top: 2.1rem;
  }
}
</style>
