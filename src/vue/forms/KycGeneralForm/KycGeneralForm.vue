<template>
  <form
    class="kyc-general-form"
    @submit.prevent="confirm"
  >
    <div class="kyc-general-form__sections">
      <country-section
        class="kyc-general-form__section"
        :is-disabled="formMixin.isDisabled"
        :former="former"
      />

      <personal-section
        class="kyc-general-form__section"
        :is-disabled="formMixin.isDisabled"
        :former="former"
      />

      <address-section
        class="kyc-general-form__section"
        :is-disabled="formMixin.isDisabled"
        :former="former"
      />

      <id-docs-section
        class="kyc-general-form__section"
        :is-disabled="formMixin.isDisabled"
        :former="former"
      />

      <selfie-section
        class="kyc-general-form__section"
        :is-disabled="formMixin.isDisabled"
        :former="former"
      />
    </div>

    <div class="app__form-actions">
      <form-confirmation
        v-if="formMixin.isConfirmationShown"
        @ok="hideConfirmation(); submit()"
        @cancel="hideConfirmation"
      />
      <button
        v-ripple
        v-else
        type="submit"
        class="app__button-raised"
        :disabled="formMixin.isDisabled"
      >
        <template v-if="former.isCreateOpBuilder">
          {{ 'verification-form.create-btn' | globalize }}
        </template>

        <template v-else>
          {{ 'verification-form.update-btn' | globalize }}
        </template>
      </button>
    </div>
  </form>
</template>

<script>
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'
import formMixin from '@/vue/mixins/form.mixin'
import { ErrorHandler } from '@/js/helpers/error-handler'
import CountrySection from './components/CountrySection'
import PersonalSection from './components/PersonalSection'
import AddressSection from './components/AddressSection'
import IdDocsSection from './components/IdDocsSection'
import SelfieSection from './components/SelfieSection'

export default {
  name: 'kyc-general-form',

  components: {
    CountrySection,
    PersonalSection,
    AddressSection,
    IdDocsSection,
    SelfieSection,
  },

  mixins: [formMixin],

  data () {
    return {
      former: new KycGeneralFormer(),
    }
  },

  methods: {
    async submit () {
      this.disableForm()
      try {
        // TODO: kycRecoveryPage
      } catch (e) {
        this.enableForm()
        ErrorHandler.process(e)
      }
    },

    confirm () {
      console.dir(this.former.attrs)
      if (!this.isFormValid()) return
      this.showConfirmation()
    },
  },
}
</script>

<style lang="scss" scoped>
.kyc-general-form__sections {
  display: grid;
  grid: auto-flow auto / auto;
  gap: 6rem;
}
</style>
