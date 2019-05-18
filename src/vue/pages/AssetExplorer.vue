<template>
  <div class="asset-explorer">
    <template v-if="getModule().canRenderSubmodule(AssetExplorerModule)">
      <submodule-importer
        :submodule="getModule().getSubmodule(AssetExplorerModule)"
        :is-account-unverified="isAccountUnverified"
        :is-account-general="isAccountGeneral"
        :is-account-us-verified="isAccountUsVerified"
        :is-account-us-accredited="isAccountUsAccredited"
        :is-account-corporate="isAccountCorporate"
      />
    </template>
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { AssetExplorerModule } from '@modules/assets/asset-explorer/module'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'assets-explorer',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    AssetExplorerModule,
  }),
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
