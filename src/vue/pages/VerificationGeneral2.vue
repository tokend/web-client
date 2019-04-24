<template>
  <div class="verification-general-2">
    <submodule-importer
      :config="config"
      :wallet="wallet"
      :submodule="getModule().getSubmodule(VerificationGeneralFormModule)"
      :blob-id="isFormPopulatable ? kycLatestBlobId : ''"
      :request-id="isRequestUpdatable ? String(kycRequestId) : '0'"
      :general-role-id="String(kvEntryGeneralRoleId)"
    />
  </div>
</template>

<script>
import { VerificationGeneralFormModule } from '@/vue/modules/verification/general-form/module'
import SubmoduleImporter from '@/modules-arch/submodule-importer'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import { REQUEST_STATES_STR } from '@/js/const/request-states.const'

import config from '@/config'

export default {
  name: 'verification-general-2',
  components: {
    SubmoduleImporter,
  },
  data: _ => ({
    config: {
      horizonURL: config.HORIZON_SERVER,
    },
    VerificationGeneralFormModule,
  }),
  computed: {
    ...mapGetters({
      wallet: vuexTypes.wallet,

      kycState: vuexTypes.kycState,
      kycRequestId: vuexTypes.kycRequestId,
      kycLatestBlobId: vuexTypes.kycLatestBlobId,

      kvEntryGeneralRoleId: vuexTypes.kvEntryGeneralRoleId,
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
        : this.accountRoleToSet === this.kvEntryGeneralRoleId
    },
  },
}
</script>

<style scoped>

</style>
