<template>
  <div class="atomic-swaps-explore">
    <no-data-message
      class="atomic-swap-explore__no-data-message"
      icon-name="swap-horizontal"
      :title="'atomic-swaps-explore.no-list-title' | globalize"
      message=""
    />
  </div>
</template>

<script>
import NoDataMessage from '@/vue/common/NoDataMessage'

export default {
  name: 'atomic-swaps-explore',
  components: {
    NoDataMessage,
  },
}
</script>

<style lang="scss" scoped>
</style>
