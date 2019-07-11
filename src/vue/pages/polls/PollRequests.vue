<template>
  <div class="poll-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(PollRequestsModule)"
      :submodule="getModule().getSubmodule(PollRequestsModule)"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { PollRequestsModule } from '@/vue/modules/requests/poll-requests/module'

export default {
  name: 'poll-requests-page',
  components: {
    SubmoduleImporter,
  },
  data: _ => ({
    PollRequestsModule,
  }),
}
</script>
