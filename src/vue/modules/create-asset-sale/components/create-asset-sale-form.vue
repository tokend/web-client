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
            <input-field
              white-autofill
              v-model="form.information.name"
              @blur="touchField('form.information.name')"
              id="asset-name"
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
              id="asset-code"
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
              id="asset-max-issuance-amount"
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
              :values="assetTypes"
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
            class="create-asset-sale-form__btn"
            :disabled="formMixin.isDisabled"
          >
            {{ 'asset-form.next-btn' | globalize }}
          </button>
        </div>
      </form>
      <form
        v-if="currentStep === STEPS.advanced.number"
        class="app__form create-asset-sale-form"
        @submit.prevent="nextStep('form.information')"
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
              <div class="create-asset-sale-form__pre-issued-asset-signer-wrp">
                <input-field
                  white-autofill
                  v-model="form.advanced.preissuedAssetSigner"
                  @blur="touchField('form.advanced.preissuedAssetSigner')"
                  id="asset-preissued-asset-signer"
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
                  class="app__button-flat
                  create-asset-sale-form__insert-account-id-btn"
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
                id="asset-initial-preissued-amount"
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
          <button
            v-ripple
            type="submit"
            class="create-asset-sale-form__btn"
            :disabled="formMixin.isDisabled"
          >
            {{ 'asset-form.next-btn' | globalize }}
          </button>
        </div>
      </form>

      <form
        novalidate
        v-if="currentStep === STEPS.saleInformation.number"
        class="app__form"
        @submit.prevent="nextStep('form.saleInformation')"
      >
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.saleInformation.name"
              @blur="touchField('form.saleInformation.name')"
              id="sale-name"
              name="create-sale-name"
              :label="'create-sale-form.sale-name' | globalize"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.name',{
                  length: NAME_MAX_LENGTH
                })"
              :maxlength="NAME_MAX_LENGTH"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <select-field
              :values="accountOwnedAssets"
              name="create-sale-base-asset"
              :disabled="formMixin.isDisabled"
              v-model="form.saleInformation.baseAsset"
              key-as-value-text="nameAndCode"
              :label="'create-sale-form.base-asset' | globalize"
            />
          </div>
        </div>
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <date-field
              v-model="form.saleInformation.startTime"
              name="create-sale-start-time"
              :enable-time="true"
              :disable-before="moment().subtract(1, 'days').toString()"
              @input="touchField('form.saleInformation.startTime')"
              @blur="touchField('form.saleInformation.startTime')"
              id="sale-start-time"
              :label="'create-sale-form.start-time' | globalize"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.startTime', {
                  minDate: formatDate(moment().toString())
                }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <date-field
              v-model="form.saleInformation.endTime"
              :enable-time="true"
              :disable-before="moment().subtract(1, 'days').toString()"
              @input="touchField('form.saleInformation.endTime')"
              @blur="touchField('form.saleInformation.endTime')"
              id="sale-end-time"
              name="create-sale-end-time"
              :label="'create-sale-form.close-time' | globalize"
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
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.saleInformation.softCap"
              @blur="touchField('form.saleInformation.softCap')"
              id="soft-cap"
              name="create-sale-soft-cap"
              :label="'create-sale-form.soft-cap' | globalize({
                asset: config.DEFAULT_QUOTE_ASSET
              })"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.softCap',
                {
                  from:MIN_AMOUNT,
                  to:MAX_AMOUNT
                }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              type="number"
              v-model="form.saleInformation.hardCap"
              @blur="touchField('form.saleInformation.hardCap')"
              id="hard-cap"
              name="create-sale-hard-cap"
              :label="'create-sale-form.hard-cap' | globalize({
                asset: config.DEFAULT_QUOTE_ASSET
              })"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.hardCap',
                {
                  from:form.saleInformation.softCap,
                  to:MAX_AMOUNT
                }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.saleInformation.requiredBaseAssetForHardCap"
              @blur="touchField(
                'form.saleInformation.requiredBaseAssetForHardCap'
              )"
              id="base-asset-for-hard-cap"
              name="create-sale-base-asset-for-hard-cap"
              type="number"
              :label="'create-sale-form.base-asset-hard-cap-to-sell' |
                globalize({
                  asset: form.saleInformation.baseAsset.code
                })"
              :error-message="getFieldErrorMessage(
                'form.saleInformation.requiredBaseAssetForHardCap',
                {
                  from:MIN_AMOUNT,
                  to:availableForIssuance
                }
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <p class="create-asset-sale-form__price">
              {{ 'create-sale-form.price' | globalize({
                base: form.saleInformation.baseAsset.code,
                quote: config.DEFAULT_QUOTE_ASSET
              }) }}
              <!-- eslint-disable-next-line max-len -->
              {{ { value: price, currency: config.DEFAULT_QUOTE_ASSET } | formatMoney }}
            </p>
          </div>
        </div>
        <div class="app__form-row create-asset-sale-form__form-row">
          {{ 'create-sale-form.accept-investments-in' | globalize }}
        </div>
        <div
          class="app__form-row create-asset-sale-form__form-row"
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
            {{ 'create-sale-form.next-btn' | globalize }}
          </button>
        </div>
      </form>
      <form
        novalidate
        v-if="currentStep === STEPS.shortBlurb.number"
        class="app__form"
        @submit.prevent="nextStep('form.shortBlurb')"
      >
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <file-field
              :label="'create-sale-form.upload-image' | globalize"
              :note="'create-sale-form.upload-image' | globalize"
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
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            {{ 'create-sale-form.short-description' | globalize }}
            <textarea-field
              id="sale-short-description"
              name="create-sale-short-description"
              v-model="form.shortBlurb.shortDescription"
              @blur="touchField('form.shortBlurb.shortDescription')"
              :label="'transfer-form.subject-lbl' | globalize({
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
        <div class="app__form-actions">
          <button
            v-ripple
            type="submit"
            class="app__button-raised"
            :disabled="formMixin.isDisabled"
          >
            {{ 'create-sale-form.next-btn' | globalize }}
          </button>
        </div>
      </form>
      <form
        novalidate
        v-if="currentStep === STEPS.fullDescription.number"
        class="app__form"
        @submit.prevent="showConfirmation()"
      >
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.fullDescription.youtubeId"
              id="youtube-id"
              name="create-sale-youtube-id"
              :label="'create-sale-form.insert-youtube-video' | globalize"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            <iframe
              v-if="form.fullDescription.youtubeId"
              :src="`https://www.youtube.com/embed/${form.fullDescription.youtubeId}`"
              class="create-asset-sale-form__iframe" />
            <div v-else class="create-asset-sale-form__youtub-video">
              <i class="mdi mdi-youtube create-asset-sale-form__video-icon" />
              <span>
                {{ 'create-sale-form.preview-you-video' | globalize }}
              </span>
            </div>
          </div>
        </div>
        <div class="app__form-row create-asset-sale-form__form-row">
          <div class="app__form-field">
            {{ 'create-sale-form.full-description' | globalize }}
            <description-editor
              v-model="form.fullDescription.description"
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
            {{ 'create-sale-form.submit-btn' | globalize }}
          </button>
          <form-confirmation
            v-if="formMixin.isConfirmationShown"
            @ok="hideConfirmation() || submit()"
            @cancel="hideConfirmation()"
          />
        </div>
      </form>
    </form-stepper>
    <loader
      v-else
      message-id="asset-form.loading-msg" />
  </div>
