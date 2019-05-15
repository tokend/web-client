<template>
  <div class="pre-issuance-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(PreIssuanceRequestsModule)"
      :submodule="getModule().getSubmodule(PreIssuanceRequestsModule)"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { PreIssuanceRequestsModule } from '@/vue/modules/requests/pre-issuance-requests/module'

export default {
  name: 'pre-issuance-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    PreIssuanceRequestsModule,
  }),
}
</script>
