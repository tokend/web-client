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
      v-ripple
      class="app__button-raised asset-actions__btn"
      @click="isTransferDrawerShown = true"
    >
      {{ 'assets.send-btn' | globalize }}
    </button>

    <button
      v-if="asset.owner === accountId"
      v-ripple
      class="app__button-raised asset-actions__btn"
      @click="isMassIssueDrawerShown = true"
    >
      {{ 'assets.issue-btn' | globalize }}
    </button>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form
        @operation-submitted="
          (isTransferDrawerShown = false) || updateAssetList()
        "
        :asset-to-transfer="asset.code"
      />
    </drawer>

    <drawer :is-shown.sync="isMassIssueDrawerShown">
      <template slot="heading">
        {{ 'customers-page.mass-issuance-drawer-heading' | globalize }}
      </template>

      <mass-issuance-form
        @submitted="(isMassIssueDrawerShown = false) || updateAssetList()"
      />
    </drawer>
  </div>
</template>

<script>
import { AssetRecord } from '@/js/records/entities/asset.record'

import { types } from '../store/types'
import { mapGetters, mapActions } from 'vuex'
import { vuexTypes } from '@/vuex'

import { ErrorHandler } from '@/js/helpers/error-handler'
import { Bus } from '@/js/helpers/event-bus'

import TransferForm from '@/vue/forms/TransferForm'
import MassIssuanceForm from '@/vue/forms/MassIssuanceForm'
import Drawer from '@/vue/common/Drawer'
import UpdateList from '@/vue/mixins/update-list.mixin'

const EVENTS = {
  balanceAdded: 'balance-added',
  updateClick: 'update-click',
}

export default {
  name: 'asset-actions',

  components: {
    TransferForm,
    MassIssuanceForm,
    Drawer,
  },
  mixins: [UpdateList],
  props: {
    asset: { type: AssetRecord, required: true },
  },
  data: _ => ({
    isTransferDrawerShown: false,
    isMassIssueDrawerShown: false,
    isPending: false,
    EVENTS,
  }),

  computed: {
    ...mapGetters({
      accountId: vuexTypes.accountId,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
      isAccountUnverified: vuexTypes.isAccountUnverified,
      isAccountGeneral: vuexTypes.isAccountGeneral,
      isAccountUsVerified: vuexTypes.isAccountUsVerified,
      isAccountUsAccredited: vuexTypes.isAccountUsAccredited,
      isAccountCorporate: vuexTypes.isAccountCorporate,
    }),

    ...mapGetters('asset-explorer', {
      kycRequiredAssetType: types.kycRequiredAssetType,
      securityAssetType: types.securityAssetType,
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
    updateAssetList () {
      this.emitUpdateList('assets:updateList')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.asset-actions {
  display: flex;
  flex-wrap: wrap;
  margin-top: -1rem;
  margin-left: -1rem;
  width: calc(100% + 1rem);
}

.asset-actions__btn {
  max-width: 12rem;
  width: 100%;
  margin-top: 1rem;
  margin-left: 1rem;
}

.asset-actions__not-allowed-msg {
  padding: 0.25rem 1.5rem;
  color: $col-text-secondary;
  font-style: italic;
}

</style>
