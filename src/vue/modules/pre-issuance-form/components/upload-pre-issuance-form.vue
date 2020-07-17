<template>
  <form
    class="app__form upload-pre-issuance-form"
    @submit.prevent="isFormValid() && showConfirmation()"
  >
    <router-link
      class="upload-pre-issuance-form__pre-issuance-guide-link"
      :to="vueRoutes.preIssuanceGuide"
      target="_blank"
    >
      {{ 'pre-issuance-form.pre-issuance-guide-link' | globalize }}
    </router-link>
    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          :label="'pre-issuance-form.pre-issuance-lbl' | globalize"
          :note="'pre-issuance-form.file-type-note' | globalize"
          :file-extensions="['iss']"
          v-model="preIssuanceDocument"
          :disabled="formMixin.isDisabled"
          :error-message="getFieldErrorMessage('preIssuanceDocument')"
        />
      </div>
    </div>

    <issuance-viewer
      v-if="issuance.amount"
      class="upload-pre-issuance-form__issuance-details"
      :issuance="issuance"
    />

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        :is-pending="isFormSubmitting"
        @ok="submit"
        @cancel="hideConfirmation"
      />

      <button
        v-else
        v-ripple
        type="submit"
        class="pre-issuance-form__submit-btn app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        {{ 'pre-issuance-form.upload-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import IssuanceViewer from './issuance-viewer'

import FormMixin from '@/vue/mixins/form.mixin'
import ManagePreIssuanceMixin from '../mixins/manage-pre-issuance.mixin'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetNotOwnedError } from '../_errors'
import { Document } from '@tokend/js-sdk'

import { nonEmptyDocument } from '@validators'
import { vueRoutes } from '@/vue-router/routes'

const EVENTS = {
  submit: 'submit',
}

export default {
  name: 'upload-pre-issuance-form',
  components: { IssuanceViewer },
  mixins: [FormMixin, ManagePreIssuanceMixin],

  props: {
    ownedAssets: { type: Array, required: true },
  },

  data: _ => ({
    preIssuanceDocument: new Document(),
    isFormSubmitting: false,
    vueRoutes,
  }),

  validations: {
    preIssuanceDocument: { nonEmptyDocument },
  },

  watch: {
    preIssuanceDocument (value) {
      this.onPreIssuanceDocumentChange(value)
    },
  },

  methods: {
    async submit () {
      this.isFormSubmitting = true
      try {
        await this.createPreIssuanceRequest()
        Bus.success('pre-issuance-form.pre-issuance-uploaded-msg')
        this.$emit(EVENTS.submit)
      } catch (e) {
        if (e instanceof AssetNotOwnedError) {
          ErrorHandler.process(e, 'pre-issuance-form.asset-not-owned-err')
        } else {
          ErrorHandler.process(e)
        }
      }

      this.isFormSubmitting = false
      this.hideConfirmation()
    },

    async onPreIssuanceDocumentChange (newDoc) {
      if (!(newDoc instanceof Document) || newDoc.isEmpty) return

      try {
        await this.extractPreIssuance(newDoc.file)
      } catch (e) {
        ErrorHandler.process(e, 'pre-issuance-form.file-corrupted-err')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/vue/forms/app-form';

.upload-pre-issuance-form__submit-btn {
  max-width: 18rem;
  width: 100%;
}

.upload-pre-issuance-form__issuance-details {
  margin-top: 2.4rem;
}
</style>