</template>

<script>
import FormStepper from '@/vue/common/FormStepper'
import FormMixin from '@/vue/mixins/form.mixin'
import Loader from '@/vue/common/Loader'
import DescriptionEditor from './DescriptionEditor'

import config from '@/config'
import moment from 'moment'

import { DocumentUploader } from '@/js/helpers/document-uploader'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { base, ASSET_POLICIES, SALE_TYPES } from '@tokend/js-sdk'
import { api } from '../_api'
import { BLOB_TYPES } from '@/js/const/blob-types.const'

import { DateUtil, MathUtil } from '@/js/utils'
import { mapGetters, mapActions } from 'vuex'
import { types } from '../store/types'
import {
  required,
  requiredUnless,
  amountRange,
  maxLength,
  requiredAtLeastOne,
  minDate,
} from '@validators'
import { formatDate } from '@/vue/filters/formatDate'
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
  saleInformation: {
    number: 3,
    titleId: 'create-sale-form.provide-sale-information',
  },
  shortBlurb: {
    number: 4,
    titleId: 'create-sale-form.add-short-blurb',
  },
  fullDescription: {
    number: 5,
    titleId: 'create-sale-form.full-description',
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

export default {
  name: '',
  components: {
    FormStepper,
    Loader,
    DescriptionEditor,
  },
  mixins: [FormMixin],
  props: {
    accountId: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      form: {
        information: {
          name: 'Test 123',
          code: 'TST1',
          maxIssuanceAmount: '1234567',
          logo: null,
          policies: [1],
          assetType: '',
        },
        advanced: {
          isPreissuanceDisabled: true,
          preissuedAssetSigner: '',
          initialPreissuedAmount: '',
          terms: null,
        },
        saleInformation: {
          name: 'Fund Name Alala',
          baseAsset: 'TST1',
          startTime: '2019-03-29 12:00',
          endTime: '2019-05-29 12:00',
          softCap: '123',
          hardCap: '1234',
          requiredBaseAssetForHardCap: '12',
          quoteAssets: [],
        },
        shortBlurb: {
          saleLogo: null,
          shortDescription: 'Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description Short description',
        },
        fullDescription: {
          youtubeId: '',
          description: 'qeqwrqwerwqerw',
        },
      },
      currentStep: 1,
      STEPS,
      kvAssetTypeKycRequired: '',
      MIN_AMOUNT: config.MIN_AMOUNT,
      MAX_AMOUNT: config.MAX_AMOUNT,
      config,
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
        saleInformation: {
          name: {
            required,
            maxLength: maxLength(NAME_MAX_LENGTH),
          },
          baseAsset: {
            required,
          },
          startTime: {
            required,
            minDate: minDate(moment().toString()),
          },
          endTime: {
            required,
            minDate: minDate(this.form.saleInformation.startTime ||
              moment().toString()),
          },
          softCap: {
            required,
            amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
          },
          hardCap: {
            required,
            amountRange: amountRange(this.form.saleInformation.softCap,
              this.MAX_AMOUNT),
          },
          requiredBaseAssetForHardCap: {
            required,
            amountRange: amountRange(this.MIN_AMOUNT,
              this.availableForIssuance),
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
    ...mapGetters('create-asset-sale', [
    ]),
    assetTypes () {
      return [
        {
          label: globalize('asset-form.asset-type-not-required-kyc'),
          value: '0',
        },
        {
          label: globalize('asset-form.asset-type-required-kyc'),
          value: String(this.kvAssetTypeKycRequired),
        },
      ]
    },
    baseAssets () {
      return this.assets.filter(item => item.isBaseAsset)
    },
    accountOwnedAssets () {
      return ['accountOwnedAssets']
    },
    availableForIssuance () {
      return 1234
    },
    price () {
      return MathUtil.divide(this.form.saleInformation.hardCap,
        this.form.saleInformation.requiredBaseAssetForHardCap)
    },
  },
  watch: {},
  async created () {
    this.assets = await this.loadAssets()
    this.kvAssetTypeKycRequired = await this.loadKvAssetTypeKycRequired()
  },
  destroyed () {
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
      // if (!this.isFormValid()) return
      this.disableForm()
      try {
        await this.uploadDocuments()
        const blobIdthis = this.getBlobId({
          accountId: this.accountId,
          params: {
            type: BLOB_TYPES.fundOverview,
            attributes: {
              value: JSON.stringify(this.form.fullDescription.description),
            },
          },
        })
        const assetCreationOperation = this.assetRequestOpts()
        const saleCreationOperation = this.saleRequestOpts(blobIdthis)
        await api().postOperations(
          assetCreationOperation,
          saleCreationOperation
        )
        // Bus.success('asset-form.asset-request-submitted-msg')

        if (this.request) {
          // this.$emit(EVENTS.requestUpdated)
        }

        // this.$emit(EVENTS.close)
      } catch (e) {
        console.error(e)
        this.enableForm()
        // ErrorHandler.process(e)
      }
    },
    saleRequestOpts (saleDescriptionBlobId) {
      const operation = {
        requestID: this.isUpdateMode ? this.request.id : '0',
        baseAsset: this.form.information.code,
        defaultQuoteAsset: config.DEFAULT_QUOTE_ASSET,
        startTime: DateUtil.toTimestamp(this.form.saleInformation.startTime),
        endTime: DateUtil.toTimestamp(this.form.saleInformation.endTime),
        softCap: this.form.saleInformation.softCap,
        hardCap: this.form.saleInformation.hardCap,
        creatorDetails: {
          name: this.form.saleInformation.name,
          short_description: this.form.shortBlurb.shortDescription,
          description: saleDescriptionBlobId,
          logo: this.form.shortBlurb.saleLogo.getDetailsForSave(),
          youtube_video_id: this.form.fullDescription.youtubeId,
        },
        // eslint-disable-next-line
        requiredBaseAssetForHardCap: this.form.saleInformation.requiredBaseAssetForHardCap,
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

      const operation = {
        requestID: requestId,
        code: this.form.information.code,
        assetType: this.form.information.assetType.value,
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
      return base.ManageAssetBuilder.assetCreationRequest(operation)
    },
    async uploadDocuments () {
      const documents = [
        this.form.shortBlurb.saleLogo,
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

  .create-asset-sale-form__form-row {
    margin-bottom: 2rem;
  }

  .create-asset-sale-form__error-text {
    margin-bottom: 2rem;
    margin-top: -1rem;
    color: $col-error;
  }

  .create-asset-sale-form__price {
    font-size: 1.4rem;
  }
</style>
