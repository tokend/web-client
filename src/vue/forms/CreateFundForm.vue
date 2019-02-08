<template>
  <div class="create-fund">
    <template v-if="isLoaded && !isFailed">
      <template v-if="accountOwnedAssetCodes.length">
        <form-stepper
          :steps="STEPS"
          :current-step.sync="currentStep"
          :disabled="formMixin.isDisabled"
        >
          <form
            novalidate
            v-if="currentStep === STEPS.fundInformation.number"
            class="app__form"
            @submit.prevent="nextStep('form.fundInformation')"
          >
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  v-model="form.fundInformation.name"
                  @blur="touchField('form.fundInformation.name')"
                  id="fund-name"
                  :label="'create-fund-form.sale-name' | globalize"
                  :error-message="getFieldErrorMessage(
                    'form.fundInformation.name',{
                      length: NAME_MAX_LENGTH
                    })"
                  :maxlength="NAME_MAX_LENGTH"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                <select-field
                  :values="accountOwnedAssetCodes"
                  :disabled="formMixin.isDisabled"
                  v-model="form.fundInformation.baseAsset"
                  :label="'create-fund-form.base-asset' | globalize"
                />
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                <date-field
                  v-model="form.fundInformation.startTime"
                  :enable-time="false"
                  :disable-before="new Date().toString()"
                  @input="touchField('form.fundInformation.startTime')"
                  @blur="touchField('form.fundInformation.startTime')"
                  id="fund-start-time"
                  :label="'create-fund-form.start-time' | globalize"
                  :error-message="getFieldErrorMessage(
                    'form.fundInformation.startTime'
                  )"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                <date-field
                  v-model="form.fundInformation.endTime"
                  :enable-time="false"
                  :disable-before="new Date().toString()"
                  @input="touchField('form.fundInformation.endTime')"
                  @blur="touchField('form.fundInformation.endTime')"
                  id="fund-end-time"
                  :label="'create-fund-form.close-time' | globalize"
                  :error-message="getFieldErrorMessage(
                    'form.fundInformation.endTime',{
                      minDate: form.fundInformation.startTime ||
                        new Date().toString()
                    }
                  )"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  type="number"
                  v-model="form.fundInformation.softCap"
                  @blur="touchField('form.fundInformation.softCap')"
                  id="soft-cap"
                  :label="'create-fund-form.soft-cap' | globalize({
                    asset: config.DEFAULT_QUOTE_ASSET
                  })"
                  :error-message="getFieldErrorMessage(
                    'form.fundInformation.softCap',
                    {
                      from:MIN_AMOUNT,
                      to:MAX_AMOUNT
                    }
                  )"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  type="number"
                  v-model="form.fundInformation.hardCap"
                  @blur="touchField('form.fundInformation.hardCap')"
                  id="hard-cap"
                  :label="'create-fund-form.hard-cap' | globalize({
                    asset: config.DEFAULT_QUOTE_ASSET
                  })"
                  :error-message="getFieldErrorMessage(
                    'form.fundInformation.hardCap',
                    {
                      from:form.fundInformation.softCap,
                      to:MAX_AMOUNT
                    }
                  )"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  v-model="form.fundInformation.baseAssetForHardCap"
                  @blur="touchField('form.fundInformation.baseAssetForHardCap')"
                  id="base-asset-for-hard-cap"
                  type="number"
                  :label="'create-fund-form.base-asset-hard-cap-to-sell' |
                    globalize({
                      asset: form.fundInformation.baseAsset
                    })"
                  :error-message="getFieldErrorMessage(
                    'form.fundInformation.baseAssetForHardCap',
                    {
                      from:MIN_AMOUNT,
                      to:availableForIssuance
                    }
                  )"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                {{ 'create-fund-form.price' | globalize({
                  base: form.fundInformation.baseAsset,
                  quote: config.DEFAULT_QUOTE_ASSET
                }) }}
                <!-- eslint-disable-next-line max-len -->
                {{ { value: price, currency: config.DEFAULT_QUOTE_ASSET } | formatMoney }}
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              {{ 'create-fund-form.accept-investments-in' | globalize }}
            </div>
            <div
              class="app__form-row create-fund__form-row"
              v-for="item in baseAssetCodes"
              :key="item"
            >
              <div class="app__form-field">
                <tick-field
                  v-model="form.fundInformation.quoteAssets"
                  :disabled="formMixin.isDisabled"
                  :cb-value="item"
                >
                  {{ item }}
                </tick-field>
              </div>
            </div>
            <div class="create-fund__error-text">
              {{ getFieldErrorMessage('form.fundInformation.quoteAssets') }}
            </div>
            <div class="app__form-actions">
              <button
                v-ripple
                type="submit"
                class="app__button-raised"
                :disabled="formMixin.isDisabled"
              >
                {{ 'create-fund-form.next-btn' | globalize }}
              </button>
            </div>
          </form>
          <form
            novalidate
            v-if="currentStep === STEPS.shortBlurb.number"
            class="app__form"
            @submit.prevent="nextStep('form.shortBlurb')"
          >
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                <file-field
                  :label="
                    'create-fund-form.upload-image' | globalize
                  "
                  :note="
                    'create-fund-form.upload-image' | globalize
                  "
                  accept=".jpg, .png"
                  :document-type="DOCUMENT_TYPES.saleLogo"
                  v-model="form.shortBlurb.fundLogo"
                  :disabled="formMixin.isDisabled"
                  :error-message="getFieldErrorMessage(
                    'form.shortBlurb.fundLogo'
                  )"
                />
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                {{ 'create-fund-form.short-description' | globalize }}
                <textarea-field
                  id="fund-short-description"
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
                {{ 'create-fund-form.next-btn' | globalize }}
              </button>
            </div>
          </form>
          <form
            novalidate
            v-if="currentStep === STEPS.fullDescription.number"
            class="app__form"
            @submit.prevent="isFormValid() && showConfirmation()"
          >
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  v-model="form.fullDescription.youtubeId"
                  id="youtube-id"
                  :label="'create-fund-form.insert-youtube-video' | globalize"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                <iframe
                  v-if="form.fullDescription.youtubeId"
                  :src="`https://www.youtube.com/embed/${form.fullDescription.youtubeId}`"
                  class="create-fund__iframe" />
                <div v-else class="create-fund__youtub-video">
                  <i class="mdi mdi-youtube create-fund__video-icon" />
                  <span>
                    {{ 'create-fund-form.preview-you-video' | globalize }}
                  </span>
                </div>
              </div>
            </div>
            <div class="app__form-row create-fund__form-row">
              <div class="app__form-field">
                {{ 'create-fund-form.full-description' | globalize }}
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
                {{ 'create-fund-form.create-btn' | globalize }}
              </button>
              <form-confirmation
                v-if="formMixin.isConfirmationShown"
                @ok="hideConfirmation() || submit()"
                @cancel="hideConfirmation()"
              />
            </div>
          </form>
        </form-stepper>
      </template>
      <template v-else>
        <div class="create-fund__no-owned-assets">
          <i class="create-fund__no-owned-assets-icon mdi mdi-plus-network" />
          <h2>{{ 'create-fund-form.not-available' | globalize }}</h2>
          <p>{{ 'create-fund-form.asset-not-available-yet' | globalize }}</p>
        </div>
      </template>
    </template>
    <loader v-if="!isLoaded" />
    <template v-if="isFailed">
      {{ 'create-fund-form.can-not-load-assets' | globalize }}
    </template>
  </div>
