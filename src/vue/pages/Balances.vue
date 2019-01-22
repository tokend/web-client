<template>
  <div class="balances">
    <tokens-list :tokens="tokens" />
  </div>
</template>

<script>
import TokensList from '@/vue/common/TokensList'

import { Sdk } from '@/sdk'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

export default {
  name: 'balances',
  components: {
    TokensList,
  },
  data: _ => ({
    tokens: [],
  }),
  computed: {
    ...mapGetters({
      account: vuexTypes.account,
    }),
  },
  async created () {
    await this.loadTokens()
  },
  methods: {
    async loadTokens () {
      try {
        const { data } = await Sdk.horizon.assets.getAll()
        this.tokens = this.account.balances.map(balance => {
          return data.find(token => token.code === balance.asset)
        })
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
