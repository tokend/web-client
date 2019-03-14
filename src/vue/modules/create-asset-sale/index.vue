<template>
  <div class="create-asset-sale-form">
    <form-stepper
      :steps="STEPS"
      :current-step.sync="currentStep"
      :disabled="formMixin.isDisabled"
      v-if="kvAssetTypeKycRequired"
    >
      <form
        novalidate
        v-if="currentStep === STEPS.information.number"
        class="app__form create-asset-sale-form"
        @submit.prevent="nextStep('form.information')"
      >
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              v-model="form.information.formType"
              :is-value-translatable="true"
              name="asset-create-form-type"
              key-as-value-text="label"
              :values="formTypes"
              :disabled="formMixin.isDisabled"
              @blur="touchField('form.information.formType')"
              :error-message="getFieldErrorMessage(
                'form.information.formType',
              )"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.information.name"
              @blur="touchField('form.information.name')"
              id="asset-name"
              name="asset-create-name"
              :label="'create-asset-sale-form.opportunity-name' | globalize"
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
              name="asset-create-asset-code"
              :label="'create-asset-sale-form.opportunity-code' | globalize"
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
            <select-field
              v-model="form.information.assetType"
              :is-value-translatable="true"
              name="asset-create-asset-type"
              key-as-value-text="label"
              :values="assetTypes"
              :label="
                'create-asset-sale-form.investor-requirements' | globalize
              "
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
              {{ 'create-asset-sale-form.transferable-lbl' | globalize }}
            </tick-field>
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <file-field
              v-model="form.information.terms"
              name="asset-create-terms"
              :note="'create-asset-sale-form.terms-note' | globalize"
              accept=".jpg, .png, .pdf"
              :document-type="DOCUMENT_TYPES.assetTerms"
              :label="'create-asset-sale-form.terms-lbl' | globalize"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-actions">
          <button
            v-ripple
            type="submit"
            class="create-asset-sale-form__btn"
            :disabled="formMixin.isDisabled"
          >
            {{ 'create-asset-sale-form.next-btn' | globalize }}
          </button>
        </div>
      </form>

      <form
        novalidate
        v-if="currentStep === STEPS.saleInformation.number"
        class="app__form"
        @submit.prevent="nextStep('form.saleInformation')"
      >
        <div class="app__form-row">
          <div class="app__form-field">
            <date-field
              v-model="form.saleInformation.startTime"
              name="create-sale-start-time"
              :enable-time="true"
              @input="touchField('form.saleInformation.startTime')"
              @blur="touchField('form.saleInformation.startTime')"
              id="sale-start-time"
              :label="'create-asset-sale-form.start-time' | globalize"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.startTime',
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <date-field
              v-model="form.saleInformation.endTime"
              :enable-time="true"
              :disable-before="moment().subtract(1, 'days').toString()"
              @input="touchField('form.saleInformation.endTime')"
              @blur="touchField('form.saleInformation.endTime')"
              id="sale-end-time"
              name="create-sale-end-time"
              :label="'create-asset-sale-form.close-time' | globalize"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.endTime', {
                  minDate: form.saleInformation.startTime ||
                    formatDate(moment().toString())
                }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.saleInformation.softCap"
              @blur="touchField('form.saleInformation.softCap')"
              id="soft-cap"
              name="create-sale-soft-cap"
              :label="'create-asset-sale-form.soft-cap' | globalize({
                asset: statsQuoteAsset.code
              })"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.softCap',
                {
                  from:minAmount,
                  to:maxAmount
                }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.saleInformation.hardCap"
              @blur="touchField('form.saleInformation.hardCap')"
              id="hard-cap"
              name="create-sale-hard-cap"
              :label="'create-asset-sale-form.hard-cap' | globalize({
                asset: statsQuoteAsset.code
              })"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.hardCap',
                {
                  from:form.saleInformation.softCap,
                  to:maxAmount
                }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div
          class="app__form-row"
          v-if="form.information.formType.value === ASSET_SUBTYPE.bond"
        >
          <div class="app__form-field">
            <date-field
              v-model="form.saleInformation.maturityDate"
              :enable-time="true"
              :disable-before="moment().subtract(1, 'days').toString()"
              @input="touchField('form.saleInformation.maturityDate')"
              @blur="touchField('form.saleInformation.maturityDate')"
              id="sale-end-time"
              name="create-sale-end-time"
              :label="'create-asset-sale-form.maturity-date' | globalize"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.maturityDate', {
                  minDate: form.saleInformation.endTime ||
                    formatDate(moment().toString())
                }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.saleInformation.annualReturn"
              @blur="touchField('form.saleInformation.annualReturn')"
              id="hard-cap"
              name="create-sale-hard-cap"
              :label="
                form.information.formType.value ===
                  ASSET_SUBTYPE.bond ?
                    'create-asset-sale-form.annual-return' :
                    'create-asset-sale-form.expected-revenue' | globalize
              "
              :error-message="getFieldErrorMessage(
                'form.saleInformation.annualReturn',
                {
                  from:'0',
                  to:maxAmount
                }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          {{ 'create-asset-sale-form.accept-investments-in' | globalize }}
        </div>
        <div
          class="app__form-row"
          v-for="item in baseAssets"
          :key="item.code"
        >
          <div class="app__form-field">
            <tick-field
              :name="`create-sale-tick-${item.code}`"
              v-model="form.saleInformation.quoteAssets"
              :disabled="formMixin.isDisabled"
              :cb-value="item.code"
            >
              {{ item.nameAndCode }}
            </tick-field>
          </div>
        </div>
        <div class="create-asset-sale-form__error-text">
          {{ getFieldErrorMessage('form.saleInformation.quoteAssets') }}
        </div>
        <div class="app__form-actions">
          <button
            v-ripple
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'create-asset-sale-form.next-btn' | globalize }}
          </button>
        </div>
      </form>
      <form
        novalidate
        v-if="currentStep === STEPS.shortBlurb.number"
        class="app__form"
        @submit.prevent="isFormValid() && showConfirmation()"
      >
        <div class="app__form-row">
          <div class="app__form-field">
            <file-field
              :label="'create-asset-sale-form.cover-logo' | globalize"
              :note="'create-asset-sale-form.upload-image' | globalize"
              name="create-sale-sale-logo"
              accept=".jpg, .png"
              :document-type="DOCUMENT_TYPES.saleLogo"
              v-model="form.shortBlurb.saleLogo"
              :disabled="formMixin.isDisabled"
              :error-message="getFieldErrorMessage(
                'form.shortBlurb.saleLogo'
              )"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            {{ 'create-asset-sale-form.short-description' | globalize }}
            <textarea-field
              id="sale-short-description"
              name="create-sale-short-description"
              v-model="form.shortBlurb.shortDescription"
              @blur="touchField('form.shortBlurb.shortDescription')"
              :label="'create-asset-sale-form.subject-lbl' | globalize({
                length: DESCRIPTION_MAX_LENGTH
              })"
              :maxlength="DESCRIPTION_MAX_LENGTH"
              :error-message="getFieldErrorMessage(
                'form.shortBlurb.shortDescription', {
                  length: DESCRIPTION_MAX_LENGTH
                }
              )"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            {{ 'create-asset-sale-form.full-description' | globalize }}
            <description-editor
              v-model="form.shortBlurb.description"
            />
          </div>
        </div>
        <div class="app__form-actions">
          <button
            v-ripple
            v-if="!formMixin.isConfirmationShown"
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'create-asset-sale-form.submit-btn' | globalize }}
          </button>
          <form-confirmation
            v-if="formMixin.isConfirmationShown"
            :is-pending="isSubmitting"
            @ok="submit()"
            @cancel="hideConfirmation()"
          />
        </div>
      </form>
    </form-stepper>
    <loader
      v-else
      message-id="create-asset-sale-form.loading-msg"
    />
  </div>
