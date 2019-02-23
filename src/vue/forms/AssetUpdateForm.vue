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
      class="app__form asset-update-form"
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
          <tick-field
            v-model="form.information.policies"
            :disabled="formMixin.isDisabled"
            :cb-value="ASSET_POLICIES.transferable"
          >
            {{ 'asset-form.transferable-lbl' | globalize }}
          </tick-field>
        </div>
      </div>

      <div class="app__form-row asset-update-form__kyc-required-row">
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
          class="asset-update-form__btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'asset-form.next-btn' | globalize }}
        </button>
      </div>
    </form>

    <form
      v-if="currentStep === STEPS.advanced.number"
      class="app__form asset-update-form"
      @submit.prevent="isFormValid() && showConfirmation()"
    >
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
          class="asset-update-form__btn"
          :disabled="formMixin.isDisabled"
        >
          {{ 'asset-form.submit-btn' | globalize }}
        </button>
      </div>
    </form>
  </form-stepper>

  <loader
    v-else-if="!isLoadingFailed"
    :message-id="'asset-form.loading-msg'"
  />

  <p v-else>
    {{ 'asset-form.loading-error-msg' | globalize }}
  </p>
</template>

<script>
import FormStepper from '@/vue/common/FormStepper'
import Loader from '@/vue/common/Loader'
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

import { DocumentUploader } from '@/js/helpers/document-uploader'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { RecordWrapper } from '@/js/records'
import { AssetUpdateRequestRecord } from '@/js/records/requests/asset-update.record'
import { AssetRecord } from '@/js/records/entities/asset.record'

import { Sdk } from '@/sdk'
import { base, ASSET_POLICIES } from '@tokend/js-sdk'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { required, maxLength } from '@validators'

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

const NAME_MAX_LENGTH = 255

export default {
  name: 'asset-update-form',
  components: {
    FormStepper,
    Loader,
  },
  mixins: [FormMixin],
  props: {
    request: { type: AssetUpdateRequestRecord, default: null },
    assetRecord: { type: AssetRecord, default: null },
  },

  data: _ => ({
    form: {
      information: {
        name: '',
        logo: null,
        policies: [],
      },
      advanced: {
        terms: null,
      },
    },
    updateRequest: {},
    isLoaded: false,
    isLoadingFailed: false,
    currentStep: 1,
    STEPS,
    DOCUMENT_TYPES,
    ASSET_POLICIES,
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
        },
      },
    }
  },

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
    }),

    assetRequestOpts () {
      const requestId = this.updateRequest.id || ASSET_CREATION_REQUEST_ID
      const logo = this.form.information.logo
      const terms = this.form.advanced.terms

      return {
        requestID: requestId,
        code: this.updateRequest.assetCode,
        policies: this.form.information.policies.reduce((a, b) => (a | b), 0),
        creatorDetails: {
          name: this.form.information.name,
          logo: logo ? logo.getDetailsForSave() : EMPTY_DOCUMENT,
          terms: terms ? terms.getDetailsForSave() : EMPTY_DOCUMENT,
        },
      }
    },
  },

  async created () {
    try {
      this.updateRequest = this.request ||
        await this.getUpdatableRequest(this.assetRecord.code) ||
        AssetUpdateRequestRecord.fromAssetRecord(this.assetRecord)

      this.populateForm(this.updateRequest)
      this.isLoaded = true
    } catch (e) {
      this.isLoadingFailed = true
      ErrorHandler.processWithoutFeedback(e)
    }
  },

  methods: {
    async getUpdatableRequest (assetCode) {
      const pendingRequests = await this.getAssetRequests(
        assetCode, REQUEST_STATES.pending
      )
      const rejectedRequests = await this.getAssetRequests(
        assetCode, REQUEST_STATES.rejected
      )

      const updatableRequests = pendingRequests
        .concat(rejectedRequests)
        .map(request => RecordWrapper.request(request))
        .filter(record => record instanceof AssetUpdateRequestRecord)

      return updatableRequests[0]
    },

    async getAssetRequests (assetCode, requestState) {
      const { data } = await Sdk.horizon.request.getAllForAssets({
        requestor: this.accountId,
        asset: assetCode,
        state: requestState,
      })

      return data
    },

    populateForm (request) {
      this.form = {
        information: {
          name: request.assetName,
          logo: request.logo.key
            ? new DocumentContainer(request.logo)
            : null,
          policies: request.policies,
        },
        advanced: {
          terms: request.terms.key
            ? new DocumentContainer(request.terms)
            : null,
        },
      }
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

        const operation =
          base.ManageAssetBuilder.assetUpdateRequest(this.assetRequestOpts)
        await Sdk.horizon.transactions.submitOperations(operation)
        Bus.success('asset-form.asset-request-submitted-msg')

        this.$emit(EVENTS.requestUpdated)
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
  },
}
</script>

<style lang="scss" scoped>
@import './app-form';

.asset-update-form__btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 14.4rem;
}

.asset-update-form__kyc-required-row {
  margin-top: 2.1rem;
}
</style>
