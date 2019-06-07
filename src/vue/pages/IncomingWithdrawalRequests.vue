<template>
  <div class="asset-creation-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(IncomingWithdrawalRequestsModule)"
      :submodule="getModule().getSubmodule(IncomingWithdrawalRequestsModule)"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { IncomingWithdrawalRequestsModule } from '@/vue/modules/requests/incoming-withdrawal-requests/module'

export default {
  name: 'incoming-withdrawal-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    IncomingWithdrawalRequestsModule,
  }),
}
</script>
