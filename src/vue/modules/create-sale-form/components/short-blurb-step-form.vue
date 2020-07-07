<template>
  <form
    novalidate
    class="app__form"
    @submit.prevent="submit"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          :label="'create-sale-form.sale-logo-lbl' | globalize"
          :note="'create-sale-form.sale-logo-note' | globalize"
          name="create-sale-logo"
          :file-extensions="['jpg', 'png']"
          :document-type="DOCUMENT_TYPES.saleLogo"
          v-model="form.saleLogo"
          :error-message="getFieldErrorMessage('form.saleLogo')"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <textarea-field
          v-model="form.shortDescription"
          @blur="touchField('form.shortDescription')"
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
import { base } from '@tokend/js-sdk'

import { CreateSaleRequest } from '../wrappers/create-sale-request'

import { required, maxLength } from '@validators'

const EVENTS = {
  submit: 'submit',
}
const DESCRIPTION_MAX_LENGTH = 255

export default {
  name: 'short-blurb-step-form',
  mixins: [FormMixin],
  props: {
    request: { type: CreateSaleRequest, default: null },
  },

  data: _ => ({
    form: {
      saleLogo: null,
      shortDescription: '',
    },
    DOCUMENT_TYPES,
    DESCRIPTION_MAX_LENGTH,
  }),

  validations () {
    return {
      form: {
        saleLogo: {
          required,
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
      this.form = {
        saleLogo: this.request.logoKey
          ? new base.Document(this.request.logo)
          : null,
        shortDescription: this.request.shortDescription,
      }
    },

    submit () {
      if (this.isFormValid()) {
        this.$emit(EVENTS.submit, this.form)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';
</style>
