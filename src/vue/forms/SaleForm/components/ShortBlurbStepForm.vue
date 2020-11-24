<template>
  <form
    novalidate
    class="app__form"
    @submit.prevent="next"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          white-autofill
          v-model="form.saleLogo"
          @blur="touchField('form.saleLogo')"
          @input="former.setAttr('saleLogo', form.saleLogo)"
          name="create-sale-logo"
          :label="'create-sale-form.sale-logo-lbl' | globalize"
          :note="'create-sale-form.sale-logo-note' | globalize"
          :file-extensions="['jpg', 'png']"
          :document-type="DOCUMENT_TYPES.saleLogo"
          :error-message="getFieldErrorMessage('form.saleLogo')"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <textarea-field
          white-autofill
          v-model="form.shortDescription"
          @blur="touchField('form.shortDescription')"
          @input="former.setAttr('shortDescription', form.shortDescription)"
          name="create-sale-short-description"
          :label="'create-sale-form.short-description-lbl' | globalize"
          :maxlength="DESCRIPTION_MAX_LENGTH"
          :error-message="getFieldErrorMessage(
            'form.shortDescription', {
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
      >
        {{ 'create-sale-form.next-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { CreateSaleRequest } from '@/js/helpers/create-sale-request-helper'

import { required, maxLength, nonEmptyDocument } from '@validators'
import { SaleFormer } from '@/js/formers/SaleFormer'
import { Document } from '@tokend/js-sdk'

const DESCRIPTION_MAX_LENGTH = 255

export default {
  name: 'short-blurb-step-form',
  mixins: [FormMixin],
  props: {
    request: { type: CreateSaleRequest, default: null },
    former: { type: SaleFormer, required: true },
  },

  data () {
    return {
      form: {
        saleLogo: this.former.attrs.saleLogo || new Document(),
        shortDescription: this.former.attrs.shortDescription || '',
      },
      DOCUMENT_TYPES,
      DESCRIPTION_MAX_LENGTH,
    }
  },

  validations () {
    return {
      form: {
        saleLogo: {
          required,
          nonEmptyDocument,
        },
        shortDescription: {
          required,
          maxLength: maxLength(DESCRIPTION_MAX_LENGTH),
        },
      },
    }
  },

  created () {
    if (this.request) {
      this.populateForm()
    }
  },

  methods: {
    populateForm () {
      this.form.saleLogo = new Document(this.former.attrs.saleLogo)
      this.form.shortDescription = this.former.attrs.shortDescription
    },

    next () {
      if (!this.isFormValid()) return
      this.former.mergeAttrs({
        saleLogo: this.form.saleLogo,
        shortDescription: this.form.shortDescription,
      })
      this.$emit('next', this.former.attrs)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';
</style>