</template>

<script>
import config from '@/config'
import Loader from '@/vue/common/Loader'
import FormMixin from '@/vue/mixins/form.mixin'
import FormStepper from '@/vue/common/FormStepper'
import DescriptionEditor from '@/vue/common/DescriptionEditor'

import { Sdk } from '@/sdk'
import { mapGetters } from 'vuex'
import { DateUtil, MathUtil } from '@/js/utils'
import { vuexTypes } from '@/vuex/types'
import {
  required,
  maxLength,
  amountRange,
  requiredAtLeastOne,
  minDate,
} from '@validators'
import { SALE_TYPES } from '@tokend/js-sdk'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'
import { DocumentUploader } from '@/js/helpers/document-uploader'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { SaleRequestRecord } from '@/js/records/requests/sale-create.record'

const STEPS = {
  fundInformation: {
    number: 1,
    titleId: 'create-fund-form.provide-fund-information',
  },
  shortBlurb: {
    number: 2,
    titleId: 'create-fund-form.add-short-blurb',
  },
  fullDescription: {
    number: 3,
    titleId: 'create-fund-form.full-description',
  },
}
const EVENTS = {
  close: 'close',
}
const NAME_MAX_LENGTH = 255
const DESCRIPTION_MAX_LENGTH = 255

export default {
  name: 'create-fund-form',
  components: {
    FormStepper,
    DescriptionEditor,
    Loader,
  },
  mixins: [FormMixin],
  props: {
    request: {
      type: SaleRequestRecord,
      default: _ => (new SaleRequestRecord()) },
  },
  data () {
    return {
      config,
      STEPS,
      NAME_MAX_LENGTH,
      DESCRIPTION_MAX_LENGTH,
      DOCUMENT_TYPES,
      MIN_AMOUNT: config.MIN_AMOUNT,
      MAX_AMOUNT: config.MAX_AMOUNT,
      isLoaded: false,
      isFailed: false,
      currentStep: 1,
      assets: [],
      form: {
        fundInformation: {
          name: '',
          baseAsset: '',
          startTime: '',
          endTime: '',
          softCap: '',
          hardCap: '',
          baseAssetForHardCap: '',
          quoteAssets: [],
        },
        shortBlurb: {
          fundLogo: null,
          shortDescription: '',
        },
        fullDescription: {
          youtubeId: '',
          description: '',
        },
      },
    }
  },
  validations () {
    return {
      form: {
        fundInformation: {
          name: {
            required,
            maxLength: maxLength(NAME_MAX_LENGTH),
          },
          baseAsset: {
            required,
          },
          startTime: {
            required,
          },
          endTime: {
            required,
            minDate: minDate(this.form.fundInformation.startTime ||
              new Date().toString()),
          },
          softCap: {
            required,
            amountRange: amountRange(this.MIN_AMOUNT, this.MAX_AMOUNT),
          },
          hardCap: {
            required,
            amountRange: amountRange(this.form.fundInformation.softCap,
              this.MAX_AMOUNT),
          },
          baseAssetForHardCap: {
            required,
            amountRange: amountRange(this.MIN_AMOUNT,
              this.availableForIssuance),
          },
          quoteAssets: {
            requiredAtLeastOne,
          },
        },
        shortBlurb: {
          fundLogo: {
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
    ...mapGetters([
      vuexTypes.accountId,
    ]),
    baseAssetCodes () {
      return this.assets.filter(item => item.isBaseAsset)
        .map(item => item.code)
    },
    accountOwnedAssetCodes () {
      return this.assets.filter(item => item.owner === this.accountId)
        .map(item => item.code)
    },
    availableForIssuance () {
      const asset = this.assets.filter(item => item.owner === this.accountId)
        .find(item => item.code === this.form.fundInformation.baseAsset)
      return asset.availableForIssuance
    },
    isUpdate () {
      return +this.request.id !== 0
    },
    price () {
      return MathUtil.divide(this.form.fundInformation.hardCap,
        this.form.fundInformation.baseAssetForHardCap)
    }
  },
  async created () {
    try {
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets.map(item => new AssetRecord(item))
      if (this.isUpdate) {
        this.populateForm(this.request)
        this.form.fundInformation.baseAsset = this.request.baseAsset
      } else {
        this.form.fundInformation.baseAsset = this.accountOwnedAssetCodes[0]
      }
      this.isLoaded = true
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
      this.isFailed = true
      this.isLoaded = true
    }
  },
  methods: {
    nextStep (formStep) {
      if (this.isFormValid(formStep)) {
        this.currentStep++
      }
    },
    async submit () {
      this.disableForm()
      try {
        await this.uploadDocuments()
        await Sdk.horizon.transactions.submitOperations(this.getOperation())
        Bus.success('create-fund-form.request-submitted-msg')
        this.enableForm()
        this.$emit(EVENTS.close)
      } catch (e) {
        ErrorHandler.process(e)
        this.enableForm()
      }
    },
    getOperation () {
      const operation = {
        requestID: this.isUpdate ? this.request.id : '0',
        baseAsset: this.form.fundInformation.baseAsset,
        defaultQuoteAsset: config.DEFAULT_QUOTE_ASSET,
        startTime: DateUtil.toTimestamp(this.form.fundInformation.startTime),
        endTime: DateUtil.toTimestamp(this.form.fundInformation.endTime),
        softCap: this.form.fundInformation.softCap,
        hardCap: this.form.fundInformation.hardCap,
        details: {
          name: this.form.fundInformation.name,
          short_description: this.form.shortBlurb.shortDescription,
          description: this.form.fullDescription.description,
          logo: this.form.shortBlurb.fundLogo.getDetailsForSave(),
          youtube_video_id: this.form.fullDescription.youtubeId,
        },
        baseAssetForHardCap: this.form.fundInformation.baseAssetForHardCap,
        quoteAssets: this.isUpdate ? this.form.fundInformation.quoteAssets
          : this.form.fundInformation.quoteAssets
            .map((item) => ({
              asset: item,
              price: '1',
            })),
        saleType: SALE_TYPES.fixedPrice,
      }
      return Sdk.base.SaleRequestBuilder.createSaleCreationRequest(operation)
    },
    async uploadDocuments () {
      const documents = [
        this.form.shortBlurb.fundLogo,
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
    populateForm (request) {
      this.form.fundInformation.name = request.name
      this.form.fundInformation.baseAsset = request.baseAsset
      this.form.fundInformation.startTime = request.startTime
      this.form.fundInformation.endTime = request.endTime
      this.form.fundInformation.softCap = request.softCap
      this.form.fundInformation.hardCap = request.hardCap
      this.form.fundInformation.baseAssetForHardCap = request
        .baseAssetForHardCap
      this.form.fundInformation.quoteAssets = request.quoteAssets
      this.form.shortBlurb.fundLogo = request.logo.key
        ? new DocumentContainer(request.logo)
        : null
      this.form.shortBlurb.shortDescription = request.shortDescription
      this.form.fullDescription.youtubeId = request.youtubeVideoId
      this.form.fullDescription.description = request.description
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~@scss/variables';

  .create-fund__form-row {
    margin-bottom: 2rem;
  }

  .create-fund__youtub-video {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 26.4rem;
    border: 0.2rem dashed $_eastBay;
    border-radius: 0.4rem;
    opacity: 0.5;
  }

  .create-fund__iframe {
    width: 100%;
    min-height: 26rem;
  }

  .create-fund__video-icon {
    display: flex;
    font-size: 9rem;
  }

  .create-fund__error-text {
    margin-bottom: 2rem;
    margin-top: -1rem;
    color: $col-error;
  }

  .create-fund__no-owned-assets {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .create-fund__no-owned-assets-icon {
    font-size: 6.4rem;
    opacity: 0.6;
  }
</style>
