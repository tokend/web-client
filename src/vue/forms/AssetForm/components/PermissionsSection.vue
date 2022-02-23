<template>
  <div class="permissions-section">
    <h3 class="app__form-subheading">
      {{ 'asset-form.permissions-subheading' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.isUsageRestricted"
          :disabled="isDisabled"
          @input="onUsageRestrictedToggle"
        >
          {{ 'asset-form.restrict-who-can-use' | globalize }}
        </tick-field>
      </div>
    </div>

    <template v-if="form.isUsageRestricted">
      <div class="app__form-row">
        <div class="app__form-field">
          <select-field
            v-model="form.assetType"
            @input="touchField('form.assetType');
                    former.setAttr('assetType', form.assetType)"
            name="create-asset-type"
            :label="'asset-form.asset-type-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.assetType')"
            :disabled="isDisabled"
          >
            <option :value="$kv.assetTypeDefault">
              {{ 'asset-form.verification-not-required-lbl' | globalize }}
            </option>
            <option :value="$kv.assetTypeKycRequired">
              {{ 'asset-form.verification-required-lbl' | globalize }}
            </option>
            <option :value="$kv.assetTypeSecurity">
              {{ 'asset-form.security-asset-lbl' | globalize }}
            </option>
          </select-field>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { requiredIf } from '@validators'
import { AssetFormer } from '@/js/formers/AssetFormer'
import { keyValues } from '@/key-values'

export default {
  name: 'permissions-section',

  mixins: [formMixin],

  props: {
    former: { type: AssetFormer, required: true },
    isDisabled: { type: Boolean, default: false },
  },

  data () {
    return {
      form: {
        isUsageRestricted: false,
        assetType: '',
      },
    }
  },

  validations () {
    return {
      form: {
        assetType: {
          required:
            requiredIf(function () { return this.form.isUsageRestricted }),
        },
      },
    }
  },

  created () {
    this.populateForm()
  },

  methods: {
    populateForm () {
      const attrs = this.former.attrs
      const defaultAssetType = keyValues.assetTypeDefault

      const isUsageRestricted = Boolean(
        attrs.assetType &&
        attrs.assetType !== defaultAssetType,
      )

      this.form.isUsageRestricted = isUsageRestricted
      this.form.assetType = attrs.assetType || defaultAssetType
    },

    onUsageRestrictedToggle (isEnabled) {
      if (isEnabled) {
        this.former.setAttr('assetType', this.form.assetType)
      } else {
        this.former.unsetAttr('assetType')
      }
    },
  },
}
</script>
