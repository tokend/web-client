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
          @click="logOut"
        >
          {{ 'kyc-recovery-state-message.sign-out-btn' | globalize }}
        </button>
      </div>
      <h3>
        {{ 'kyc-recovery-state-message.limited-functionality-msg' | globalize }}
      </h3>
      <template v-if="isLoaded">
        <kyc-recovery-state-message />
        <kyc-recovery-unverified
          v-if="isAccountUnverified"
          @kyc-recovery-submit="onSubmit" />
        <verification-general
          v-else-if="isAccountGeneral"
          @kyc-recovery-submit="onSubmit" />
        <verification-corporate-form
          v-else-if="isAccountCorporate"
          @kyc-recovery-submit="onSubmit" />
      </template>
    </div>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'
import KycRecoveryUnverified from '@/vue/pages/KycRecovery/KycRecoveryUnverified'
import VerificationGeneral from '@/vue/pages/VerificationGeneral'
import VerificationCorporateForm from '@/vue/pages/VerificationCorporate'
import KycRecoveryStateMessage from '@/vue/pages/KycRecovery/KycRecoveryStateMessage'
import config from '@/config'

export default {
  name: 'kyc-recovery-management',
  components: {
    KycRecoveryUnverified,
    KycRecoveryStateMessage,
    VerificationGeneral,
    VerificationCorporateForm,
  },
  data: _ => ({
    isLoaded: false,
  }),
  computed: {
    ...mapGetters([
      vuexTypes.isAccountGeneral,
      vuexTypes.isAccountCorporate,
      vuexTypes.isAccountUnverified,
      vuexTypes.isKycRecoveryInited,
      vuexTypes.walletEmail,
      vuexTypes.walletAccountId,
      vuexTypes.accountKycRecoveryStatus,
    ]),
  },

  async created () {
    if (!this.isKycRecoveryInited) {
      try {
        await this.loadKycRecovery()
      } catch (e) {
        ErrorHandler.processWithoutFeedback(e)
      }
    }
    this.isLoaded = true
  },

  methods: {
    ...mapActions({
      loadKycRecovery: vuexTypes.LOAD_KYC_RECOVERY,
      loadAccount: vuexTypes.LOAD_ACCOUNT,
      logOutAccount: vuexTypes.LOG_OUT,
    }),

    async onSubmit () {
      await this.delay(config.RELOAD_TIMEOUT)
      // eslint-disable-next-line
      const updatedAccount = await this.loadAccount(this.walletAccountId)
      // eslint-disable-next-line
      const updatedKycRecoveryRequest = await this.loadKycRecovery()
      Bus.success('kyc-recovery.request-submitted-msg')
    },

    delay (ms) {
      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve, reject) => {
        resolve(setTimeout(resolve, ms))
      })
    },
    logOut () {
      this.logOutAccount()
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
</style>
