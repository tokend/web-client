<template>
  <div class="pre-issuance-requests-page">
    <pre-issuance-requests-module />
  </div>
</template>

<script>
import PreIssuanceRequestsModule from '@/vue/modules/requests/pre-issuance-requests'

export default {
  name: 'pre-issuance-requests-page',
  components: {
    PreIssuanceRequestsModule,
  },
}
</script>
