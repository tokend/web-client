<template>
  <div class="create-sale">
    <template v-if="isLoaded && !isFailed">
      <template v-if="accountOwnedAssetCodes.length">
        <form-stepper
          :steps="STEPS"
          :current-step.sync="currentStep"
          :disabled="formMixin.isDisabled"
        >
          <form
            novalidate
            v-if="currentStep === STEPS.saleInformation.number"
            class="app__form"
            @submit.prevent="nextStep('form.saleInformation')"
          >
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  v-model="form.saleInformation.name"
                  @blur="touchField('form.saleInformation.name')"
                  id="sale-name"
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
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <select-field
                  :values="accountOwnedAssetCodes"
                  :disabled="formMixin.isDisabled"
                  v-model="form.saleInformation.baseAsset"
                  :label="'create-sale-form.base-asset' | globalize"
                />
              </div>
            </div>
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <date-field
                  v-model="form.saleInformation.startTime"
                  :enable-time="false"
                  :disable-before="new Date().toString()"
                  @input="touchField('form.saleInformation.startTime')"
                  @blur="touchField('form.saleInformation.startTime')"
                  id="sale-start-time"
                  :label="'create-sale-form.start-time' | globalize"
                  :error-message="getFieldErrorMessage(
                    'form.saleInformation.startTime'
                  )"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <date-field
                  v-model="form.saleInformation.endTime"
                  :enable-time="false"
                  :disable-before="new Date().toString()"
                  @input="touchField('form.saleInformation.endTime')"
                  @blur="touchField('form.saleInformation.endTime')"
                  id="sale-end-time"
                  :label="'create-sale-form.close-time' | globalize"
                  :error-message="getFieldErrorMessage(
                    'form.saleInformation.endTime',{
                      minDate: form.saleInformation.startTime ||
                        new Date().toString()
                    }
                  )"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  type="number"
                  v-model="form.saleInformation.softCap"
                  @blur="touchField('form.saleInformation.softCap')"
                  id="soft-cap"
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
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  type="number"
                  v-model="form.saleInformation.hardCap"
                  @blur="touchField('form.saleInformation.hardCap')"
                  id="hard-cap"
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
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  v-model="form.saleInformation.baseAssetForHardCap"
                  @blur="touchField('form.saleInformation.baseAssetForHardCap')"
                  id="base-asset-for-hard-cap"
                  type="number"
                  :label="'create-sale-form.base-asset-hard-cap-to-sell' |
                    globalize({
                      asset: form.saleInformation.baseAsset
                    })"
                  :error-message="getFieldErrorMessage(
                    'form.saleInformation.baseAssetForHardCap',
                    {
                      from:MIN_AMOUNT,
                      to:availableForIssuance
                    }
                  )"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <p class="create-sale__price">
                  {{ 'create-sale-form.price' | globalize({
                    base: form.saleInformation.baseAsset,
                    quote: config.DEFAULT_QUOTE_ASSET
                  }) }}
                  <!-- eslint-disable-next-line max-len -->
                  {{ { value: price, currency: config.DEFAULT_QUOTE_ASSET } | formatMoney }}
                </p>
              </div>
            </div>
            <div class="app__form-row create-sale__form-row">
              {{ 'create-sale-form.accept-investments-in' | globalize }}
            </div>
            <div
              class="app__form-row create-sale__form-row"
              v-for="item in baseAssetCodes"
              :key="item"
            >
              <div class="app__form-field">
                <tick-field
                  v-model="form.saleInformation.quoteAssets"
                  :disabled="formMixin.isDisabled"
                  :cb-value="item"
                >
                  {{ item }}
                </tick-field>
              </div>
            </div>
            <div class="create-sale__error-text">
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
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <file-field
                  :label="
                    'create-sale-form.upload-image' | globalize
                  "
                  :note="
                    'create-sale-form.upload-image' | globalize
                  "
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
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                {{ 'create-sale-form.short-description' | globalize }}
                <textarea-field
                  id="sale-short-description"
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
            @submit.prevent="isFormValid() && showConfirmation()"
          >
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <input-field
                  white-autofill
                  v-model="form.fullDescription.youtubeId"
                  id="youtube-id"
                  :label="'create-sale-form.insert-youtube-video' | globalize"
                  :disabled="formMixin.isDisabled"
                />
              </div>
            </div>
            <div class="app__form-row create-sale__form-row">
              <div class="app__form-field">
                <iframe
                  v-if="form.fullDescription.youtubeId"
                  :src="`https://www.youtube.com/embed/${form.fullDescription.youtubeId}`"
                  class="create-sale__iframe" />
                <div v-else class="create-sale__youtub-video">
                  <i class="mdi mdi-youtube create-sale__video-icon" />
                  <span>
                    {{ 'create-sale-form.preview-you-video' | globalize }}
                  </span>
                </div>
              </div>
            </div>
            <div class="app__form-row create-sale__form-row">
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
                {{ 'create-sale-form.create-btn' | globalize }}
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
        <div class="create-sale__no-owned-assets">
          <i class="create-sale__no-owned-assets-icon mdi mdi-plus-network" />
          <h2>{{ 'create-sale-form.not-available' | globalize }}</h2>
          <p>{{ 'create-sale-form.asset-not-available-yet' | globalize }}</p>
        </div>
      </template>
    </template>
    <loader v-if="!isLoaded" message-id="create-sale-form.loading-msg" />
    <template v-if="isFailed">
      {{ 'create-sale-form.can-not-load-assets' | globalize }}
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
  saleInformation: {
    number: 1,
    titleId: 'create-sale-form.provide-sale-information',
  },
  shortBlurb: {
    number: 2,
    titleId: 'create-sale-form.add-short-blurb',
  },
  fullDescription: {
    number: 3,
    titleId: 'create-sale-form.full-description',
  },
}
const EVENTS = {
  close: 'close',
}
const NAME_MAX_LENGTH = 255
const DESCRIPTION_MAX_LENGTH = 255

