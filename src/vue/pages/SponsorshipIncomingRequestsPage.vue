<template>
  <div class="sponsorship-incoming-requests-page">
    <sponsorship-requests
      is-incoming-requests
    />
  </div>
</template>

<script>
import SponsorshipRequests from '@/vue/modules/requests/sponsorship-requests'

export default {
  name: 'sponsorship-incoming-requests-page',
  components: {
    SponsorshipRequests,
  },
}
</script>
