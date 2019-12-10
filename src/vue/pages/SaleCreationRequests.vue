<template>
  <div class="sale-creation-requests-page">
    <create-sale-requests-module />
  </div>
</template>

<script>
import CreateSaleRequestsModule from '@/vue/modules/requests/create-sale-requests'

export default {
  name: 'sale-creation-requests-page',
  components: {
    CreateSaleRequestsModule,
  },
}
</script>
