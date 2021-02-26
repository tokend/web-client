<template>
  <form
    novalidate
    class="app__form basic-step"
    @submit.prevent="next"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @blur="touchField('form.name')"
          name="create-asset-name"
          :label="'asset-form.name-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.name',
            { length: NAME_MAX_LENGTH }
          )"
          :maxlength="NAME_MAX_LENGTH"
        />
      </div>
    </div>

    <template v-if="former.isCreateOpBuilder">
      <div class="app__form-row">
        <div class="app__form-field">
          <input-field
            white-autofill
            v-model="form.code"
            @blur="touchField('form.code')"
            name="create-asset-code"
            :label="'asset-form.code-lbl' | globalize"
            :error-message="getFieldErrorMessage('form.code')"
          />
        </div>
      </div>
    </template>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.policies"
          :cb-value="ASSET_POLICIES.transferable"
        >
          {{ 'asset-form.transferable-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.policies"
          :cb-value="ASSET_POLICIES.withdrawable"
        >
          {{ 'asset-form.withdrawable-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          name="create-asset-logo"
          v-model="form.logo"
          :note="'asset-form.logo-note' | globalize"
          :file-extensions="['jpg', 'png']"
          :document-type="DOCUMENT_TYPES.assetLogo"
          :label="'asset-form.logo-lbl' | globalize"
          :min-width="120"
          :min-height="120"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="app__button-raised basic-step__btn"
      >
        {{ 'asset-form.next-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ASSET_POLICIES } from '@tokend/js-sdk'

import { required, maxLength, assetCode } from '@validators'

import { AssetFormer } from '@/js/formers/AssetFormer'

const NAME_MAX_LENGTH = 255

export default {
  name: 'basic-step',

  mixins: [FormMixin],

  props: {
    former: { type: AssetFormer, required: true },
  },

  data () {
    return {
      form: {
        name: this.former.attrs.name || '',
        code: this.former.attrs.code || '',
        logo: this.former.attrs.logo || null,
        policies: this.former.attrs.policies || 0,
      },
      ASSET_POLICIES,
      DOCUMENT_TYPES,
      NAME_MAX_LENGTH,
    }
  },

  validations () {
    return {
      form: {
        name: {
          required,
          maxLength: maxLength(NAME_MAX_LENGTH),
        },
        code: {
          required,
          assetCode,
        },
      },
    }
  },

  methods: {
    next () {
      if (!this.isFormValid()) return
      this.former.mergeAttrs({
        name: this.form.name,
        code: this.form.code,
        logo: this.form.logo,
        policies: this.form.policies,
      })
      this.$emit('next')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';

.basic-step__btn {
  max-width: 14.4rem;
  width: 100%;
}
</style>
