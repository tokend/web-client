<template>
  <div class="poll-requests-page">
    <submodule-importer
      v-if="getModule().canRenderSubmodule(PollRequestsModule)"
      :submodule="getModule().getSubmodule(PollRequestsModule)"
      :should-update.sync="shouldUpdate"
    />
  </div>
</template>

<script>
import SubmoduleImporter from '@/modules-arch/submodule-importer'
import { PollRequestsModule } from '@/vue/modules/requests/poll-requests/module'

const EVENTS = {
  isPollsLoadingUpdate: 'update:isPollsLoading',
}

export default {
  name: 'poll-requests-page',
  components: {
    SubmoduleImporter,
  },
  props: {
    isPollsLoading: {
      type: Boolean,
      default: false,
    },
  },
  data: _ => ({
    PollRequestsModule,
    shouldUpdate: false,
  }),
  watch: {
    isPollsLoading (value) {
      this.shouldUpdate = value
    },
    shouldUpdate: function (value) {
      this.$emit(EVENTS.isPollsLoadingUpdate, value)
    },
  },
}
</script>
