<template>
  <div class="trade">
    <polls-top-bar @reload-trade-data="isPollsLoading = true" />
    <router-view :is-loading.sync="isPollsLoading" />
  </div>
</template>

<script>
import PollsTopBar from '@/vue/common/polls/PollsTopBar'

export default {
  name: 'polls',
  components: { PollsTopBar },
  data: _ => ({
    isPollsLoading: false,
  }),
}
</script>

<style scoped lang="scss"/>
