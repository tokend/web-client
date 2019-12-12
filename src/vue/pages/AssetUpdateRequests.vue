<template>
  <div class="asset-update-requests-page">
    <update-asset-requests-module />
  </div>
</template>

<script>
import UpdateAssetRequestsModule from '@/vue/modules/requests/update-asset-requests'

export default {
  name: 'asset-update-requests-page',
  components: {
    UpdateAssetRequestsModule,
  },
}
</script>
