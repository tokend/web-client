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
          :cb-value="true"
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
            @input="touchField('form.assetType')"
            name="create-asset-type"
            :label="'asset-form.asset-type-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.assetType')"
            :disabled="isDisabled"
          >
            <option :value="kvAssetTypeDefault">
              {{ 'asset-form.verification-not-required-lbl' | globalize }}
            </option>
            <option :value="kvAssetTypeKycRequired">
              {{ 'asset-form.verification-required-lbl' | globalize }}
            </option>
            <option :value="kvAssetTypeSecurity">
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
import { vuexTypes, store } from '@/vuex'
import { requiredIf } from '@validators'
import { mapGetters } from 'vuex'
import { AssetFormer } from '@/js/formers/AssetFormer'

export default {
  name: 'permissions-section',

  mixins: [formMixin],

  props: {
    former: { type: AssetFormer, required: true },
    onCollect: { type: Function, required: true },
    isDisabled: { type: Boolean, default: false },
  },

  data () {
    const attrs = this.former.attrs
    const defaultAssetType = store.getters[vuexTypes.kvAssetTypeDefault]

    const isUsageRestricted = Boolean(
      attrs.assetType &&
      attrs.assetType !== defaultAssetType
    )

    return {
      form: {
        isUsageRestricted,
        assetType: isUsageRestricted ? attrs.assetType : defaultAssetType,
      },
      onCollectUnsubscriber: () => {},
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

  computed: {
    ...mapGetters([
      vuexTypes.kvAssetTypeDefault,
      vuexTypes.kvAssetTypeKycRequired,
      vuexTypes.kvAssetTypeSecurity,
      vuexTypes.accountId,
    ]),
  },

  created () {
    this.onCollect(() => { this.collect() })
  },

  beforeDestroy () {
    this.onCollectUnsubscriber()
  },

  methods: {
    collect () {
      if (!this.form.isUsageRestricted) {
        this.former.unsetAttr('assetType')
        return
      }

      this.former.mergeAttrs({
        assetType: this.form.assetType,
      })
    },
  },
}
</script>
