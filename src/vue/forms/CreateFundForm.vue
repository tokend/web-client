<template>
  <div class="create-fund">
    <form-stepper
      :steps="STEPS"
      :current-step.sync="currentStep"
      :disabled="formMixin.isDisabled"
    >
      <form>
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.information.name"
              @blur="touchField('form.information.name')"
              id="fund-name"
              :label="'create-fund-form.sale-name' | globalize"
              :error-message="getFieldErrorMessage('form.information.name',{
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
              v-model="form.information.baseAsset"
              :label="'create-fund-form.base-asset' | globalize"
            />
          </div>
        </div>
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            <date-field
              v-model="form.information.startTime"
              :enable-time="false"
              :disable-before="new Date().toString()"
              @blur="touchField('form.information.startTime')"
              id="fund-start-time"
              :label="'create-fund-form.start-time' | globalize"
              :error-message="getFieldErrorMessage(
                'form.information.startTime'
              )"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            <date-field
              v-model="form.information.endTime"
              :enable-time="false"
              :disable-before="form.information.startTime"
              @blur="touchField('form.information.endTime')"
              id="fund-start-time"
              :label="'create-fund-form.close-time' | globalize"
              :error-message="getFieldErrorMessage('form.information.endTime')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.information.hardCap"
              @blur="touchField('form.information.hardCap')"
              id="hard-cap"
              :label="'create-fund-form.hard-cap' | globalize"
              :error-message="getFieldErrorMessage('form.information.hardCap')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
        <div class="app__form-row create-fund__form-row">
          <div class="app__form-field">
            <input-field
              white-autofill
              v-model="form.information.softCap"
              @blur="touchField('form.information.softCap')"
              id="soft-cap"
              :label="'create-fund-form.soft-cap' | globalize"
              :error-message="getFieldErrorMessage('form.information.softCap')"
              :disabled="formMixin.isDisabled"
            />
          </div>
        </div>
      </form>
    </form-stepper>
  </div>
</template>

<script>
import FormStepper from '@/vue/common/FormStepper'
import FormMixin from '@/vue/mixins/form.mixin'

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
  },
  mixins: [FormMixin],
  data () {
    return {
      STEPS,
      NAME_MAX_LENGTH,
      currentStep: 1,
      assets: [],
      form: {
        information: {
          name: '',
          baseAsset: '',
          startTime: '',
          endTime: '',
          softCap: '',
          hardCap: '',
          baseAssetForHardCap: '',
        },
      },
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
  methods: {},
}
</script>

<style lang="scss" scoped>

  .create-fund__form-row {
    margin-bottom: 2rem;
  }
</style>
