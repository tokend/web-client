<template>
  <form
    class="app__form advanced-step-form"
    @submit.prevent="isFormValid() && setConfirmationState()"
  >
    <h3 class="advanced-step-form__subheading app__form-subheading">
      {{ 'update-asset-form.terms-subheading' | globalize }}
    </h3>
    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          v-model="form.terms"
          name="update-asset-terms"
          :note="'update-asset-form.terms-note' | globalize"
          :file-extensions="['jpg', 'png', 'pdf']"
          :document-type="DOCUMENT_TYPES.assetTerms"
          :label="'update-asset-form.terms-lbl' | globalize"
          :disabled="isDisabled"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation() || $emit(EVENTS.submit, form)"
        @cancel="hideConfirmation() || $emit(EVENTS.updateIsDisabled, false)"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="app__button-raised advanced-step-form__btn"
        :disabled="isDisabled"
      >
        {{ 'update-asset-form.update-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'
import { Asset } from '../wrappers/asset'

const EVENTS = {
  submit: 'submit',
  updateIsDisabled: 'update:isDisabled',
}

export default {
  name: 'advanced-step-form',
  mixins: [FormMixin],
  props: {
    record: { type: [UpdateAssetRequest, Asset], required: true },
    isDisabled: { type: Boolean, default: false },
  },

  data: _ => ({
    form: {
      terms: null,
    },
    DOCUMENT_TYPES,
    EVENTS,
  }),

  created () {
    if (this.record) {
      this.populateForm()
    }
  },

  methods: {
    populateForm () {
      this.form = {
        terms: this.record.termsKey
          ? new DocumentContainer(this.record.terms)
          : null,
      }
    },

    setConfirmationState () {
      this.showConfirmation()
      this.$emit(EVENTS.updateIsDisabled, true)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';

.advanced-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}

.advanced-step-form__subheading {
  margin: 0;

  &:not(:first-of-type) {
    margin-top: 3.2rem;
  }

  & + .app__form-row {
    margin-top: 1.2rem;
  }
}
</style>
