<template>
  <div class="assets-explorer">
    <assets-list :assets="assets" />
  </div>
</template>

<script>
import AssetsList from '@/vue/common/AssetsList'

import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { AssetRecord } from '@/js/records/entities/asset.record'

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
        this.assets = data.map(asset => new AssetRecord(asset))
      } catch (e) {
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
