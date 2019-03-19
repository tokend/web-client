<template>
  <div class="create-opportunity" v-if="isInitialized">
    <form-stepper
      :steps="STEPS"
      :current-step.sync="currentStep"
      :disabled="formMixin.isDisabled"
      v-if="kvAssetTypeKycRequired"
    >
      <form
        novalidate
        v-if="currentStep === STEPS.information.number"
        class="app__form create-opportunity"
        @submit.prevent="nextStep('form.information')"
      >
        <div class="create-opportunity__cards">
          <opportunity-card
            v-for="item in formTypes"
            :key="item.value"
            :is-select="form.information.formType.value === item.value"
            :title="item.label | globalize"
            :label="item.description | globalize"
            @click="selectFormType(item)"
          />
          <opportunity-card
            :disabled="true"
            :is-select="false"
            :title="'create-opportunity.loan' | globalize"
            :label="'create-opportunity.loan-description'| globalize"
          />
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.information.name"
              @blur="touchField('form.information.name')"
              id="asset-name"
              name="asset-create-name"
              :label="'create-opportunity.opportunity-name' | globalize"
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
              :label="'create-opportunity.opportunity-code' | globalize"
              :error-message="getFieldErrorMessage(
                'form.information.code',
                { length: CODE_MAX_LENGTH }
              )"
              :maxlength="CODE_MAX_LENGTH"
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
              v-model="form.information.maturityDate"
              :enable-time="true"
              :disable-before="moment().subtract(1, 'days').toString()"
              @input="touchField('form.information.maturityDate')"
              @blur="touchField('form.information.maturityDate')"
              id="sale-end-time"
              name="create-sale-end-time"
              :label="'create-opportunity.maturity-date' | globalize"
              :error-message="getFieldErrorMessage(
                'form.information.maturityDate',
                {
                  minDate: form.saleInformation.endTime ||
                    formatDate(moment().toString()),
                  maxDate: form.information.maturityDate
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
              id="anual-return"
              name="create-sale-anual-return"
              :label="
                form.information.formType.value ===
                  ASSET_SUBTYPE.bond ?
                    'create-opportunity.annual-return' :
                    'create-opportunity.expected-revenue' | globalize
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
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.information.maxIssuanceAmount"
              @blur="touchField('form.information.maxIssuanceAmount')"
              id="max-issuance-amount"
              name="create-sale-max-issuance-amount"
              :label="'create-opportunity.max-issuance-amount' | globalize"
              :error-message="getFieldErrorMessage(
                'form.information.maxIssuanceAmount',
                {
                  from: minAmount,
                  to: maxAmount
                }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <file-field
              v-model="form.information.terms"
              name="asset-create-terms"
              :note="'create-opportunity.terms-note' | globalize"
              accept=".jpg, .png, .pdf"
              :document-type="DOCUMENT_TYPES.assetTerms"
              :label="'create-opportunity.terms-lbl' | globalize"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-actions">
          <button
            v-ripple
            type="submit"
            class="create-opportunity__btn app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'create-opportunity.next-btn' | globalize }}
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
              :disable-after="form.information.maturityDate
                ? moment(form.information.maturityDate)
                  .subtract(1, 'days').toString() : ''"
              @input="touchField('form.saleInformation.startTime')"
              @blur="touchField('form.saleInformation.startTime')"
              id="sale-start-time"
              :label="'create-opportunity.start-time' | globalize"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.startTime', {
                  maxDate: form.information.maturityDate
                }
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
              :disable-after="moment(form.information.maturityDate)
                .subtract(1, 'days').toString()"
              @input="touchField('form.saleInformation.endTime')"
              @blur="touchField('form.saleInformation.endTime')"
              id="sale-end-time"
              name="create-sale-end-time"
              :label="'create-opportunity.close-time' | globalize"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.endTime', {
                  minDate: form.saleInformation.startTime ||
                    formatDate(moment().toString()),
                  maxDate: form.information.maturityDate
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
              :label="'create-opportunity.soft-cap' | globalize({
                asset: isBond
                  ? form.saleInformation.quoteAssets
                  : statsQuoteAsset.code
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
              :label="'create-opportunity.hard-cap' | globalize({
                asset: isBond
                  ? form.saleInformation.quoteAssets
                  : statsQuoteAsset.code
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
        <div class="app__form-row">
          <div class="app__form-field">
            <select-field
              v-model="form.saleInformation.assetType"
              :is-value-translatable="true"
              name="asset-create-asset-type"
              key-as-value-text="label"
              :values="assetTypes"
              :label="
                'create-opportunity.investor-requirements' | globalize
              "
              :disabled="formMixin.isDisabled"
              @blur="touchField('form.saleInformation.assetType')"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.assetType',
              )"
            />
          </div>
        </div>
        <div class="app__form-row">
          <div class="app__form-field">
            <tick-field
              v-model="form.saleInformation.policies"
              :disabled="formMixin.isDisabled"
              :cb-value="ASSET_POLICIES.transferable"
            >
              {{ 'create-opportunity.transferable-lbl' | globalize }}
            </tick-field>
          </div>
        </div>
        <div class="app__form-row">
          {{ 'create-opportunity.accept-investments-in' | globalize }}
        </div>
        <template v-if="form.information.formType.value !== ASSET_SUBTYPE.bond">
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
        </template>
        <template v-else>
          <div
            class="app__form-row"
            v-for="item in baseAssets"
            :key="item.code"
          >
            <div class="app__form-field">
              <radio-field
                :key="`radio-field-${item.code}`"
                name="create-sale-radio-asset-code"
                v-model="form.saleInformation.quoteAssets"
                :active="form.saleInformation.quoteAssets"
                :cb-value="item.code"
                :disabled="formMixin.isDisabled"
              >
                {{ item.nameAndCode }}
              </radio-field>
            </div>
          </div>
        </template>
        <div class="create-opportunity__error-text">
          {{ getFieldErrorMessage('form.saleInformation.quoteAssets') }}
        </div>
        <div class="app__form-actions">
          <button
            v-ripple
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'create-opportunity.next-btn' | globalize }}
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
              :label="'create-opportunity.cover-logo' | globalize"
              :note="'create-opportunity.upload-image' | globalize"
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
            {{ 'create-opportunity.short-description' | globalize }}
            <textarea-field
              id="sale-short-description"
              name="create-sale-short-description"
              v-model="form.shortBlurb.shortDescription"
              @blur="touchField('form.shortBlurb.shortDescription')"
              :label="'create-opportunity.subject-lbl' | globalize({
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
            {{ 'create-opportunity.full-description' | globalize }}
            <markdown-field
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
            {{ 'create-opportunity.submit-btn' | globalize }}
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
      message-id="create-opportunity.loading-msg"
    />
  </div>
