<template>
  <div>
    <top-bar>
      <template v-if="isInitialized && assets.length">
        <div
          slot="main"
          class="movements-top-bar__filters"
        >
          <span class="movements-top-bar__filters-prefix">
            {{ 'op-pages.filters-prefix' | globalize }}
          </span>
          <select-field
            :value="asset.code"
            @input="setAssetByCode"
            class="app__select app__select--no-border"
          >
            <option
              v-for="asset in assets"
              :key="asset.code"
              :value="asset.code"
            >
              {{ asset.nameAndCode }}
            </option>
          </select-field>
        </div>
      </template>
      <div
        v-if="!isSharesPage"
        class="movements-top-bar__actions"
        slot="extra"
      >
        <!-- TODO, currently unverified users can't withdraw, wait for
            devops initscripts update -->
        <button
          v-ripple
          class="app__button-raised movements-top-bar__actions-btn"
          @click="isWithdrawalDrawerShown = true"
          :disabled="!asset.isWithdrawable || isAccountUnverified"
          :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isWithdrawable) |
            globalize({ asset: asset.code })
          "
        >
          <i class="mdi mdi-download movements-top-bar__btn-icon" />
          {{ 'op-pages.withdraw' | globalize }}
        </button>

        <button
          v-ripple
          class="app__button-raised movements-top-bar__actions-btn"
          @click="isDepositDrawerShown = true"
          :disabled="!asset.isDepositable"
          :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isDepositable) |
            globalize({ asset: asset.code })
          "
        >
          <i class="mdi mdi-upload movements-top-bar__btn-icon" />
          {{ 'op-pages.deposit' | globalize }}
        </button>

        <button
          v-ripple
          class="app__button-raised movements-top-bar__actions-btn"
          @click="isTransferDrawerShown = true"
          :disabled="!asset.isTransferable"
          :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isTransferable) |
            globalize({ asset: asset.code })
          "
        >
          <i class="mdi mdi-send movements-top-bar__btn-icon" />
          {{ 'op-pages.send' | globalize }}
        </button>
      </div>
    </top-bar>

    <drawer :is-shown.sync="isWithdrawalDrawerShown">
      <template slot="heading">
        {{ 'withdrawal-form.withdrawal' | globalize }}
      </template>
      <withdrawal-form
        :asset-code="asset.code"
        @operation-submitted="closeWithdrawalDrawerAndEmitEvent()"
      />
    </drawer>

    <drawer :is-shown.sync="isDepositDrawerShown">
      <template slot="heading">
        {{ 'deposit-form.deposit' | globalize }}
      </template>
      <deposit-form
        :asset-code="asset.code"
      />
    </drawer>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <transfer-form
        @operation-submitted="$emit(EVENTS.movementsUpdateRequired)"
        :asset-to-transfer="asset.code"
      />
    </drawer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { vuexTypes } from '@/vuex'

import TopBar from '@/vue/common/TopBar'
import Drawer from '@/vue/common/Drawer'
import SelectField from '@/vue/fields/SelectField'

import WithdrawalForm from '@/vue/forms/WithdrawalForm'
import TransferForm from '@/vue/forms/TransferForm'
import DepositForm from '@/vue/forms/DepositForm'

import { vueRoutes } from '@/vue-router/routes'

const EVENTS = {
  assetUpdated: 'asset-updated',
  movementsUpdateRequired: 'movements-update-required',
  showNoDataMessage: 'show-no-data-message',
}

const ASSET_POLICIES_STR = {
  isDepositable: 'isDepositable',
  isWithdrawable: 'isWithdrawable',
  isTransferable: 'isTransferable',
}

export default {
  name: 'movements-top-bar',
  components: {
    SelectField,
    TopBar,
    Drawer,
    WithdrawalForm,
    TransferForm,
    DepositForm,
  },
  data: _ => ({
    isInitialized: false,
    isTransferDrawerShown: false,
    isReedemDrawerShown: false,
    isDepositDrawerShown: false,
    isWithdrawalDrawerShown: false,
    asset: {},
    EVENTS,
    ASSET_POLICIES_STR,
  }),
  computed: {
    ...mapGetters({
      balancesAssets: vuexTypes.balancesAssets,
      balancesAssetsByOwner: vuexTypes.balancesAssetsByOwner,
      ownedAssets: vuexTypes.ownedBalancesAssets,
      isAccountUnverified: vuexTypes.isAccountUnverified,
    }),

    isSharesPage () {
      return this.$route.name === vueRoutes.registerOfShares.name
    },

    assets () {
      if (this.isSharesPage) {
        return this.ownedAssets
      } else if (this.$route.query.owner) {
        return this.balancesAssetsByOwner(this.$route.query.owner)
      } else {
        return this.balancesAssets
      }
    },
  },
  watch: {
    asset: {
      deep: true,
      async handler (value) {
        await this.$router.push({
          query: { asset: value.code },
        }, () => {})
        this.$emit(EVENTS.assetUpdated, value)
      },
    },
  },
  async created () {
    await this.loadAccountBalancesDetails()
    if (!this.assets.length) {
      this.$emit(EVENTS.showNoDataMessage)
    }
    this.setDefaultAsset()
    this.isInitialized = true
  },
  methods: {
    ...mapActions({
      loadAccountBalancesDetails: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),
    setAssetByCode (code) {
      this.asset = this.assets.find(item => item.code === code)
    },
    setDefaultAsset () {
      this.asset = this.assets
        .find(item => item.code === this.$route.query.asset) ||
        this.assets[0]
    },
    getMessageIdForPolicy (policy) {
      let messageId = ''
      if (!this.asset[policy]) {
        if (policy === ASSET_POLICIES_STR.isDepositable) {
          messageId = 'op-pages.not-depositable-msg'
        } else if (policy === ASSET_POLICIES_STR.isWithdrawable) {
          if (this.isAccountUnverified) {
            messageId = 'op-pages.unverified-cant-do-msg'
          } else {
            messageId = 'op-pages.not-withdrawable-msg'
          }
        } else if (policy === ASSET_POLICIES_STR.isTransferable) {
          messageId = 'op-pages.not-transferable-msg'
        }
      }
      return messageId
    },

    closeWithdrawalDrawerAndEmitEvent () {
      this.isWithdrawalDrawerShown = false
      this.$emit(EVENTS.movementsUpdateRequired)
    },
  },
}
</script>

<style lang="scss">
@import '~@scss/variables';
@import '~@scss/mixins';

.movements-top-bar__actions {
  display: flex;
  justify-content: space-between;
}

.movements-top-bar__actions-btn {
  margin-right: 1.2rem;

  @media (max-width: $status-message-reposition-bp) {
    margin-right: 0.8rem;
    padding: 0.8rem 0.75rem;
  }

  &:last-child {
    margin-right: 0;
  }
}

.movements-top-bar__actions-btn.app__button-raised {
  line-height: 1;
}

.movements-top-bar__btn-icon {
  font-size: 1.8rem;
  margin-right: 0.5rem;
}

.movements-top-bar__filters {
  display: inline-flex;
  align-items: center;
}

.movements-top-bar__filters-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}
</style>
