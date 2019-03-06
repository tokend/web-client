<template>
  <div class="asset-actions-bar">
    <button
      v-if="!asset.balance"
      v-ripple
      class="app__button-raised asset-actions-bar__btn"
      :disabled="isPending"
      @click="addBalance"
    >
      {{ 'assets.add-balance-btn' | globalize }}
    </button>

    <button
      v-else-if="asset.owner === accountId"
      v-ripple
      class="app__button-raised asset-actions-bar__btn"
      @click="$emit(EVENTS.updateAsk)"
    >
      {{ 'assets.update-btn' | globalize }}
    </button>
  </div>
</template>

<script>
import Asset from '../../shared/wrappers/asset'

import { types } from '../store/types'
import { mapGetters, mapActions } from 'vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  balanceAdded: 'balance-added',
  updateAsk: 'update-ask',
}

export default {
  name: 'asset-actions-bar',
  props: {
    asset: { type: Asset, required: true },
  },
  data: _ => ({
    isPending: false,
    EVENTS,
  }),
  computed: {
    ...mapGetters('asset-explorer', {
      accountId: types.accountId,
    }),
  },
  methods: {
    ...mapActions('asset-explorer', {
      createBalance: types.CREATE_BALANCE,
      loadAccountBalances: types.LOAD_ACCOUNT_BALANCES,
    }),
    async addBalance () {
      this.isPending = true
      try {
        await this.createBalance(this.asset.code)
        await this.loadAccountBalances()

        Bus.success('assets.balance-added-msg')
        this.$emit(EVENTS.balanceAdded)
      } catch (e) {
        this.isPending = false
        ErrorHandler.process(e)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.asset-actions-bar__btn {
  max-width: 18rem;
  width: 100%;
}
</style>
