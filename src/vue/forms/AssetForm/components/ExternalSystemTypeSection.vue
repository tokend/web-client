<template>
  <div class="external-system-type-section">
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          v-model="form.externalSystemType"
          type="number"
          :label="'asset-form.external-system-type-lbl' | globalize"
          name="create-asset-external-system-type"
          @change="former
            .setAttr('externalSystemType', form.externalSystemType)
          "
          :disabled="isDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { AssetFormer } from '@/js/formers/AssetFormer'

export default {
  name: 'external-system-type-section',

  mixins: [formMixin],

  props: {
    former: { type: AssetFormer, required: true },
    isDisabled: { type: Boolean, default: false },
  },

  data () {
    return {
      form: {
        externalSystemType: this.former.attrs.externalSystemType,
      },
    }
  },
}
</script>
