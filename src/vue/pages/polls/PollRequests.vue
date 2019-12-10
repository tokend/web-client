<template>
  <div class="poll-requests-page">
    <poll-requests-module />
  </div>
</template>

<script>
import PollRequestsModule from '@/vue/modules/requests/poll-requests'

export default {
  name: 'poll-requests-page',
  components: {
    PollRequestsModule,
  },
}
</script>