</template>

<script>
import FormStepper from '@/vue/common/FormStepper'
import FormMixin from '@/vue/mixins/form.mixin'
import Loader from '@/vue/common/Loader'
import DescriptionEditor from '@/vue/common/DescriptionEditor'

import moment from 'moment'

import { DocumentUploader } from '@/js/helpers/document-uploader'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { Wallet, base, ASSET_POLICIES, SALE_TYPES } from '@tokend/js-sdk'
import { api, initApi } from './_api'
import { BLOB_TYPES } from '@/js/const/blob-types.const'
import { ASSET_SUBTYPE, ASSET_SUBTYPE_IMG_URL } from '@/js/const/asset-subtypes.const'

import { DateUtil } from '@/js/utils'
import { mapActions } from 'vuex'
import { types } from './store/types'
import {
  required,
  requiredUnless,
  amountRange,
  maxLength,
  requiredAtLeastOne,
  minDate,
} from '@validators'
import { formatDate } from '@/vue/filters/formatDate'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const STEPS = {
  information: {
    number: 1,
    titleId: 'create-asset-sale-form.information-step',
  },
  saleInformation: {
    number: 2,
    titleId: 'create-asset-sale-form.provide-sale-information',
  },
  shortBlurb: {
    number: 3,
    titleId: 'create-asset-sale-form.add-blurb',
  },
}

