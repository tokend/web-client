<template>
  <div class="assets-explorer">
    <assets-list :assets="assets" />
  </div>
</template>

<script>
import AssetsList from '@/vue/common/AssetsList'

import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'assets-explorer',
  components: {
    AssetsList,
  },
  data: _ => ({
    assets: [],
  }),
  async created () {
    await this.loadAssets()
  },
  methods: {
    async loadAssets () {
      try {
        const { data } = await Sdk.horizon.assets.getAll()
        this.assets = data
      } catch (e) {
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
