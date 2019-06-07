<template>
  <div class="verification-general-2">
    <submodule-importer
      :submodule="getModule().getSubmodule(VerificationGeneralFormModule)"
      :blob-id="isFormPopulatable ? kycLatestRequestBlobId : ''"
      :request-id="isRequestUpdatable ? String(kycRequestId) : '0'"
      :general-role-id="String(kvEntryGeneralRoleId)"
      :us-verified-role-id="String(kvEntryUsVerifiedRoleId)"
      :us-accredited-role-id="String(kvEntryUsAccreditedRoleId)"

      ref="form-module-importer"
      @submit="onFormSubmit"
    />
  </div>
</template>

<script>
import { VerificationGeneralFormModule } from '@/vue/modules/verification/general-form/module'
import SubmoduleImporter from '@/modules-arch/submodule-importer'

import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'verification-general-2',
  components: {
    SubmoduleImporter,
  },
  data: _ => ({
    VerificationGeneralFormModule,
  }),
  computed: {
    ...mapGetters({
      kycState: vuexTypes.kycState,
      kycRequestId: vuexTypes.kycRequestId,
      kycLatestRequestBlobId: vuexTypes.kycLatestRequestBlobId,

      kvEntryGeneralRoleId: vuexTypes.kvEntryGeneralRoleId,
      kvEntryUsVerifiedRoleId: vuexTypes.kvEntryUsVerifiedRoleId,
      kvEntryUsAccreditedRoleId: vuexTypes.kvEntryUsAccreditedRoleId,

      isAccountRoleReseted: vuexTypes.isAccountRoleReseted,
      accountRoleToSet: vuexTypes.kycAccountRoleToSet,
      previousAccountRole: vuexTypes.kycPreviousRequestAccountRoleToSet,
    }),
    isRequestUpdatable () {
      return (
        this.kycState &&
        (
          this.kycState === REQUEST_STATES_STR.pending ||
          this.kycState === REQUEST_STATES_STR.rejected
        )
      )
    },
    isFormPopulatable () {
      return this.isAccountRoleReseted
        ? this.previousAccountRole === this.kvEntryGeneralRoleId
        : (
          this.accountRoleToSet === this.kvEntryGeneralRoleId ||
          this.accountRoleToSet === this.kvEntryUsAccreditedRoleId ||
          this.accountRoleToSet === this.kvEntryUsAccreditedRoleId
        )
    },
  },
  methods: {
    ...mapActions({
      loadKyc: vuexTypes.LOAD_KYC,
    }),
    async onFormSubmit () {
      const formRef = this.$refs['form-module-importer'].$refs['component']
      formRef.disableForm()

      // HACK: to reduce the probability of
      // request being not ingested by API
      await this.delay(3000)
      await this.loadKyc()

      Bus.success('general-form.request-submitted-msg')
      this.scrollTop()
      formRef.enableForm()
    },
    scrollTop () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    },
    delay (ms) { // TODO: should not be here
      /* eslint-disable-next-line promise/avoid-new */
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    },

  },
}
</script>

<style scoped>

</style>
