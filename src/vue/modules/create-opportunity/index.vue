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
            v-for="item in FORM_TYPES"
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
              @input="touchField('form.information.maturityDate')"
              @blur="touchField('form.information.maturityDate')"
              name="create-sale-end-time"
              :label="'create-opportunity.maturity-date' | globalize"
              :error-message="getFieldErrorMessage(
                'form.information.maturityDate',
                {
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
              :min="MIN_ALLOWED_PERCENT"
              :max="MAX_ALLOWED_PERCENT"
              :step="1"
              v-model="form.saleInformation.annualReturn"
              @blur="touchField('form.saleInformation.annualReturn')"
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
                  from:MIN_ALLOWED_PERCENT,
                  to:MAX_ALLOWED_PERCENT
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
              :min="0"
              :max="maxAmount"
              :step="minAmount"
              v-model="form.information.maxIssuanceAmount"
              @blur="touchField('form.information.maxIssuanceAmount')"
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
              :file-extensions="['jpg', 'png', 'pdf']"
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
              name="create-sale-end-time"
              :label="'create-opportunity.close-time' | globalize"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.endTime', {
                  minDate: form.saleInformation.startTime ||
                    moment().toISOString(),
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
              :min="minAmount"
              :max="maxAmount"
              :step="minAmount"
              @blur="touchField('form.saleInformation.softCap')"
              name="create-sale-soft-cap"
              :label="'create-opportunity.soft-cap' | globalize({
                asset: form.saleInformation.defaultQuoteAsset
              })"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.softCap',
                {
                  hardCap: form.saleInformation.hardCap || '0'
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
              :min="0"
              :max="maxAmount"
              :step="minAmount"
              @blur="touchField('form.saleInformation.hardCap')"
              name="create-sale-hard-cap"
              :label="'create-opportunity.hard-cap' | globalize({
                asset: form.saleInformation.defaultQuoteAsset
              })"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.hardCap',
                {
                  softCap: form.saleInformation.softCap || '0'
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
              name="asset-create-asset-type"
              :label="
                'create-opportunity.investor-requirements' | globalize
              "
              :disabled="formMixin.isDisabled"
              @blur="touchField('form.saleInformation.assetType')"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.assetType',
              )"
            >
              <option
                v-for="assetType in assetTypes"
                :key="assetType.value"
                :value="assetType.value"
              >
                {{ assetType.label | globalize }}
              </option>
            </select-field>
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
              :file-extensions="['jpg', 'png']"
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
  </div>
  <loader
    v-else
    message-id="create-opportunity.loading-msg"
  />
</template>

<script>
import FormStepper from '@/vue/common/FormStepper'
import FormMixin from '@/vue/mixins/form.mixin'
import Loader from '@/vue/common/Loader'
import OpportunityCard from './components/opportunity-card'

import moment from 'moment'

import { uploadDocuments } from '@/js/helpers/upload-documents'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

import {
  base,
  ASSET_POLICIES,
  SALE_TYPES,
  BLOB_TYPES,
} from '@tokend/js-sdk'

import { api } from '@/api'
import { ASSET_SUBTYPE, ASSET_SUBTYPE_IMG_URL } from '@/js/const/asset-subtypes.const'