const CODE_MAX_LENGTH = 16
const NAME_MAX_LENGTH = 255
const DESCRIPTION_MAX_LENGTH = 255
const DEFAULT_SALE_TYPE = '0'
const ASSET_CREATION_REQUEST_ID = '0'
const EMPTY_DOCUMENT = {
  mime_type: '',
  name: '',
  key: '',
}
const EVENTS = {
  close: 'close',
}
export default {
  name: 'create-asset-sale-form',
  components: {
    FormStepper,
    Loader,
    DescriptionEditor,
  },
  mixins: [FormMixin],
  props: {
    wallet: {
      type: Wallet,
      required: true,
    },
    /**
     * @property config - the config for component to use
     * @property config.horizonURL - the url of horizon server (without version)
    */
    config: {
      type: Object,
      required: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    minAmount: {
      type: String,
      required: true,
    },
    maxAmount: {
      type: String,
      required: true,
    },
    decimalPints: {
      type: Number,
      required: true,
    },
  },
  data () {
    return {
      form: {
        information: {
          name: '',
          code: '',
          policies: [],
          assetType: '',
          formType: {},
          terms: null,
        },
        saleInformation: {
          startTime: '',
          endTime: '',
          maturityDate: '',
          softCap: '',
          hardCap: '',
          annualReturn: '',
          quoteAssets: [],
        },
        shortBlurb: {
          saleLogo: null,
          shortDescription: '',
          youtubeId: '',
          description: '',
        },
      },
      isSubmitting: false,
      currentStep: 1,
      STEPS,
      kvAssetTypeKycRequired: '',
      ASSET_SUBTYPE,
      DOCUMENT_TYPES,
      ASSET_POLICIES,
      CODE_MAX_LENGTH,
      NAME_MAX_LENGTH,
      DESCRIPTION_MAX_LENGTH,
    }
  },
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
          assetType: {
            required,
          },
          formType: {
            required,
          },
        },
        saleInformation: {
          startTime: {
            required,
          },
          endTime: {
            required,
            minDate: minDate(this.form.saleInformation.startTime ||
                moment().toString()),
          },
          maturityDate: {
            required: requiredUnless(function () {
              return this.form.information.formType.value ===
                  ASSET_SUBTYPE.bondCreation
            }),
            minDate: minDate(
              this.form.information.formType.value === ASSET_SUBTYPE.bond
                ? this.form.saleInformation.endTime : 0),
          },
          softCap: {
            required,
            amountRange: amountRange(this.minAmount, this.maxAmount),
          },
          hardCap: {
            required,
            amountRange: amountRange(this.form.saleInformation.softCap,
              this.maxAmount),
          },
          annualReturn: {
            required,
            amountRange: amountRange('0',
              this.maxAmount),
          },
          quoteAssets: {
            requiredAtLeastOne,
          },
        },
        shortBlurb: {
          saleLogo: {
            required,
          },
          shortDescription: {
            required,
            maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
          },
        },
      },
    }
  },
  computed: {
    formTypes () {
      return [
        {
          label: 'create-asset-sale-form.bond-creation',
          value: ASSET_SUBTYPE.bond,
        },
        {
          label: 'create-asset-sale-form.property-purchase',
          value: ASSET_SUBTYPE.share,
        },
      ]
    },
    assetTypes () {
      return [
        {
          label: 'create-asset-sale-form.asset-type-not-required-kyc',
          value: '0',
        },
        {
          label: 'create-asset-sale-form.asset-type-required-kyc',
          value: String(this.kvAssetTypeKycRequired),
        },
      ]
    },
    baseAssets () {
      return this.assets.filter(item => item.isBaseAsset)
    },
    statsQuoteAsset () {
      return this.assets.find(item => item.isStatsQuoteAsset)
    },
  },
  async created () {
    initApi(this.wallet, this.config)
    this.form.information.formType = this.formTypes[0]
    this.assets = await this.loadAssets()
    this.kvAssetTypeKycRequired = await this.loadKvAssetTypeKycRequired()
  },
  methods: {
    moment,
    formatDate,
    ...mapActions('create-asset-sale', {
      loadKvAssetTypeKycRequired: types.LOAD_KV_KYC_REQUIRED,
      getBlobId: types.LOAD_BLOB_ID,
      loadAssets: types.LOAD_ASSETS,
    }),
    nextStep (formStep) {
      if (this.isFormValid(formStep)) {
        this.currentStep++
      }
    },
    async submit () {
      if (!this.isFormValid()) return
      this.disableForm()
      this.isSubmitting = true
      try {
        await this.uploadDocuments()
        const blobId = await this.getBlobId({
          type: BLOB_TYPES.fundOverview,
          attributes: {
            value: JSON.stringify(this.form.shortBlurb.description),
          },
          relationships: {
            owner: {
              data: {
                id: this.accountId,
              },
            },
          },
        })
        const assetCreationOperation = this.buildAssetRequestOperation()
        const saleCreationOperation = this.buildSaleCreationOperation(blobId)
        await api().postOperations(
          assetCreationOperation,
          saleCreationOperation
        )
        Bus.success('create-asset-sale-form.successfully-submitted-msg')
        this.$emit(EVENTS.close)
        this.isSubmitting = false
      } catch (e) {
        this.isSubmitting = false
        this.enableForm()
        ErrorHandler.process(e)
      }
      this.hideConfirmation()
      this.enableForm()
    },
    buildSaleCreationOperation (saleDescriptionBlobId) {
      const operation = {
        requestID: this.isUpdateMode ? this.request.id : '0',
        baseAsset: this.form.information.code,
        defaultQuoteAsset: this.statsQuoteAsset.code,
        startTime: DateUtil.toTimestamp(this.form.saleInformation.startTime),
        endTime: DateUtil.toTimestamp(this.form.saleInformation.endTime),
        softCap: this.form.saleInformation.softCap,
        hardCap: this.form.saleInformation.hardCap,
        creatorDetails: {
          name: this.form.information.name,
          short_description: this.form.shortBlurb.shortDescription,
          description: saleDescriptionBlobId,
          logo: this.form.shortBlurb.saleLogo.getDetailsForSave(),
          youtube_video_id: this.form.shortBlurb.youtubeId,
        },
        requiredBaseAssetForHardCap: this.form.saleInformation.hardCap,
        quoteAssets: this.form.saleInformation.quoteAssets
          .map((item) => ({
            asset: item,
            price: '1',
          })),
        saleEnumType: SALE_TYPES.fixedPrice,
        saleType: DEFAULT_SALE_TYPE,
      }
      return base.SaleRequestBuilder.createSaleCreationRequest(operation)
    },
    buildAssetRequestOperation () {
      const requestId = this.request
        ? this.request.id
        : ASSET_CREATION_REQUEST_ID
      const terms = this.form.information.terms

      const operation = {
        requestID: requestId,
        code: this.form.information.code,
        assetType: this.form.information.assetType.value,
        preissuedAssetSigner: this.accountId,
        trailingDigitsCount: this.decimalPints,
        initialPreissuedAmount: this.form.saleInformation.hardCap,
        maxIssuanceAmount: this.form.saleInformation.hardCap,
        policies: this.form.information.policies.reduce((a, b) => (a | b), 0),
        creatorDetails: {
          name: this.form.information.name,
          logo: EMPTY_DOCUMENT,
          terms: terms ? terms.getDetailsForSave() : EMPTY_DOCUMENT,
          annualReturn: this.form.saleInformation.annualReturn,
          subtype: this.form.information.formType.value,
        },
      }
      if (this.form.information.formType.value === ASSET_SUBTYPE.bond) {
        operation.creatorDetails.maturityDate = DateUtil
          .toMs(this.form.saleInformation.maturityDate)
        operation.creatorDetails.logoUrl = ASSET_SUBTYPE_IMG_URL.bondLogo
      } else {
        operation.creatorDetails.logoUrl = ASSET_SUBTYPE_IMG_URL.shareLogo
      }
      return base.ManageAssetBuilder.assetCreationRequest(operation)
    },
    async uploadDocuments () {
      const documents = [
        this.form.shortBlurb.saleLogo,
        this.form.information.terms,
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
  @import '@/vue/forms/_app-form';

  .create-asset-sale-form__btn {
    @include button-raised();

    margin-bottom: 2rem;
    width: 14.4rem;
  }

  .create-asset-sale-form__kyc-required-row {
    margin-top: 2.1rem;
  }

  .create-asset-sale-form__pre-issued-asset-signer-wrp {
    display: flex;
    align-items: center;
  }

  .create-asset-sale-form__insert-account-id-btn {
    margin-left: .4rem;
  }

  .create-asset-sale-form__error-text {
    margin-bottom: 2rem;
    color: $col-error;
  }

  .create-asset-sale-form__price {
    font-size: 1.4rem;
  }
</style>
