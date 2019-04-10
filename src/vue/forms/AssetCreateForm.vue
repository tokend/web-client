<template>
  <form-stepper
    :steps="STEPS"
    :current-step.sync="currentStep"
    :disabled="formMixin.isDisabled"
    v-if="kvAssetTypeKycRequired"
  >
    <form
      novalidate
      v-if="currentStep === STEPS.information.number"
      class="app__form asset-create-form"
      @submit.prevent="next('form.information')"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.information.name"
            @blur="touchField('form.information.name')"
            name="asset-create-name"
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
            name="asset-create-asset-code"
            :label="'asset-form.code-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.information.code',
              { length: CODE_MAX_LENGTH }
            )"
            :maxlength="CODE_MAX_LENGTH"
            :disabled="formMixin.isDisabled"
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
            name="asset-create-max-issuance-amount"
            :label="'asset-form.max-issuance-amount-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.information.maxIssuanceAmount',
              { from: MIN_AMOUNT, to: MAX_AMOUNT }
            )"
            :disabled="formMixin.isDisabled"
          />
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.information.assetType"
            name="asset-create-asset-type"
            key-as-value-text="label"
            :values="ASSET_TYPES"
            :label="'asset-form.asset-type' | globalize"
            :disabled="formMixin.isDisabled"
            @blur="touchField('form.information.assetType')"
            :error-message="getFieldErrorMessage(
              'form.information.assetType',
            )"
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

      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.information.policies"
            :disabled="formMixin.isDisabled"
            :cb-value="ASSET_POLICIES.withdrawable"
          >
            {{ 'asset-form.withdrawable-lbl' | globalize }}
          </tick-field>
        </div>
      </div>

      <div class="app__form-row">
        <div class="app__form-field">
          <file-field
            name="asset-create-logo"
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
          class="asset-create-form__btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'asset-form.next-btn' | globalize }}
        </button>
      </div>
    </form>

    <form
      v-if="currentStep === STEPS.advanced.number"
      class="app__form asset-create-form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.advanced.isPreissuanceDisabled"
            :disabled="formMixin.isDisabled"
          >
            {{ 'asset-form.additional-issuance-check' | globalize }}
          </tick-field>
        </div>
      </div>

      <template v-if="!form.advanced.isPreissuanceDisabled">
        <div class="app__form-row">
          <div class="app__form-field">
            <div class="issuance-form__pre-issued-asset-signer-wrp">
              <input-field
                white-autofill
                v-model="form.advanced.preissuedAssetSigner"
                @blur="touchField('form.advanced.preissuedAssetSigner')"
                name="asset-create-preissued-asset-signer"
                :label="'asset-form.preissued-asset-signer-lbl' | globalize"
                :error-message="getFieldErrorMessage(
                  'form.advanced.preissuedAssetSigner',
                )"
                :disabled="formMixin.isDisabled"
              />
              <button
                v-ripple
                type="button"
                class="app__button-flat issuance-form__insert-account-id-btn"
                @click="form.advanced.preissuedAssetSigner = accountId"
              >
                {{ 'asset-form.use-my-account-id-btn' | globalize }}
              </button>
            </div>
          </div>
        </div>

        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.advanced.initialPreissuedAmount"
              @blur="touchField('form.advanced.initialPreissuedAmount')"
              name="asset-create-initial-preissued-amount"
              :label="'asset-form.initial-preissued-amount-lbl' | globalize"
              :error-message="getFieldErrorMessage(
                'form.advanced.initialPreissuedAmount',
                { from: MIN_AMOUNT, to: form.information.maxIssuanceAmount }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
      </template>

      <div class="app__form-row">
        <div class="app__form-field">
          <file-field
            v-model="form.advanced.terms"
            name="asset-create-terms"
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
          class="asset-create-form__btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'asset-form.submit-btn' | globalize }}
        </button>
      </div>
    </form>
  </form-stepper>
  <loader
    v-else
    message-id="asset-form.loading-msg" />
</template>

<script>
import FormStepper from '@/vue/common/FormStepper'
import FormMixin from '@/vue/mixins/form.mixin'
import Loader from '@/vue/common/Loader'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { DocumentUploader } from '@/js/helpers/document-uploader'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { AssetCreateRequestRecord } from '@/js/records/requests/asset-create.record'

import config from '@/config'
import { Sdk } from '@/sdk'
import { base, ASSET_POLICIES } from '@tokend/js-sdk'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import { required, requiredUnless, amountRange, maxLength } from '@validators'
import { globalize } from '@/vue/filters/globalize'

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
  requestUpdated: 'request-updated',
  close: 'close',
}
const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}

