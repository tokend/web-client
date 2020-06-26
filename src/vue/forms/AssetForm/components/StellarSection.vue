<template>
  <div class="stellar-section">
    <h3 class="app__form-subheading">
      {{ 'asset-form.stellar' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.isIntegrated"
          :disabled="isDisabled || isOtherIntegration"
          :cb-value="true"
        >
          {{ 'asset-form.integration-with-stellar' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isIntegrated && !isOtherIntegration">
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.isDepositable"
            :disabled="isDisabled"
            :cb-value="true"
          >
            {{ 'asset-form.deposit-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <tick-field
            v-model="form.isWithdrawable"
            :disabled="isDisabled"
            :cb-value="true"
          >
            {{ 'asset-form.withdraw-lbl' | globalize }}
          </tick-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.stellarAssetType"
            name="create-asset-type"
            :label="'asset-form.stellar-type-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.stellarAssetType')"
            :disabled="isDisabled"
            @input="touchField('form.stellarAssetType')"
          >
            <option :value="STELLAR_TYPES.creditAlphanum4">
              {{ 'asset-form.alphanumeric-4-lbl' | globalize }}
            </option>
            <option :value="STELLAR_TYPES.creditAlphanum12">
              {{ 'asset-form.alphanumeric-12-lbl' | globalize }}
            </option>
            <option :value="STELLAR_TYPES.native">
              {{ 'asset-form.native-lbl' | globalize }}
            </option>
          </select-field>
        </div>
      </div>
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.stellarAssetCode"
            @blur="touchField('form.stellarAssetCode')"
            name="create-asset-stellar-code"
            :label="'asset-form.code-lbl' | globalize"
            :error-message="getFieldErrorMessage(
              'form.stellarAssetCode',
              {
                minLength: CODE_MIN_LEN_MAP[form.stellarAssetType],
                maxLength: CODE_MAX_LEN_MAP[form.stellarAssetType]
              }
            )"
            :disabled="isDisabled ||
              form.stellarAssetType === STELLAR_TYPES.native"
            :minlength="CODE_MIN_LEN_MAP[form.stellarAssetType]"
            :maxlength="CODE_MAX_LEN_MAP[form.stellarAssetType]"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { AssetFormer } from '@/js/formers/AssetFormer'
import { requiredIf, minLength, maxLength, alphaNum } from '@validators'
import { STELLAR_TYPES } from '@/js/const/asset-subtypes.const'

const STELLAR_NATIVE_ASSET_CODE = 'XLM'
const CODE_MIN_LEN_MAP = {
  [STELLAR_TYPES.creditAlphanum4]: 0,
  [STELLAR_TYPES.creditAlphanum12]: 5,
  [STELLAR_TYPES.native]: STELLAR_NATIVE_ASSET_CODE.length,
}
const CODE_MAX_LEN_MAP = {
  [STELLAR_TYPES.creditAlphanum4]: 4,
  [STELLAR_TYPES.creditAlphanum12]: 12,
  [STELLAR_TYPES.native]: STELLAR_NATIVE_ASSET_CODE.length,
}

export default {
  name: 'stellar-section',

  mixins: [formMixin],

  props: {
    former: { type: AssetFormer, required: true },
    onCollect: { type: Function, required: true },
    isDisabled: { type: Boolean, default: false },
    isOtherIntegration: { type: Boolean, default: false },
  },

  data () {
    return {
      form: {
        isIntegrated: false,
        isWithdrawable: false,
        isDepositable: false,
        stellarAssetType: '',
        stellarAssetCode: '',
      },
      onCollectUnsubscriber: () => {},
      STELLAR_TYPES,
      CODE_MIN_LEN_MAP,
      CODE_MAX_LEN_MAP,
    }
  },

  validations () {
    return {
      form: {
        stellarAssetType: {
          required: requiredIf(function () {
            return this.form.isIntegrated && !this.isOtherIntegration
          }),
        },
        stellarAssetCode: {
          required: requiredIf(function () {
            return this.form.isIntegrated && !this.isOtherIntegration
          }),
          minLength: minLength(CODE_MIN_LEN_MAP[this.form.stellarAssetType]),
          maxLength: maxLength(CODE_MAX_LEN_MAP[this.form.stellarAssetType]),
          alphaNum: alphaNum,
        },
      },
    }
  },

  watch: {
    'form.isIntegrated': {
      immediate: true,
      handler (v) { this.$emit(v ? 'enabled' : 'disabled') },
    },
    'form.stellarAssetType': {
      handler (v) {
        if (v === STELLAR_TYPES.native) {
          this.form.stellarAssetCode = STELLAR_NATIVE_ASSET_CODE
        }
      },
    },
  },

  created () {
    this.onCollect(() => { this.collect() })
    this.populateForm()
  },

  beforeDestroy () {
    this.onCollectUnsubscriber()
  },

  methods: {
    populateForm () {
      const attrs = this.former.attrs.stellarIntegration
      const isIntegrated = Boolean(attrs && (
        attrs.isWithdrawable ||
        attrs.isDepositable ||
        attrs.assetType ||
        attrs.assetCode
      ))

      this.form.isIntegrated = isIntegrated
      this.form.isWithdrawable = attrs.isWithdrawable || false
      this.form.isDepositable = attrs.isDepositable || false
      this.form.stellarAssetType = attrs.assetType || ''
      this.form.stellarAssetCode = attrs.assetCode || ''
    },

    collect () {
      if (!this.form.isIntegrated || this.isOtherIntegration) {
        this.former.unsetAttr('stellarIntegration')
        return
      }

      this.former.mergeAttrs({
        stellarIntegration: {
          isWithdrawable: this.form.isWithdrawable,
          isDepositable: this.form.isDepositable,
          assetCode: this.form.stellarAssetCode,
          assetType: this.form.stellarAssetType,
        },
      })
    },
  },
}
</script>
