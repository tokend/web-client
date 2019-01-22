<template>
  <div class="tokens-explorer">
    <tokens-list :tokens="tokens" />
  </div>
</template>

<script>
import TokensList from '@/vue/common/TokensList'

import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'

export default {
  name: 'tokens-explorer',
  components: {
    TokensList,
  },
  data: _ => ({
    tokens: [],
  }),
  async created () {
    await this.loadTokens()
  },
  methods: {
    async loadTokens () {
      try {
        const { data } = await Sdk.horizon.assets.getAll()
        this.tokens = data
      } catch (e) {
        console.error(e)
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
