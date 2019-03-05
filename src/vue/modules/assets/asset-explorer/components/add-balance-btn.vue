<template>
  <button
    v-ripple
    class="add-balance-btn"
    :disabled="isPending"
    @click="submit"
  >
    {{ 'assets.add-balance-btn' | globalize }}
  </button>
</template>

<script>
import { Asset } from '../../shared/wrappers/asset'

import { types } from '../store/types'
import { mapActions } from 'vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'add-balance-btn',
  props: {
    asset: {
      type: Asset,
      required: true,
    },
  },
  data: _ => ({
    isPending: false,
  }),
  methods: {
    ...mapActions('asset-explorer', {
      createBalance: types.CREATE_BALANCE,
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES,
    }),
    async submit () {
      this.isPending = true
      try {
        await this.createBalance(this.asset.code)
        await this.loadAccountBalances()

        Bus.success('assets.balance-added-msg')
      } catch (e) {
        this.isPending = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.add-balance-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}
</style>