</template>

<script>
import FormStepper from '@/vue/common/FormStepper'
import FormMixin from '@/vue/mixins/form.mixin'
import Loader from '@/vue/common/Loader'
import OpportunityCard from './components/opportunity-card'

import moment from 'moment'

import { DocumentUploader } from '@/js/helpers/document-uploader'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { Wallet, base, ASSET_POLICIES, SALE_TYPES } from '@tokend/js-sdk'
import { AssetRecord } from './wrappers/asset.record'
import { api, initApi } from './_api'
import { BLOB_TYPES } from '@/js/const/blob-types.const'
import { ASSET_SUBTYPE, ASSET_SUBTYPE_IMG_URL } from '@/js/const/asset-subtypes.const'

import { DateUtil } from '@/js/utils'
import { mapActions } from 'vuex'
import { MathUtil } from '@/js/utils/math.util'
import { types } from './store/types'
import {
  required,
  amountRange,
  maxLength,
  requiredAtLeastOne,
  minDate,
  maxDate,
} from '@validators'
import { formatDate } from '@/vue/filters/formatDate'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const STEPS = {
  information: {
    number: 1,
    titleId: 'create-opportunity.information-step',
  },
  saleInformation: {
    number: 2,
    titleId: 'create-opportunity.provide-sale-information',
  },
  shortBlurb: {
    number: 3,
    titleId: 'create-opportunity.add-blurb',
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
  name: 'create-opportunity',
  components: {
    FormStepper,
    Loader,
    OpportunityCard,
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
          maxIssuanceAmount: '',
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
          assetType: '',
          policies: [],
        },
        shortBlurb: {
          saleLogo: null,
          shortDescription: '',
          youtubeId: '',
          description: '',
        },
      },
      isInitialized: false,
      isSubmitting: false,
      currentStep: 1,
      STEPS,
      kvAssetTypeKycRequired: '',
      CODE_MAX_LENGTH,
      ASSET_SUBTYPE,
      DOCUMENT_TYPES,
      ASSET_POLICIES,
      NAME_MAX_LENGTH,
      DESCRIPTION_MAX_LENGTH,
    }
  },
  validations () {
    let maturityDate = {}
    let startTime = {
      required,
    }
    let endTime = {
      required,
      minDate: minDate(this.form.saleInformation.startTime ||
        moment().toString()),
    }
    if (this.form.information.formType.value === ASSET_SUBTYPE.bond) {
      maturityDate = {
        required,
        minDate: minDate(moment().toString()),
      }
      startTime.maxDate = maxDate(this.form.information.maturityDate)
      endTime.maxDate = maxDate(this.form.information.maturityDate)
    }
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
          maturityDate: maturityDate,
          maxIssuanceAmount: {
            required,
            amountRange: amountRange(
              this.minAmount,
              this.maxAmount
            ),
          },
        },
        saleInformation: {
          startTime: startTime,
          endTime: endTime,
          softCap: {
            required,
            amountRange: amountRange(
              this.minAmount,
              this.form.information.maxIssuanceAmount
            ),
          },
          hardCap: {
            required,
            amountRange: amountRange(
              this.form.saleInformation.softCap,
              this.maxAmount
            ),
          },
          quoteAssets: {
            requiredAtLeastOne,
          },
          assetType: {
            required,
          },
          annualReturn: {
            required,
            amountRange: amountRange(
              '0',
              '100'
            ),
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
          label: 'create-opportunity.bond-creation',
          value: ASSET_SUBTYPE.bond,
          description: 'create-opportunity.bond-description',
        },
        {
          label: 'create-opportunity.property-purchase',
          value: ASSET_SUBTYPE.share,
          description: 'create-opportunity.revenue-description',
        },
      ]
    },
    assetTypes () {
      return [
        {
          label: 'create-opportunity.asset-type-not-required-kyc',
          value: '0',
        },
        {
          label: 'create-opportunity.asset-type-required-kyc',
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
    isBond () {
      return this.form.information.formType.value === ASSET_SUBTYPE.bond
    },
  },
  watch: {
    'form.information.formType.value' () {
      this.checkDefaultAssetSubtype()
    },
  },
  async created () {
    initApi(this.wallet, this.config)
    this.form.information.formType = this.formTypes[0]
    const response = await this.loadAssets()
    this.assets = response.map(item => new AssetRecord(item))
    this.kvAssetTypeKycRequired = await this.loadKvAssetTypeKycRequired()
    this.checkDefaultAssetSubtype()
    this.isInitialized = true
  },
  methods: {
    moment,
    formatDate,
    ...mapActions('create-opportunity', {
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
        Bus.success('create-opportunity.successfully-submitted-msg')
        this.$emit(EVENTS.close)
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
      this.isSubmitting = false
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
          annualReturn: this.form.saleInformation.annualReturn,
        },
        requiredBaseAssetForHardCap: this.form.information.maxIssuanceAmount,
        quoteAssets: this.formatSaleQuoteAssets(),
        saleEnumType: SALE_TYPES.basicSale,
        saleType: DEFAULT_SALE_TYPE,
      }
      if (this.isBond) {
        operation.defaultQuoteAsset = this.form.saleInformation.quoteAssets
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
        assetType: this.form.saleInformation.assetType.value,
        preissuedAssetSigner: this.accountId,
        trailingDigitsCount: this.decimalPints,
        initialPreissuedAmount: this.form.information.maxIssuanceAmount,
        maxIssuanceAmount: this.form.information.maxIssuanceAmount,
        policies: this.form.saleInformation.policies
          .reduce((a, b) => (a | b), 0),
        creatorDetails: {
          name: this.form.information.name,
          logo: EMPTY_DOCUMENT,
          terms: terms ? terms.getDetailsForSave() : EMPTY_DOCUMENT,
          annualReturn: this.form.saleInformation.annualReturn,
          subtype: this.form.information.formType.value,
        },
      }
      if (this.isBond) {
        operation.creatorDetails.maturityDate = DateUtil
          .toMs(this.form.information.maturityDate)
        operation.creatorDetails.logoUrl = ASSET_SUBTYPE_IMG_URL.bondLogo
        operation.creatorDetails.investmentToken = {
          asset: this.form.saleInformation.quoteAssets,
          price: '1',
        }

        const saleFixedPrice = MathUtil.divide(
          this.form.saleInformation.hardCap,
          this.form.information.maxIssuanceAmount
        )
        operation.creatorDetails.redeemPrice = MathUtil.add(
          MathUtil.percent(
            saleFixedPrice,
            this.form.saleInformation.annualReturn
          ),
          saleFixedPrice
        )
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
    formatSaleQuoteAssets () {
      if (Array.isArray(this.form.saleInformation.quoteAssets)) {
        return this.form.saleInformation.quoteAssets
          .map((item) => ({
            asset: item,
            price: '1',
          }))
      } else {
        return [{
          asset: this.form.saleInformation.quoteAssets,
          price: '1',
        }]
      }
    },
    selectFormType (formType) {
      this.form.information.maturityDate = ''
      this.form.information.formType = formType
    },
    checkDefaultAssetSubtype () {
      if (this.isBond) {
        this.form.saleInformation.quoteAssets = this.baseAssets[0].code
      } else {
        this.form.saleInformation.quoteAssets = []
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/vue/forms/_app-form';

.create-opportunity__btn {
  margin-bottom: 2rem;
  width: 14.4rem;
}

.create-opportunity__kyc-required-row {
  margin-top: 2.1rem;
}

.create-opportunity__pre-issued-asset-signer-wrp {
  display: flex;
  align-items: center;
}

.create-opportunity__insert-account-id-btn {
  margin-left: .4rem;
}

.create-opportunity__error-text {
  margin-bottom: 2rem;
  color: $col-error;
}

.create-opportunity__price {
  font-size: 1.4rem;
}

.create-opportunity__cards {
  width: 100%;
  display: flex;
}
</style>
