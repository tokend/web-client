<template>
  <div class="app__card">
    <div class="app__card-header">
      <div class="md-title">Wallet tokens</div>
    </div>
    <token-list
      v-model="tokenCode"
      :tokens="userWalletTokens" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { vuexTypes } from '../../../../vuex/types'
import TokenList from '../../common/token_list/TokenList'

export default {
  name: 'wallet-overview',
  components: { TokenList },
  data: _ => ({
    tokenCode: ''
  }),
  computed: {
    ...mapGetters([
      vuexTypes.userWalletTokens
    ])
  }
}
</script>

<style scoped>

</style>
