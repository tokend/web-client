<template>
  <div class="balance-creator">
    <div class="balance-creator__actions">
      <button
        v-ripple
        class="balance-creator__update-btn"
        :disabled="isPending"
        @click="submit"
      >
        {{ 'asset-details.add-balance-btn' | globalize }}
      </button>
    </div>
  </div>
</template>

<script>
import { AssetRecord } from '../asset-record'

import { mapActions } from 'vuex'
import { types } from '../store/types'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

export default {
  name: 'balance-creator',
  props: {
    asset: {
      type: AssetRecord,
      required: true,
    },
  },
  data: _ => ({
    isPending: false,
  }),
  methods: {
    ...mapActions({
      createBalance: types.CREATE_BALANCE,
      loadBalances: types.LOAD_BALANCES,
    }),
    async submit () {
      this.isPending = true
      try {
        await this.createBalance(this.asset.code)
        await this.loadBalances()

        Bus.success('asset-details.balance-added-msg')
      } catch (e) {
        ErrorHandler.process(e)
      }
      this.isPending = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss/variables";
@import "~@scss/mixins";

.balance-creator__actions {
  margin-top: 4.9rem;
  display: flex;

  button + button {
    margin-left: auto;
  }
}

.balance-creator__update-btn {
  @include button-raised();

  margin-bottom: 2rem;
  width: 18rem;
}
</style>
