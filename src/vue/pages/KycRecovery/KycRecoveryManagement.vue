<template>
  <div class="kyc-recovery-management">
    <div class="kyc-recovery-management__inner">
      <div class="kyc-recovery-management__top-bar">
        <div class="kyc-recovery-management__top-bar-title-wrp">
          <h1 class="kyc-recovery-management__top-bar-title">
            {{ 'pages-names.kyc-recovery' | globalize }}
          </h1>
        </div>
        <button
          class="app__button-flat"
          @click="onLogOutClick"
        >
          {{ 'kyc-recovery-state-message.sign-out-btn' | globalize }}
        </button>
      </div>
      <h3>
        {{ 'kyc-recovery-state-message.limited-functionality-msg' | globalize }}
      </h3>
      <template v-if="isLoaded">
        <kyc-recovery-state-message />
        <template v-if="isAccountKycRecoveryInProgress">
          <template v-if="isAccountUnverified">
            <kyc-recovery-unverified @submitted="onSubmit" />
          </template>
          <template v-else-if="isAccountGeneral">
            <verification-general-form
              class="kyc-recovery-management__form"
              :former="former"
              @submitted="onSubmit"
            />
          </template>
          <verification-corporate-form
            v-else-if="isAccountCorporate"
            @kyc-recovery-submit="onSubmit"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import KycRecoveryUnverified from '@/vue/pages/KycRecovery/KycRecoveryUnverified'
import VerificationGeneralForm from '@/vue/forms/KycGeneralForm'
import VerificationCorporateForm from '@/vue/pages/VerificationCorporate'
import KycRecoveryStateMessage from '@/vue/pages/KycRecovery/KycRecoveryStateMessage'
import { scrollToTop } from '@/js/helpers/scroll-helpers'
import { KycGeneralFormer } from '@/js/formers/KycGeneralFormer'
import { KycCorporateFormer } from '@/js/formers/KycCorporateFormer'

export default {
  name: 'kyc-recovery-management',
  components: {
    KycRecoveryUnverified,
    KycRecoveryStateMessage,
    VerificationGeneralForm,
    VerificationCorporateForm,
  },
  data: _ => ({
    isLoaded: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.kycRecoveryRequest,
      vuexTypes.isAccountKycRecoveryInitiated,
      vuexTypes.isAccountKycRecoveryInProgress,
      vuexTypes.isAccountGeneral,
      vuexTypes.isAccountCorporate,
      vuexTypes.isAccountUnverified,
    ]),

    former () {
      const request = this.kycRecoveryRequest
      switch (true) {
        case this.isAccountGeneral: return new KycGeneralFormer(request)
        case this.isAccountCorporate: return new KycCorporateFormer(request)
        default: return null
      }
    },
  },

  async created () {
    await this.ensureKycRecoveryRequestExists()
    this.isLoaded = true
  },

  methods: {
    ...mapActions({
      loadKycRecovery: vuexTypes.LOAD_KYC_RECOVERY,
      logOut: vuexTypes.LOG_OUT,
    }),

    async ensureKycRecoveryRequestExists () {
      if (this.kycRecoveryRequest.isExists) return
      if (!this.isAccountKycRecoveryInProgress) return
      try {
        await this.loadKycRecovery()
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    },

    onSubmit () {
      scrollToTop()
    },

    onLogOutClick () {
      this.logOut()
      location.reload()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.kyc-recovery-management__inner {
  padding: 3.5rem 16rem;
}

.kyc-recovery-management__top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kyc-recovery-management__top-bar-title {
  color: $col-text-page-heading;
  font-size: 4rem;
  line-height: 1.5;
  font-weight: 400;
  min-width: 15rem;

  @include respond-to-custom($sidebar-hide-bp) {
    font-size: 3.2rem;
  }
}

.kyc-recovery-management__form {
  margin-top: 1rem;
  background-color: $col-block-bg;
  padding: 2.4rem;

  @include box-shadow();
}
</style>
