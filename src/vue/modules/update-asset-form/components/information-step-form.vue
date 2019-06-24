<template>
  <form
    novalidate
    class="app__form information-step-form"
    @submit.prevent="isFormValid() && $emit(EVENTS.submit, form)"
  >
    <div class="app__form-row">
      <div class="app__form-field">
        <input-field
          white-autofill
          v-model="form.name"
          @blur="touchField('form.name')"
          name="update-asset-name"
          :label="'update-asset-form.name-lbl' | globalize"
          :error-message="getFieldErrorMessage(
            'form.name',
            { length: NAME_MAX_LENGTH }
          )"
          :maxlength="NAME_MAX_LENGTH"
        />
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.policies"
          :cb-value="ASSET_POLICIES.transferable"
        >
          {{ 'update-asset-form.transferable-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.policies"
          :cb-value="ASSET_POLICIES.withdrawable"
        >
          {{ 'update-asset-form.withdrawable-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.policies"
          :cb-value="ASSET_POLICIES.canBeBaseInAtomicSwap"
        >
          {{ 'update-asset-form.can-be-base-in-atomic-swap-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <tick-field
          v-model="form.policies"
          :cb-value="ASSET_POLICIES.canBeQuoteInAtomicSwap"
        >
          {{ 'update-asset-form.can-be-quote-in-atomic-swap-lbl' | globalize }}
        </tick-field>
      </div>
    </div>

    <div class="app__form-row">
      <div class="app__form-field">
        <file-field
          name="update-asset-logo"
          v-model="form.logo"
          :note="'update-asset-form.logo-note' | globalize"
          :file-extensions="['jpg', 'png']"
          :document-type="DOCUMENT_TYPES.assetLogo"
          :label="'update-asset-form.logo-lbl' | globalize"
        />
      </div>
    </div>

    <div class="app__form-actions">
      <button
        v-ripple
        type="submit"
        class="app__button-raised information-step-form__btn"
      >
        {{ 'update-asset-form.next-btn' | globalize }}
      </button>
    </div>
  </form>
</template>

<script>
import FormMixin from '@/vue/mixins/form.mixin'

import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ASSET_POLICIES } from '@tokend/js-sdk'

import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'
import { Asset } from '../wrappers/asset'

import { required, maxLength } from '@validators'

const EVENTS = {
  submit: 'submit',
}

const NAME_MAX_LENGTH = 255

export default {
  name: 'information-step-form',
  mixins: [FormMixin],
  props: {
    record: { type: [UpdateAssetRequest, Asset], required: true },
  },

  data: _ => ({
    form: {
      name: '',
      logo: null,
      policies: 0,
    },
    ASSET_POLICIES,
    DOCUMENT_TYPES,
    NAME_MAX_LENGTH,
    EVENTS,
  }),

  validations () {
    return {
      form: {
        name: {
          required,
          maxLength: maxLength(NAME_MAX_LENGTH),
        },
      },
    }
  },

  created () {
    if (this.record) {
      this.populateForm()
    }
  },

  methods: {
    populateForm () {
      this.form = {
        name: this.record.name,
        logo: this.record.logoKey
          ? new DocumentContainer(this.record.logo)
          : null,
        policies: this.record.policy,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/vue/forms/_app-form';

.information-step-form__btn {
  max-width: 14.4rem;
  width: 100%;
}
</style>