import { DateUtil } from '@/js/utils'
import { mapActions, mapGetters } from 'vuex'
import { MathUtil } from '@/js/utils/math.util'
import { types } from './store/types'
import { vuexTypes } from '@/vuex'
import {
  required,
  amountRange,
  maxLength,
  requiredAtLeastOne,
  softCapMoreThanHardCap,
  hardCapLessThanSoftCap,
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
const MIN_ALLOWED_PERCENT = 0
const MAX_ALLOWED_PERCENT = 100
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
const FORM_TYPES = [
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

export default {
  name: 'create-opportunity',
  components: {
    FormStepper,
    Loader,
    OpportunityCard,
  },
  mixins: [FormMixin],
  props: {
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
          maturityDate: '',
        },
        saleInformation: {
          startTime: '',
          endTime: '',
          softCap: '',
          hardCap: '',
          annualReturn: '',
          quoteAssets: [],
          assetType: '',
          policies: [],
          defaultQuoteAsset: '',
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
      FORM_TYPES,
      CODE_MAX_LENGTH,
      ASSET_SUBTYPE,
      DOCUMENT_TYPES,
      ASSET_POLICIES,
      NAME_MAX_LENGTH,
      DESCRIPTION_MAX_LENGTH,
      MIN_ALLOWED_PERCENT,
      MAX_ALLOWED_PERCENT,
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
        moment().toISOString()),
    }
    if (this.form.information.formType.value === ASSET_SUBTYPE.bond) {
      maturityDate = {
        required,
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
            softCapMoreThanHardCap: softCapMoreThanHardCap(
              this.minAmount,
              this.form.saleInformation.hardCap
            ),
          },
          hardCap: {
            required,
            hardCapLessThanSoftCap: hardCapLessThanSoftCap(
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
    ...mapGetters({
      baseAssets: vuexTypes.fiatAssets,
      assets: vuexTypes.assets,
      statsQuoteAsset: vuexTypes.statsQuoteAsset,
    }),
    ...mapGetters('create-opportunity', {
      pairs: types.pairs,
    }),
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
    isBond () {
      return this.form.information.formType.value === ASSET_SUBTYPE.bond
    },
    salePriceRatioStatsQuoteAsset () {
      return MathUtil.divide(
        this.form.saleInformation.hardCap,
        this.form.information.maxIssuanceAmount
      )
    },
  },
  watch: {
    'form.information.formType.value' () {
      this.assignDefaultAssetSubtype()
      this.assignDefaultQuoteAsset()
    },
    'form.saleInformation.quoteAssets' () {
      this.assignDefaultQuoteAsset()
    },
    'form.saleInformation.defaultQuoteAsset' () {
      this.form.saleInformation.softCap = ''
      this.form.saleInformation.hardCap = ''
    },
  },
  async created () {
    this.form.information.formType = this.FORM_TYPES[0]
    await this.loadAssets()
    await this.loadBaseAssetsPairs()
    this.kvAssetTypeKycRequired = await this.loadKvAssetTypeKycRequired()
    this.assignDefaultAssetSubtype()
    this.isInitialized = true
  },
  methods: {
    moment,
    formatDate,
    ...mapActions({
      loadAssets: vuexTypes.LOAD_ASSETS,
    }),
    ...mapActions('create-opportunity', {
      loadKvAssetTypeKycRequired: types.LOAD_KV_KYC_REQUIRED,
      getBlobId: types.LOAD_BLOB_ID,
      loadBaseAssetsPairs: types.LOAD_BASE_ASSETS_PAIRS_BY_STATS_QUOTE_ASSET,
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
        await uploadDocuments([
          this.form.shortBlurb.saleLogo,
          this.form.information.terms,
        ])
        const blobId = await this.getBlobId({
          type: BLOB_TYPES.saleOverview,
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
        await api.postOperations(
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
        defaultQuoteAsset: this.form.saleInformation.defaultQuoteAsset,
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
        assetType: this.form.saleInformation.assetType,
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
        operation.creatorDetails.investmentAsset = {
          asset: this.form.saleInformation.quoteAssets,
          price: this.salePriceRatioStatsQuoteAsset,
        }

        operation.creatorDetails.redeemPrice = MathUtil.add(
          MathUtil.percentOfValue(
            this.salePriceRatioStatsQuoteAsset,
            this.form.saleInformation.annualReturn
          ),
          this.salePriceRatioStatsQuoteAsset
        )
      } else {
        operation.creatorDetails.logoUrl = ASSET_SUBTYPE_IMG_URL.shareLogo
      }
      return base.ManageAssetBuilder.assetCreationRequest(operation)
    },
    formatSaleQuoteAssets () {
      if (this.isBond) {
        return [{
          asset: this.form.saleInformation.quoteAssets,
          price: this.salePriceRatioStatsQuoteAsset,
        }]
      } else {
        if (this.form.saleInformation.quoteAssets.length > 1) {
          return this.form.saleInformation.quoteAssets
            .map(asset => ({
              asset: asset,
              price: this.calculatePriceForBaseAsset(asset),
            }))
        } else {
          return [{
            asset: this.form.saleInformation.quoteAssets[0],
            price: this.salePriceRatioStatsQuoteAsset,
          }]
        }
      }
    },
    selectFormType (formType) {
      this.form.information.maturityDate = ''
      this.form.information.formType = formType
    },
    assignDefaultAssetSubtype () {
      if (this.isBond && this.baseAssets.length) {
        this.form.saleInformation.quoteAssets = this.baseAssets[0].code
      } else {
        this.form.saleInformation.quoteAssets = []
      }
    },
    assignDefaultQuoteAsset () {
      const quoteAssets = this.form.saleInformation.quoteAssets
      if (!this.isBond) {
        if (quoteAssets.length > 1) {
          // eslint-disable-next-line max-len
          this.form.saleInformation.defaultQuoteAsset = this.statsQuoteAsset.code
        } else {
          // eslint-disable-next-line max-len
          this.form.saleInformation.defaultQuoteAsset = quoteAssets[0] || this.statsQuoteAsset.code
        }
      } else {
        // eslint-disable-next-line max-len
        this.form.saleInformation.defaultQuoteAsset = this.form.saleInformation.quoteAssets
      }
    },
    calculatePriceForBaseAsset (asset) {
      if (asset === this.statsQuoteAsset.code) {
        return this.salePriceRatioStatsQuoteAsset
      } else {
        return MathUtil.divide(
          this.salePriceRatioStatsQuoteAsset,
          this.getAssetPairPrice(asset, this.statsQuoteAsset.code) || '1'
        )
      }
    },
    getAssetPairPrice (baseAsset, quoteAsset) {
      const assetPair = this.pairs.find(item =>
        item.baseAsset.id === baseAsset &&
        item.quoteAsset.id === quoteAsset
      )
      if (assetPair) {
        return assetPair.price
      }

      const reversedAssetPair = this.pairs.find(item =>
        item.quoteAsset.id === baseAsset &&
          item.baseAsset.id === quoteAsset
      )
      if (reversedAssetPair) {
        return MathUtil.divide(1, reversedAssetPair.price)
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
  margin-left: 0.4rem;
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