export default {
  name: 'create-sale-form',
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
        saleInformation: {
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
          saleLogo: null,
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
          },
          endTime: {
            required,
            minDate: minDate(this.form.saleInformation.startTime ||
              new Date().toString()),
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
        .find(item => item.code === this.form.saleInformation.baseAsset)
      return asset.availableForIssuance
    },
    isUpdate () {
      return +this.request.id !== 0
    },
    price () {
      return MathUtil.divide(this.form.saleInformation.hardCap,
        this.form.saleInformation.baseAssetForHardCap)
    },
  },
  async created () {
    try {
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets.map(item => new AssetRecord(item))
      if (this.isUpdate) {
        this.populateForm(this.request)
        this.form.saleInformation.baseAsset = this.request.baseAsset
      } else {
        this.form.saleInformation.baseAsset = this.accountOwnedAssetCodes[0]
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
        Bus.success('create-sale-form.request-submitted-msg')
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
        baseAsset: this.form.saleInformation.baseAsset,
        defaultQuoteAsset: config.DEFAULT_QUOTE_ASSET,
        startTime: DateUtil.toTimestamp(this.form.saleInformation.startTime),
        endTime: DateUtil.toTimestamp(this.form.saleInformation.endTime),
        softCap: this.form.saleInformation.softCap,
        hardCap: this.form.saleInformation.hardCap,
        details: {
          name: this.form.saleInformation.name,
          short_description: this.form.shortBlurb.shortDescription,
          description: this.form.fullDescription.description,
          logo: this.form.shortBlurb.saleLogo.getDetailsForSave(),
          youtube_video_id: this.form.fullDescription.youtubeId,
        },
        baseAssetForHardCap: this.form.saleInformation.baseAssetForHardCap,
        quoteAssets: this.isUpdate ? this.form.saleInformation.quoteAssets
          : this.form.saleInformation.quoteAssets
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
        this.form.shortBlurb.saleLogo,
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
      this.form.saleInformation.name = request.name
      this.form.saleInformation.baseAsset = request.baseAsset
      this.form.saleInformation.startTime = request.startTime
      this.form.saleInformation.endTime = request.endTime
      this.form.saleInformation.softCap = request.softCap
      this.form.saleInformation.hardCap = request.hardCap
      this.form.saleInformation.baseAssetForHardCap = request
        .baseAssetForHardCap
      this.form.saleInformation.quoteAssets = request.quoteAssets
      this.form.shortBlurb.saleLogo = request.logo.key
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
  @import './app-form';

  .create-sale__form-row {
    margin-bottom: 2rem;
  }

  .create-sale__youtub-video {
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

  .create-sale__iframe {
    width: 100%;
    min-height: 26rem;
  }

  .create-sale__video-icon {
    display: flex;
    font-size: 9rem;
  }

  .create-sale__error-text {
    margin-bottom: 2rem;
    margin-top: -1rem;
    color: $col-error;
  }

  .create-sale__price {
    font-size: 1.4rem;
  }

  .create-sale__no-owned-assets {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .create-sale__no-owned-assets-icon {
    font-size: 6.4rem;
    opacity: 0.6;
  }
</style>
