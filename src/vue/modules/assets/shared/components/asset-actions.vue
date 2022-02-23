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
      <p
        class="asset-actions__not-allowed-msg"
        v-else>
        <template v-if="isAccountUsVerified">
          {{ 'assets.us-accreditation-required-msg' | globalize }}
        </template>
        <template v-else>
          {{ 'assets.verification-required-msg' | globalize }}
        </template>
      </p>
    </template>
    <template v-else-if="asset.owner === accountId">
      <button
        v-ripple
        class="app__button-raised asset-actions__btn"
        @click="$emit(EVENTS.updateClick)"
      >
        {{ 'assets.update-btn' | globalize }}
      </button>

      <router-link
        :to="vueRoutes.registerOfShares"
        tag="button"
        class="app__button-flat asset-actions__btn"
      >
        {{ 'assets.view-shares-btn' | globalize }}
      </router-link>
    </template>
  </div>
</template>

<script>
import { AssetRecord } from '@/js/records/entities/asset.record'

import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'
import { vueRoutes } from '@/vue-router/routes'

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
    vueRoutes,
  }),
  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
    }),
    isBalanceCreationAllowed () {
      switch (this.asset.assetType) {
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
      const balance = +this.accountBalanceByCode(this.asset.code).balance
      const result = balance || balance === 0
      return result
    },
  },
  methods: {
    ...mapActions({
      createBalance: vuexTypes.CREATE_BALANCE,
    }),
    async addBalance () {
      this.isPending = true
      try {
        await this.createBalance([this.asset.code])

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

.asset-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

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
