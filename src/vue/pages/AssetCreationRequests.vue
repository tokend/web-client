<template>
  <div class="asset-creation-requests-page">
    <create-asset-requests-module
      :kyc-required-asset-type="kvAssetTypeKycRequired"
    />
  </div>
</template>

<script>
import CreateAssetRequestsModule from '@/vue/modules/requests/create-asset-requests'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'asset-creation-requests-page',
  components: {
    CreateAssetRequestsModule,
  },
  computed: {
    ...mapGetters({
      kvAssetTypeKycRequired: vuexTypes.kvAssetTypeKycRequired,
    }),
  },
}
</script>
