<template>
  <div id="explorer-elem">
    <!--CONTENTS HERE-->
  </div>
</template>

<script>
import { initAssetsExporer } from '@/vue/modules/assets-explorer/index'

export default {
  name: 'explorer-page',
  mounted () {
    const component = initAssetsExporer(this.$store.getters.wallet, {
      horizonURL: 'https://api.achilles.tokend.io',
    })
    component.$mount('#explorer-elem')
  },
}
</script>

<style lang="scss" scoped>

</style>
