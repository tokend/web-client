<template>
  <div class="terms-section">
    <h3 class="advanced-step__subheading app__form-subheading">
      {{ 'asset-form.terms-subheading' | globalize }}
    </h3>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="form.terms"
          name="create-asset-terms"
          :note="'asset-form.terms-note' | globalize"
          :file-extensions="['jpg', 'png', 'pdf']"
          :document-type="DOCUMENT_TYPES.assetTerms"
          :label="'asset-form.terms-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
    </div>
  </div>
</template>

<script>
import formMixin from '@/vue/mixins/form.mixin'
import { AssetFormer } from '@/js/formers/AssetFormer'
import { DOCUMENT_TYPES } from '@/js/const/document-types.const'

export default {
  name: 'terms-section',

  mixins: [formMixin],

  props: {
    former: { type: AssetFormer, required: true },
    onCollect: { type: Function, required: true },
    isDisabled: { type: Boolean, default: false },
  },

  data () {
    return {
      form: {
        terms: this.former.attrs.terms,
      },
      onCollectUnsubscriber: () => { },
      DOCUMENT_TYPES,
    }
  },

  created () {
    this.onCollect(() => { this.collect() })
  },

  beforeDestroy () {
    this.onCollectUnsubscriber()
  },

  methods: {
    collect () {
      this.former.setAttr('terms', this.form.terms)
    },
  },
}
</script>
