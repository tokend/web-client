<template>
  <div class="asset-explorer">
    <asset-explorer-module
      :is-account-unverified="isAccountUnverified"
      :is-account-general="isAccountGeneral"
      :is-account-us-verified="isAccountUsVerified"
      :is-account-us-accredited="isAccountUsAccredited"
      :is-account-corporate="isAccountCorporate"
    />
  </div>
</template>

<script>
import AssetExplorerModule from '@modules/assets/asset-explorer'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'assets-explorer',
  components: {
    AssetExplorerModule,
  },
  computed: {
    ...mapGetters({
      isAccountUnverified: vuexTypes.isAccountUnverified,
      isAccountGeneral: vuexTypes.isAccountGeneral,
      isAccountUsVerified: vuexTypes.isAccountUsVerified,
      isAccountUsAccredited: vuexTypes.isAccountUsAccredited,
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),
  },
}
</script>
