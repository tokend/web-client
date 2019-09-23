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
              {{ asset.name }}
            </option>
          </select-field>
        </div>
      </template>
      <div
        v-if="!isSharesPage"
        class="movements-top-bar__actions"
        slot="extra"
      >
        <!-- eslint-disable-next-line max-len -->
        <template v-if="getModule().canRenderSubmodule(TransferDrawerPseudoModule)">
          <button
            v-ripple
            class="app__button-raised movements-top-bar__actions-btn"
            @click="isTransferDrawerShown = true"
            :disabled="!(asset.isTransferable && isHaveBalance)"
            :title="getMessageIdForPolicy(ASSET_POLICIES_STR.isTransferable) |
              globalize({ asset: asset.code })
            "
          >
            <i class="mdi mdi-send movements-top-bar__btn-icon" />
            {{ 'op-pages.send' | globalize }}
          </button>
        </template>
      </div>
    </top-bar>

    <drawer :is-shown.sync="isTransferDrawerShown">
      <template slot="heading">
        {{ 'transfer-form.form-heading' | globalize }}
      </template>
      <submodule-importer
        :submodule="getModule().getSubmodule(TransferDrawerPseudoModule)"
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

import SubmoduleImporter from '@/modules-arch/submodule-importer'

import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { vueRoutes } from '@/vue-router/routes'

const EVENTS = {
  assetUpdated: 'asset-updated',
  movementsUpdateRequired: 'movements-update-required',
}

const ASSET_POLICIES_STR = {
  isTransferable: 'isTransferable',
}

export default {
  name: 'movements-top-bar',
  components: {
    SelectField,
    TopBar,
    Drawer,
    SubmoduleImporter,
  },
  data: _ => ({
    isInitialized: false,
    isTransferDrawerShown: false,
    TransferDrawerPseudoModule,
    asset: {},
    EVENTS,
    ASSET_POLICIES_STR,
    isHaveBalance: true,
  }),
  computed: {
    ...mapGetters({
      balancesAssets: vuexTypes.balancesAssets,
      balancesAssetsByOwner: vuexTypes.balancesAssetsByOwner,
      accountBalanceByCode: vuexTypes.accountBalanceByCode,
      accountBalances: vuexTypes.accountBalances,
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
      handler (value) {
        this.getBalance()
        this.$router.push({
          query: { asset: value.code },
        })
        this.$emit(EVENTS.assetUpdated, value)
      },
    },
  },
  async created () {
    await this.loadAccountBalancesDetails()
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
        messageId = 'op-pages.not-transferable-msg'
      }
      return messageId
    },
    getBalance () {
      const balance = +this.accountBalanceByCode(this.asset.code).balance
      this.isHaveBalance = balance > 0
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
  color: $_lightBlack;
}

.movements-top-bar__filters-prefix {
  margin-right: 1.5rem;
  line-height: 1;
}
</style>
