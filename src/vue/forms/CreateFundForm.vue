<template>
  <div class="create-fund">
    <form-stepper
      :steps="STEPS"
      :current-step.sync="currentStep"
      :disabled="formMixin.isDisabled"
    >
      <form
        novalidate
        v-if="currentStep === STEPS.fundInformation.number"
        class="app__form asset-form"
        @submit.prevent="next('form.fundInformation')"
      >
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.fundInformation.name"
              @blur="touchField('form.fundInformation.name')"
              id="fund-name"
              :label="'create-fund-form.sale-name' | globalize"
              :error-message="getFieldErrorMessage('form.fundInformation.name',{
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
              :values="baseAssets"
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
              :disable-before="form.fundInformation.startTime"
              @blur="touchField('form.fundInformation.endTime')"
              id="fund-end-time"
              :label="'create-fund-form.close-time' | globalize"
              :error-message="getFieldErrorMessage(
                'form.fundInformation.endTime'
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.fundInformation.softCap"
              @blur="touchField('form.fundInformation.softCap')"
              id="soft-cap"
              :label="'create-fund-form.soft-cap' | globalize"
              :error-message="getFieldErrorMessage(
                'form.fundInformation.softCap'
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.fundInformation.hardCap"
              @blur="touchField('form.fundInformation.hardCap')"
              id="hard-cap"
              :label="'create-fund-form.hard-cap' | globalize"
              :error-message="getFieldErrorMessage(
                'form.fundInformation.hardCap'
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
              :label="'create-fund-form.base-asset-hard-cap-to-sell' |
                globalize({
                  asset: form.fundInformation.baseAsset
                })"
              :error-message="getFieldErrorMessage(
                'form.fundInformation.baseAssetForHardCap'
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-fund__form-row">
          {{ 'create-fund-form.accept-investments-in' | globalize }}
        </div>
        <div
          class="app__form-row create-fund__form-row"
          v-for="item in baseAssets"
          :key="item"
        >
          <div
            class="app__form-field"
          >
            <tick-field
              v-model="form.fundInformation.acceptInvestmentsIn"
              :disabled="formMixin.isDisabled"
              :cb-value="item"
            >
              {{ item }}
            </tick-field>
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
        novalidate
        v-if="currentStep === STEPS.shortBlurb.number"
        class="app__form asset-form"
        @submit.prevent="next('form.shortBlurb')"
      >
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            <file-field
              :label="
                'create-fund-form.image-users-will-see-in-searcher' | globalize
              "
              :note="
                'create-fund-form.image-users-will-see-in-searcher' | globalize
              "
              accept="image/*, .pdf"
              v-model="form.shortBlurb.fundLogo"
              :disabled="formMixin.isDisabled"
              :error-message="getFieldErrorMessage('form.shortBlurb.fundLogo')"
            />
          </div>
        </div>
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            <textarea-field
              id="fund-short-description"
              v-model="form.shortBlurb.shortDescription"
              @blur="touchField('form.shortBlurb.shortDescription')"
              :label="'transfer-form.subject-lbl' | globalize({ length: 250 })"
              :maxlength="250"
              :error-message="getFieldErrorMessage(
                'form.shortBlurb.shortDescription'
              )"
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
        novalidate
        v-if="currentStep === STEPS.fullDescription.number"
        class="app__form asset-form"
        @submit.prevent="next('form.shortBlurb')"
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
              <span>Preview you video</span>
            </div>
          </div>
        </div>
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            {{ 'create-fund-form.full-description' | globalize }}
            <description-editor
              class="description-step__editor"
              v-model="form.fullDescription.description" />
          </div>
        </div>
      </form>
    </form-stepper>
  </div>
</template>

<script>
import FormStepper from '@/vue/common/FormStepper'
import FormMixin from '@/vue/mixins/form.mixin'
import DescriptionEditor from '@/vue/common/DescriptionEditor'

import { Sdk } from '@/sdk'
import { required, maxLength } from '@validators'
import { AssetRecord } from '@/js/records/entities/asset.record'
import { ErrorHandler } from '@/js/helpers/error-handler'

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
const NAME_MAX_LENGTH = 255

export default {
  name: 'trade-orders-buy',
  components: {
    FormStepper,
    DescriptionEditor,
  },
  mixins: [FormMixin],
  data () {
    return {
      STEPS,
      NAME_MAX_LENGTH,
      currentStep: 3,
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
          acceptInvestmentsIn: [],
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
          },
          softCap: {
            required,
          },
          hardCap: {
            required,
          },
          baseAssetForHardCap: {
            required,
          },
        },
        shortBlurb: {
          fundLogo: {
            required,
          },
          shortDescription: {
            required,
          },
        },
      },
    }
  },
  computed: {
    baseAssets () {
      return this.assets.map(item => item.code)
    },
  },
  watch: {},
  async created () {
    try {
      const { data: assets } = await Sdk.horizon.assets.getAll()
      this.assets = assets.map(item => new AssetRecord(item))
    } catch (e) {
      ErrorHandler.processWithoutFeedback(e)
    }
  },
  destroyed () {
  },
  methods: {
    next (formStep) {
      if (this.isFormValid(formStep)) {
        this.currentStep++
      }
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
</style>
