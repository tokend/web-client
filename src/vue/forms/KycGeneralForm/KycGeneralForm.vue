<template>
  <form
    class="kyc-general-form"
    @submit.prevent="confirm"
  >
    <div class="kyc-general-form__sections">
      <personal-section
        class="kyc-general-form__section"
        :is-disabled="formMixin.isDisabled"
        :former="former"
        white-autofill
      />

      <address-section
        class="kyc-general-form__section"
        :is-disabled="formMixin.isDisabled"
        :former="former"
        white-autofill
      />

      <id-docs-section
        class="kyc-general-form__section"
        :is-disabled="formMixin.isDisabled"
        :former="former"
        white-autofill
      />

      <template v-if="!former.isRecoveryOpBuilder">
        <avatar-section
          class="kyc-general-form__section"
          :is-disabled="formMixin.isDisabled"
          :former="former"
        />
      </template>
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
        class="app__button-raised kyc-general-form__btn"
        :disabled="formMixin.isDisabled"
      >
        {{
          (isSignUpKycPage
            ? 'Become an Investor'
            : former.willUpdateRequest
              ? 'verification-form.update-btn'
              : 'verification-form.create-btn'
          ) | globalize
        }}
      </button>
    </div>
  </form>
</template>

<script>
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'
import { api } from '@/api'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import { delay } from '@/js/helpers/delay'
import { mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import formMixin from '@/vue/mixins/form.mixin'
import config from '@/config'
import PersonalSection from './components/PersonalSection'
import AvatarSection from './components/AvatarSection'
import { vueRoutes } from '@/vue-router/routes'
import AddressSection from './components/AddressSection'
import IdDocsSection from './components/IdDocsSection'

export default {
  name: 'kyc-general-form',

  components: {
    PersonalSection,
    AvatarSection,
    AddressSection,
    IdDocsSection,
  },

  mixins: [formMixin],

  props: {
    former: {
      type: KycGeneralFormer,
      default: () => new KycGeneralFormer(),
    },
  },
  computed: {
    isSignUpKycPage () {
      return this.$route.name === vueRoutes.signupKyc.name
    },
  },

  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      loadKycRecovery: vuexTypes.LOAD_KYC_RECOVERY,
    }),

    async submit () {
      this.disableForm()
      try {
        const ops = await this.former.buildOps()
        await api.postOperations(...ops)

        // TODO: after actions should not be here
        if (this.former.isUpdateOpBuilder) {
          await this.afterKycSubmit()
        } else if (this.former.isRecoveryOpBuilder) {
          await this.afterKycRecoverySubmit()
        }
        this.$emit('submitted')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.enableForm()
    },

    async afterKycSubmit () {
      await delay(config.RELOAD_TIMEOUT) // w8 for the horizon ingest
      if (this.isSignUpKycPage) {
        await this.loadAccount()
        await this.$router.push(vueRoutes.app)
      } else {
        await this.loadKyc() // update the current kyc state
        Bus.success('verification-form.request-submitted-msg')
      }
    },

    async afterKycRecoverySubmit () {
      await delay(config.RELOAD_TIMEOUT)
      await this.loadAccount()
      await this.loadKycRecovery()
      Bus.success('kyc-recovery.request-submitted-msg')
    },

    async confirm () {
      if (!this.isFormValid()) return
      if (this.isSignUpKycPage) {
        this.submit()
      } else {
        this.showConfirmation()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.kyc-general-form__sections {
  display: grid;
  grid: auto-flow auto / auto;
  gap: 4rem;
}

.kyc-general-form__btn {
  margin: 2rem auto 0;
}
</style>
