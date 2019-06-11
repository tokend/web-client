<template>
  <div class="asset-actions">
    <template v-if="!isHaveBalance">
      <button
        v-if="isBalanceCreationAllowed"
        v-ripple
        class="app__button-raised asset-actions__btn"
        :disabled="isPending"
        @click="addBalance"
      >
        {{ 'assets.add-balance-btn' | globalize }}
      </button>
      <p class="asset-actions__not-allowed-msg" v-else>
        <template v-if="isAccountUsVerified">
          {{ 'assets.us-accreditation-required-msg' | globalize }}
        </template>
        <template v-else>
          {{ 'assets.verification-required-msg' | globalize }}
        </template>
      </p>
    </template>

    <button
      v-else-if="asset.owner === accountId"
      v-ripple
      class="app__button-raised asset-actions__btn"
      @click="$emit(EVENTS.updateClick)"
    >
      {{ 'assets.update-btn' | globalize }}
    </button>
  </div>
</template>

<script>
import { AssetRecord } from '@/js/records/entities/asset.record'

import { types } from '../store/types'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

const EVENTS = {
  balanceAdded: 'balance-added',
  updateClick: 'update-click',
}

export default {
  name: 'asset-actions',
  props: {
    asset: { type: AssetRecord, required: true },
    kycRequiredAssetType: { type: Number, required: true },
    securityAssetType: { type: Number, required: true },
    isAccountUnverified: { type: Boolean, required: true },
    isAccountUsVerified: { type: Boolean, required: true },
    isAccountUsAccredited: { type: Boolean, required: true },
    isAccountGeneral: { type: Boolean, required: true },
    isAccountCorporate: { type: Boolean, required: true },
  },
  data: _ => ({
    isPending: false,
    EVENTS,
  }),
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),
    isBalanceCreationAllowed () {
      switch (this.asset.type) {
        case this.kycRequiredAssetType:
          return !this.isAccountUnverified
        case this.securityAssetType:
          return this.isAccountGeneral ||
                 this.isAccountUsAccredited ||
                 this.isAccountCorporate
        default:
          return true
      }
    },
    isHaveBalance () {
      return Number.isInteger(
        +this.accountBalanceByCode(this.asset.code).balance
      )
    },
  },
  methods: {
    ...mapActions({
      loadAccountBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    ...mapActions('asset-explorer', {
      createBalance: types.CREATE_BALANCE,
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
@import '~@scss/variables';

.asset-actions__btn {
  max-width: 18rem;
  width: 100%;
}

.asset-actions__not-allowed-msg {
  padding: 0.25rem 1.5rem;
  color: $col-text-secondary;
  font-style: italic;
}

</style>
