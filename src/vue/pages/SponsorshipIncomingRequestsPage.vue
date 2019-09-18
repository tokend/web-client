<template>
  <div class="sponsorship-incoming-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(SponsorshipRequestsModule)"
      :submodule="getModule().getSubmodule(SponsorshipRequestsModule)"
      is-incoming-requests
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { SponsorshipRequestsModule } from '@/vue/modules/requests/sponsorship-requests/module'

export default {
  name: 'sponsorship-incoming-requests-page',
  components: {
    SubmoduleImporter,
  },

  data: _ => ({
    SponsorshipRequestsModule,
  }),
}
</script>
