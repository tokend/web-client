<template>
  <div class="asset-creation-requests-page">
    <incoming-withdrawal-requests-module />
  </div>
</template>

<script>
import IncomingWithdrawalRequestsModule from '@/vue/modules/requests/incoming-withdrawal-requests'

export default {
  name: 'incoming-withdrawal-requests-page',
  components: {
    IncomingWithdrawalRequestsModule
  },
}
</script>