const CODE_MAX_LENGTH = 16
const NAME_MAX_LENGTH = 255

const ASSET_TYPES = [
  {
    label: globalize('asset-form.asset-type-not-required-kyc'),
    value: '0',
  },
  {
    label: globalize('asset-form.asset-type-required-kyc'),
    value: null,
  },
]

export default {
  name: 'asset-create-form',
  components: {
    FormStepper,
    Loader,
  },
  mixins: [FormMixin],
  props: {
    request: { type: AssetCreateRequestRecord, default: null },
  },

  data: _ => ({
    form: {
      information: {
        name: '',
        code: '',
        maxIssuanceAmount: '',
        logo: null,
        policies: [],
        assetType: '',
      },
      advanced: {
        isPreissuanceDisabled: false,
        preissuedAssetSigner: '',
        initialPreissuedAmount: '',
        terms: null,
      },
    },
    currentStep: 1,
    STEPS,
    MIN_AMOUNT: config.MIN_AMOUNT,
    MAX_AMOUNT: config.MAX_AMOUNT,
    DOCUMENT_TYPES,
    ASSET_POLICIES,
    CODE_MAX_LENGTH,
    NAME_MAX_LENGTH,
    ASSET_TYPES,
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
          assetType: {
            required,
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
      accountId: vuexTypes.accountId,
      kvAssetTypeKycRequired: vuexTypes.kvAssetTypeKycRequired,
    }),

    assetRequestOpts () {
      const requestId = this.request
        ? this.request.id
        : ASSET_CREATION_REQUEST_ID
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
        assetType: this.getAssetTypeValue(
          this.form.information.assetType.value
        ),
        preissuedAssetSigner: preissuedAssetSigner,
        trailingDigitsCount: config.DECIMAL_POINTS,
        initialPreissuedAmount: initialPreissuedAmount,
        maxIssuanceAmount: this.form.information.maxIssuanceAmount,
        policies: this.form.information.policies.reduce((a, b) => (a | b), 0),
        creatorDetails: {
          name: this.form.information.name,
          logo: logo ? logo.getDetailsForSave() : EMPTY_DOCUMENT,
          terms: terms ? terms.getDetailsForSave() : EMPTY_DOCUMENT,
        },
      }
    },
  },

  created () {
    this.loadKvAssetTypeKycRequired()
    if (this.request) {
      this.populateForm()
    }
  },

  methods: {
    ...mapActions({
      loadKvAssetTypeKycRequired: vuexTypes.LOAD_KV_KYC_REQUIRED,
    }),
    populateForm () {
      const isPreissuanceDisabled =
          this.request.preissuedAssetSigner === config.NULL_ASSET_SIGNER

      this.form = {
        information: {
          name: this.request.assetName,
          code: this.request.assetCode,
          assetType: ASSET_TYPES
            .find(item => {
              const value = this.getAssetTypeValue(item.value)
              return value === String(this.request.assetType)
            }),
          maxIssuanceAmount: this.request.maxIssuanceAmount,
          logo: this.request.logo.key
            ? new DocumentContainer(this.request.logo)
            : null,
          policies: this.request.policies,
        },
        advanced: {
          isPreissuanceDisabled: isPreissuanceDisabled,
          preissuedAssetSigner: isPreissuanceDisabled
            ? ''
            : this.request.preissuedAssetSigner,
          initialPreissuedAmount: isPreissuanceDisabled
            ? ''
            : this.request.initialPreissuedAmount,
          terms: this.request.terms.key
            ? new DocumentContainer(this.request.terms)
            : null,
        },
      }
    },

    next (formStep) {
      if (this.isFormValid(formStep)) {
        this.$el.parentElement.scrollTop = 0
        this.currentStep++
      }
    },

    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      try {
        await this.uploadDocuments()
        const operation =
            base.ManageAssetBuilder.assetCreationRequest(this.assetRequestOpts)
        await Sdk.horizon.transactions.submitOperations(operation)
        Bus.success('asset-form.asset-request-submitted-msg')

        if (this.request) {
          this.$emit(EVENTS.requestUpdated)
        }

        this.$emit(EVENTS.close)
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
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
    getAssetTypeValue (value) {
      return value !== '0' ? String(this.kvAssetTypeKycRequired) : value
    },
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.asset-create-form__btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 14.4rem;
}

.asset-create-form__kyc-required-row {
  margin-top: 2.1rem;
}

.issuance-form__pre-issued-asset-signer-wrp {
  display: flex;
  align-items: center;
}

.issuance-form__insert-account-id-btn {
  margin-left: .4rem;
}
</style>
