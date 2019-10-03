<template>
  <div class="sponsorship-outgoing-requests-page">
    <sponsorship-requests />
  </div>
</template>

<script>
import SponsorshipRequests from '@/vue/modules/requests/sponsorship-requests'

export default {
  name: 'sponsorship-outgoing-requests-page',
  components: {
    SponsorshipRequests,
  },
}
</script>
